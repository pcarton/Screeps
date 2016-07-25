var roleBuilder = require('role.builder');
var modCommon = require('module.common');

var roleHarvester = {

  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.memory.working && creep.carry.energy === 0) {
        creep.memory.working = false;
    }
    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = true;
    }

      if(!creep.memory.working) {
          var sources = creep.room.find(FIND_SOURCES);
          if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
              creep.moveTo(sources[0]);
          }
      }
      else {
          var p1 = creep.room.find(FIND_STRUCTURES, {
                  filter: (structure) => {
                      return ((structure.structureType == STRUCTURE_EXTENSION ||
                              structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity);
                  }
          });
          var p2 = creep.room.find(FIND_STRUCTURES, {
                  filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                  }
                });
          var p3 = creep.room.find(FIND_STRUCTURES,{
            filter: (structure) => {
              return (structure.structureType == STRUCTURE_CONTAINER && (structure.store[RESOURCE_ENERGY]<structure.storeCapacity));
            }
          });

          if(p1.length > 0) {
              if(creep.transfer(p1[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(p1[0]);
              }
          }else if(p2.length>0){
            if(creep.transfer(p2[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(p2[0]);
            }
          }else if(p3.length>0){
            if(creep.transfer(p3[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(p3[0]);
            }
          }else{
            //If storage is full, Build to not waste time
            roleBuilder.run(creep);
          }
      }
  }
};

module.exports = roleHarvester;
