var roleUpgrader = require('role.upgrader');
var modCommon = require('module.common');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.carry.energy === 0) {
            creep.memory.working = false;
            creep.memory.path = null;
            creep.memory.currentlyBuilder = true;
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.path = null;
            creep.memory.currentlyBuilder = true;
        }

        var emptyPath = false;
        var creepPath = creep.memory.path;
        var destX = -1;
        var destY = -1;
        var lastObj = null;
        if(creepPath){
          lastObj = creepPath[creepPath.length-1];
          destX = lastObj.x + lastObj.dx;
          destY = lastObj.y + lastObj.dy;
        }else{
          emptyPath = true;
        }

        if(creep.memory.working) {
          var bTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
          if(bTargets.length) {
              if(creep.build(bTargets[0]) == ERR_NOT_IN_RANGE) {
                if(emptyPath || (lastObj && (bTargets[0].pos.x !== destX || bTargets[0].pos.y !== destY))){
                  creep.memory.path = creep.pos.findPathTo(bTargets[0]);
                }
                creep.moveByPath(creep.memory.path);
              }
          }else{
            //If building is done, upgrade to not waste time
            if(creep.memory.currentlyBuilder){
              creep.memory.currentlyBuilder = false;
              creep.memory.path = null;
            }
            roleUpgrader.run(creep);
          }
        }else {
            modCommon.getEn(creep);
        }
    }
};

module.exports = roleBuilder;
