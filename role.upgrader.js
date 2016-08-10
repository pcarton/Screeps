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

        var emptyPath = false;
        var creepPath = creep.memory.path;
        var destX = -1;
        var destY = -1;
        var lastObj = null;
        if(creepPath && creepPath.length>0){
         var index = creepPath.length-1;
         lastObj = creepPath[index];
          destX = lastObj.x + lastObj.dx;
          destY = lastObj.y + lastObj.dy;
        }else{
          emptyPath = true;
        }

        if(creep.memory.working) {
          var controller = creep.room.controller;
            if(creep.upgradeController() == ERR_NOT_IN_RANGE) {
              if(emptyPath || (controller.pos.x !== destX || controller.pos.y !== destY)){
                creep.memory.path = creep.pos.findPathTo(controller);
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
