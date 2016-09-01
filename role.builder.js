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

        if(creep.memory.working) {
          var bTargets1 = creep.room.find(FIND_CONSTRUCTION_SITES, {filter:     function(object){
            var isTower =  object.structureType === STRUCTURE_TOWER;
            var isWall = object.structureType === STRUCTURE_WALL;
            return isTower || isWall;
          }
          });
            var bTargets2 = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: function(object){
              var isTower =  object.structureType === STRUCTURE_TOWER;
              var isWall = object.structureType === STRUCTURE_WALL;
              return !isTower && !isWall;
            }
            });
          if(bTargets1.length) {
              if(creep.build(bTargets1[0]) == ERR_NOT_IN_RANGE) {
                modCommon.move(creep,bTargets1[0].pos);
              }
          }else if(bTargets2.length){
            if(creep.build(bTargets2[0]) == ERR_NOT_IN_RANGE) {
              modCommon.move(creep,bTargets2[0].pos);
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
