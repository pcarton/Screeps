var roleUpgrader = require('role.upgrader');
var modCommon = require('module.common');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.carry.energy === 0) {
            creep.memory.working = false;
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working) {
          var bTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
          if(bTargets.length) {
              if(creep.build(bTargets[0]) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(bTargets[0]);
              }
          }else{
            //If building is done, upgrade to not waste time
            roleUpgrader.run(creep);
            }
          }
        else {
            modCommon.getEn(creep);
        }
    }
};

module.exports = roleBuilder;