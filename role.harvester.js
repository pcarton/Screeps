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
          var targets = creep.room.find(FIND_STRUCTURES, {
                  filter: (structure) => {
                      return ((structure.structureType == STRUCTURE_EXTENSION ||
                              structure.structureType == STRUCTURE_SPAWN ||
                              structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity) || (structure.structureType == STRUCTURE_CONTAINER && (structure.store[RESOURCE_ENERGY]<structure.storeCapacity));
                  }
          });
          if(targets.length > 0) {
              if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(targets[0]);
              }
          }else{
            //If storage is full, Build to not waste time
            roleBuilder.run(creep);
          }
      }
  }
};

module.exports = roleHarvester;
