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
          var bTargets0 = creep.room.find(FIND_CONSTRUCTION_SITES, {filter:     function(object){
            var isExtension =  object.structureType === STRUCTURE_EXTENSION;
            return isExtension;
          }
          });
          var bTargets1 = creep.room.find(FIND_CONSTRUCTION_SITES, {filter:     function(object){
            var isTower =  object.structureType === STRUCTURE_TOWER;
            var isWall = object.structureType === STRUCTURE_WALL;
            var isContainer = object.structureType === STRUCTURE_CONTAINER;
            return isTower || isWall || isContainer;
          }
          });
            var bTargets2 = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: function(object){
              var isTower =  object.structureType === STRUCTURE_TOWER;
              var isWall = object.structureType === STRUCTURE_WALL;
              return !isTower && !isWall;
            }
            });
          if(bTargets0.length) {
              if(creep.build(bTargets0[0]) == ERR_NOT_IN_RANGE) {
                modCommon.move(creep,bTargets0[0].pos);
              }
          }else if(bTargets1.length) {
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
