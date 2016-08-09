var modCommon = require('module.common');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.carry.energy === 0) {
            creep.memory.working = false;
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
              if(!creep.memory.path){
                creep.memory.path = creep.pos.findPathTo(creep.room.controller);
              }
              creep.moveByPath(creep.memory.path);
            }
        }
        else{
          modCommon.getEn(creep);
        }
    }
};

module.exports = roleUpgrader;
