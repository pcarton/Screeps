var spawnModule = require('module.spawning');
var memoryModule = require('module.memory');

//main loop
module.exports.loop = function () {

    if(!Memory.initialized){
        memoryModule.init();
    }

    for (const roomName in Game.rooms){
        spawnModule.spawn(roomName);
        
        const allCreeps = Game.creeps;
        const thisRoomCreeps = _.filter(allCreeps, (creep) => (creep.room.name === roomName));

        if(thisRoomCreeps < 5){
            spawnModule.enqueueGeneric();
        }

        for(var name in Game.creeps) {
            creep = Game.creeps[name];
            //TODO
        }
    }

};
