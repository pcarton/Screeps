var peon = require('peon');
var recruiter = require('recruiter');
var init = require('init');

module.exports.loop = function () {
    var creepCount = 0;
    for(var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        init.init(roomName);
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        peon.run(creep);
        creepCount++;
    }

    for(var spawner in Game.spawns) {
        var spawn = Game.spawns[spawner];
        var totalCreeps = creepCount;
        recruiter.spawnNext(spawn,totalCreeps);
    }
}