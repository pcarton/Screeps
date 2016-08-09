var roleUpgrader = require('role.upgrader');
var modCommon = require('module.common');

var roleBuilder = {

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

        if(creep.memory.working) {
          var bTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
          if(bTargets.length) {
              if(creep.build(bTargets[0]) == ERR_NOT_IN_RANGE) {
                if(!creep.memory.path){
                  creep.memory.path = creep.pos.findPathTo(bTargets[0]);
                }
                creep.moveByPath(creep.memory.path);
              }
          }else{
            //If building is done, upgrade to not waste time
            roleUpgrader.run(creep);
            creep.memory.path = null;
            }
          }
        else {
            modCommon.getEn(creep);
        }
    }
};

module.exports = roleBuilder;
