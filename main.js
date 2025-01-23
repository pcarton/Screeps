var peon = require('peon');
var recruiter = require('recruiter');

module.exports.loop = function () {
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        peon.run(creep);
    }

    for(var spawner in Game.spawns) {
        var spawn = Game.spawns[spawner];
        var totalCreeps = Game.creeps.length;
        recruiter.spawnNext(spawn,totalCreeps);
    }
}