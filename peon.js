// Basic creep profile. Runs its task to completion or grabs a new one from the queue
// When no task exists, defaults to harvester behavior of mining the nearest accessible source and carrying energy back to the nearest spawn/extension.
// Default behavior checks for new task every drop off

// Has the following memory needs

var task = require('task');

var peon = {
    default: function(creep) {
        creep.say("🫤");
    },

    harvest: function(creep){
        var creeptask = task.getCreepTask(creep);
        if (creeptask.type !== "harvest") {
            creep.say("❓");
            return null;
        }
        var source = Game.getObjectById(creeptask.targetId);
        var spawn = Game.getObjectById(creeptask.spawnId);
        if (source == null) {
            creep.say("❓");
            return null;
        }
        if(creep.store.getFreeCapacity() > 0) {
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
        }
    },

    upgrade: function(creep) {},

    run: function(creep){
        if(!task.getCreepTask(creep)) {
            return this.default(creep);
        }
        switch(task.getCreepTask(creep).type) {
            case "harvest":
                this.harvest(creep);
                break;
            default:
              this.default(creep);
        }
    }

};

module.exports = peon;