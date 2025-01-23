// Module for determining what creeps to spawn
// Defaults to spawning 2 default creep bodies per source
// Default creep body changes based on total energy
// Spawns - 300 energy each
// Extensions 50 capacity until controller level 7, then 100 at 7 and 200 at 8

var recruiter = {

    getDefaultBody: function(maxEnergy) {
        return [WORK, CARRY, MOVE];
    },

    getBody: function(maxEnergy) {
        return this.getDefaultBody(maxEnergy);
    },

    shouldSpawn: function(totalCreeps) {
        if (totalCreeps <= 2) {
            return true;
        }
    },

    spawnNext: function(spawner, totalCreeps) {
        if(this.shouldSpawn(totalCreeps)) {
            const maxEnergy = 300;
            const body = this.getBody(maxEnergy);
            const name = Math.random().toString(20).substring(2, 10);
            spawner.spawnCreep( body, name );
        }
    }

};

module.exports = recruiter;