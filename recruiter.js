// Module for determining what creeps to spawn
// Defaults to spawning 2 default creep bodies per source
// Default creep body changes based on total energy
// Spawns - 300 energy each
// Extensions 50 capacity until controller level 7, then 100 at 7 and 200 at 8
var task = require('task');

var recruiter = {

    getDefaultBody: function(maxEnergy) {
        return [WORK, CARRY, MOVE];
    },

    getBody: function(maxEnergy,totalCreeps) {
        if (totalCreeps == 0 || maxEnergy < 550) {
            return this.getDefaultBody(maxEnergy);
        }
        else if (maxEnergy >= 550){
            return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        return this.getDefaultBody(maxEnergy);
    },

    shouldSpawn: function(room, totalCreeps) {
      return (totalCreeps == 0 || !task.noTasks(room.name) && totalCreeps <= 30)
    },

    spawnNext: function(spawner, totalCreeps) {
        if(this.shouldSpawn(spawner.room, totalCreeps)) {
            const maxEnergy = spawner.room.energyCapacityAvailable;
            const body = this.getBody(maxEnergy, totalCreeps);
            const name = Math.random().toString(20).substring(2, 10);
            spawner.spawnCreep( body, name );
        }
    }

};

module.exports = recruiter;