// Module used to evalute which tasks need to be done and enqueue them

// Repair - roads -only repair if enough to justify a full "tank" of energy for the default creep type of that tier, or defensive and being invaded
// Build - only if construction needs to happen, higher priority for Defensive structures, extensions, spawns
// Attack - highest priority if invaders
// Upgrade
// Mine - task that doesnt expire until the creep dies then goes back on the queue. need 1 for each available mining location
var task = require('task');
var common = require('common');

var overlord = {

    meetNeedsHarvesting: function(roomName) {
        //return which source needs a harvester or null if all are full
        //get sources in room and ids
        //get harvestable location count for each
        var sources = JSON.parse(JSON.stringify(Memory.rooms[roomName].sources));
        var enqueuedharvestTasks = task.getEnqueuedTasksOfType(roomName,"harvest");
        var activeHarvestTasks = task.getAssignedTasksOfType(roomName,"harvest");
        for (var sourceId in sources){
            if (sources[sourceId].dropOffId != null) {
                for (var queuedTaskIndex in enqueuedharvestTasks) {
                    if (enqueuedharvestTasks[queuedTaskIndex].targetId == sourceId) {
                        sources[sourceId].maxHarvesters =  sources[sourceId].maxHarvesters - 1;
                    }
                }
                for (var activeTaskIndex in activeHarvestTasks) {
                    if (activeHarvestTasks[activeTaskIndex].targetId == sourceId) {
                        sources[sourceId].maxHarvesters =  sources[sourceId].maxHarvesters - 1;
                    }
                }
                for (let i = 0; i < sources[sourceId].maxHarvesters; i++) {
                    task.queueHarvestTask(roomName, sourceId, sources[sourceId].dropOffId);
                }
            }
        }
    },

    meetNeedsUpgrading: function(roomName) {
        // get location count available for upgrades
        // get screeps with memory for their task indicating upgrade
        // get enqueued tasks for this room for upgrading
        var enquedUpgradeTasks = task.getEnqueuedTasksOfType(roomName,"upgrade");
        var activeUpgradeTasks = task.getAssignedTasksOfType(roomName,"upgrade");
        var unAssignedCreeps = task.getUnassignedCreeps(roomName);
        var energyPickupLocations = common.getEnergyPickupLocations(roomName);
        if (unAssignedCreeps.length > 0 || activeUpgradeTasks.length + enquedUpgradeTasks.length == 0){
            var sourceId = Game.rooms[roomName].controller.pos.findClosestByPath(energyPickupLocations).id;
            task.queueUpgradeTask(roomName,sourceId);
        }
        // if upgrading screeps + enqueued tasks <= available upgrade locations
        //enqueue any needed tasks
    },

    meetNeedsConstructing: function(roomName) {
        // See how many construction sites exist
        var room = Game.rooms[roomName];
        var constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
        var enquedConstructTasks = task.getEnqueuedTasksOfType(roomName,"construct");
        var activeConstructionTasks = task.getAssignedTasksOfType(roomName,"construct");
        var activeSites = [];
        var energyPickupLocations = common.getEnergyPickupLocations(roomName);
        for (var siteIndex in constructionSites){
            var targetSite = constructionSites[siteIndex];
            for (var queuedTaskIndex in enquedConstructTasks) {
                var queuedTask = enquedConstructTasks[queuedTaskIndex];
                if (queuedTask.targetId == targetSite.id) {
                    activeSites.push(targetSite);
                }
            }
            for (var activeTaskIndex in activeConstructionTasks) {
                var activeTask = activeConstructionTasks[activeTaskIndex];
                if (activeTask.targetId == targetSite.id) {  
                    activeSites.push(targetSite);
                }
            }
        }
        var inactiveSites = _.difference(constructionSites, activeSites);
        for (var inactiveSiteIndex in inactiveSites) {
            var inactiveSite = inactiveSites[inactiveSiteIndex];
            var energyPickup = inactiveSite.pos.findClosestByPath(energyPickupLocations);
            task.queueConstructTask(roomName,inactiveSite.id,energyPickup.id)
        }
    },

    meetNeedsHauling: function(roomName) {
        var room = Game.rooms[roomName];
        var controller = room.controller;
        //Make sure at least one container/storage exists first
        var energyPickupLocations = common.getEnergyPickupLocations(roomName);
        if (!(energyPickupLocations && energyPickupLocations.length > 0 && !(energyPickupLocations[0] instanceof Source))){
            return;
        }
        var enquedHaulTasks = task.getEnqueuedTasksOfType(roomName,"haul");
        var activeHaulTasks = task.getAssignedTasksOfType(roomName,"haul");
        var controllerSouroundings = room.lookAtArea(controller.pos.y - 3, controller.pos.x - 3, controller.pos.y + 3, controller.pos.x + 3, true);
        var controllerContainers = _.filter(controllerSouroundings, function (object) {
            return (object.type = "structure" && object.structure && object.structure.structureType == STRUCTURE_CONTAINER);
        });
        var controllerContainer = null;
        if (controllerContainers && controllerContainers.length > 0) {
            controllerContainer = controllerContainers[0];
        }
        var isActiveSpawnDuty = false;
        var isActiveUgradeHauler = false;
        //for each source, need to do one hauler to storage if it exists
        //if storage, need one hauler from that to upgrade container
        for(var queuedTaskIndex in enquedHaulTasks){
            if(enquedHaulTasks[queuedTaskIndex].spawnDuty){
                isActiveSpawnDuty = true;
            }
            else if (controllerContainer && enquedHaulTasks[queuedTaskIndex].targetId == controllerContainer.id) {
                isActiveUgradeHauler = true;
            } 
        }
        for(var activeTaskIndex in activeHaulTasks){
            if(activeHaulTasks[activeTaskIndex].spawnDuty){
                isActiveSpawnDuty = true;
            }
            else if (controllerContainer && activeHaulTasks[activeTaskIndex].targetId == controllerContainer.id) {
                isActiveUgradeHauler = true;
            } 
        }
        if(!isActiveSpawnDuty) {
            var spawn = Game.rooms[roomName].find(FIND_MY_SPAWNS)[0];
            var energyPickup = spawn.pos.findClosestByPath(energyPickupLocations);
            task.queueHaulTask(roomName,spawn.id,energyPickup.id);
        }
        if(controllerContainer && !isActiveUgradeHauler) {
            var energyPickup = controllerContainer.pos.findClosestByPath(energyPickupLocations);
            task.queueHaulTask(roomName,controllerContainer.id,energyPickup.id);
        }
    },

    meetNeeds: function(roomName) {
        console.log("Evaluating tasks needed");
        this.meetNeedsHarvesting(roomName);
        this.meetNeedsHauling(roomName);
        this.meetNeedsUpgrading(roomName);
        this.meetNeedsConstructing(roomName);
    }
};

module.exports = overlord;