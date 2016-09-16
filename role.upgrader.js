var modCommon = require('module.common');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.carry.energy === 0) {
            creep.memory.working = false;
            creep.memory.path = null;
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.path = null;
        }

        if(creep.memory.working && !(Memory.conservation && creep.room.controller.ticksToDowngrade>4200)) {
          var controller = creep.room.controller;
            if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
              modCommon.move(creep,controller.pos);
            }
        }
        else if(creep.memory.working){
          role.hauler.run(creep);
        }else{
          modCommon.getEn(creep);
        }
    }
};

module.exports = roleUpgrader;
