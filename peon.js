// Basic creep profile. Runs its task to completion or grabs a new one from the queue
// When no task exists, defaults to harvester behavior of mining the nearest accessible source and carrying energy back to the nearest spawn/extension.
// Default behavior checks for new task every drop off

// Has the following memory needs

var peon = {

    default: function(creep){
        if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
    },

    getTask: function(creep){
        // Actually get the task if one exists, or return null if it doesn't
        return null;
    },

    run: function(creep){
        if(this.getTask(creep) == null){
            this.default(creep);
        }
    }

};

module.exports = peon;