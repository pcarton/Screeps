// Module for encoding/decoding tasks from memory for actions.
// https://docs.screeps.com/global-objects.html#Memory-object
// https://docs.screeps.com/api/#RawMemory

var task = {
    queueUpgradeTask: function(roomName) {
        var upgradeTask = {
            "type": "upgrade",
            "targetId": Game.rooms[roomName].controller.id,
        };
        Memory.tasks[roomName].push(upgradeTask);
    },
    queueHarvestTask: function(roomName, sourceId) {
        var harvest = {
            "type": "harvest",
            "targetId": sourceId,
            "spawnId": Game.getObjectById(sourceId).pos.findClosestByPath(FIND_MY_SPAWNS).id
        };
        Memory.tasks[roomName].push(harvest);
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

    getNextTask: function(roomName) {
        return Memory.tasks[roomName].shift();
    },

};

module.exports = task;

