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
        var room = Game.rooms[roomName];
        if (room.energyCapacityAvailable <= 300){ //TODO change to if no drop off containers exist?
            return; //Dont need harvesters at tier 1, need upgrades and construction
        }
        //return which source needs a harvester or null if all are full
        //get sources in room and ids
        //get harvestable location count for each
        var sources = Memory.rooms[roomName].sources;
        var enqueuedharvestTasks = task.getEnqueuedTasksOfType(roomName,"harvest");
        var activeHarvestTasks = task.getAssignedTasksOfType(roomName,"harvest");
        for (var sourceId in sources){
            for (var queuedTask in enqueuedharvestTasks) {
                if (queuedTask.targetId == sourceId) {
                    sources[sourceId].maxHarvesters =  sources[sourceId].maxHarvesters - 1;
                }
            }
            for (var activeTask in activeHarvestTasks) {
                if (activeTask.targetId == sourceId) {
                    sources[sourceId].maxHarvesters =  sources[sourceId].maxHarvesters - 1;
                }
            }
            for (let i = 0; i < sources[sourceId].maxHarvesters; i++) {
                task.queueHarvestTask(roomName, sourceId, sources[sourceId].dropOffId);
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
        //Make sure at least one container/storage exists first
        //enqueue any needed tasks
    },

    meetNeeds: function(roomName) {
        console.log("Evaluating tasks needed");
        this.meetNeedsHarvesting(roomName);
        this.meetNeedsUpgrading(roomName);
        this.meetNeedsConstructing(roomName);
        this.meetNeedsHauling(roomName);
    }
};

module.exports = overlord;