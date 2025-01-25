// Module for encoding/decoding tasks from memory for actions.
// https://docs.screeps.com/global-objects.html#Memory-object
// https://docs.screeps.com/api/#RawMemory

var task = {
    queueUpgradeTask: function(roomName,sourceId) {
        var upgradeTask = {
            "type": "upgrade",
            "targetId": Game.rooms[roomName].controller.id,
            "energySourceId": sourceId
        };
        Memory.tasks[roomName].push(upgradeTask);
    },
    queueHarvestTask: function(roomName, targetId, dropOffId) {
        var harvest = {
            "type": "harvest",
            "targetId": targetId,
            "dropOffId": dropOffId ? dropOffId : Game.getObjectById(targetId).pos.findClosestByPath(FIND_MY_SPAWNS).id
        };
        Memory.tasks[roomName].push(harvest);
    },
    queueConstructTask: function(roomName,targetSiteId,sourceId) {
        var construct = {
            "type": "construct",
            "targetId": targetSiteId,
            "energySourceId": sourceId,
        };
        Memory.tasks[roomName].push(construct);
    },
    queueHaulTask: function(roomName,targetId,sourceId) {
        var haul = {
            "type": "haul",
            "targetId": targetId,
            "energySourceId": sourceId,
        };
        Memory.tasks[roomName].push(haul);
    },
    assignTask: function(creep) {
        var room = creep.room
        if(Memory.tasks[room.name].length > 0) {
            Memory.creeps[creep.name].task = this.getNextTask(room.name);
            return Memory.creeps[creep.name].task;
        }
        return null;
    },

    getCreepTask: function(creep){
        var creepTask = Memory.creeps[creep.name].task;
        if(creepTask) {
            return creepTask;
        }
        return this.assignTask(creep);
    },

    resetCreepTask: function(creep){
        Memory.creeps[creep.name].task = null;
    },

    getNextTask: function(roomName) {
        return Memory.tasks[roomName].shift();
    },

    noTasks: function(roomName) {
        return Memory.tasks[roomName].length == 0;
    },
    
    getEnqueuedHarvestTasks: function(roomName) {
        var allEnqueued = Memory.tasks[roomName];
        var enqueuedHarvestTasks = _.filter(allEnqueued, function (task) {
            return task.type == "harvest";
        });
        return enqueuedHarvestTasks;
    },

    getAssignedHarvestTasks: function(roomName) {
        var allCreeps = Game.creeps;
        var roomCreeps = _.filter(allCreeps, function (creep) {
            return creep.room.name == roomName;
        });
        var assignedHarvestCreeps = _.filter(roomCreeps, function (creep) {
            return creep.getCreepTask.type == "harvest";
        });
        return assignedHarvestCreeps;
    },

};

module.exports = task;

