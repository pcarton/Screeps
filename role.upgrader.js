var modCommon = require('module.common');

var roleUpgrader = {

    upgrade:function(creep){
      var controller = creep.room.controller;
      if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
        modCommon.move(creep,controller.pos);
      }
    },

    /** @param {Creep} creep **/
    run: function(creep) {

      var conserve = Memory.conservation && creep.room.controller.safeMode && creep.room.controller.level>3;

      if(creep.memory.working && creep.carry.energy === 0) {
          creep.memory.working = false;
          creep.memory.path = null;
      }
      if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
          creep.memory.working = true;
          creep.memory.path = null;
      }

      if(creep.memory.working && !(conserve && creep.room.controller.ticksToDowngrade>4200)) {
        this.upgrade(creep);
      }else if(!creep.memory.working){
        modCommon.getEn(creep);
      }
  }
};

module.exports = roleUpgrader;
