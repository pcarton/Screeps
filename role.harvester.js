var roleBuilder = require('role.builder');
var modCommon = require('module.common');
var cacheSize = 1000;

var roleHarvester = {

  assignSource:function(creep){
    var flags = _.filter(creep.room.find(FIND_FLAGS), (flag) => flag.name.substring(0,1)==="S");
    var maxHarvesters = 0;
    for(var fName in flags){
      var f = flags[fName];
      var gID = creep.room.lookForAt(LOOK_SOURCES,f)[0].id;
      var numberToHarvest = parseInt(f.name.substring(1));
      maxHarvesters = maxHarvesters + numberToHarvest;
      for(var cName in Game.creeps){
          var c = Game.creeps[cName];
          if(c.memory.source === gID){
            numberToHarvest = numberToHarvest-1;
          }
      }
      if(numberToHarvest>0 && creep.memory.source === ""){
        creep.memory.source = gID;
      }
    }
    Memory.roles.maxHarvesters = maxHarvesters;
  },

  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.memory.working && creep.carry.energy === 0) {
        creep.memory.working = false;
    }
    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = true;
    }

      if(!creep.memory.working) {
          var dropped = creep.room.find(FIND_DROPPED_ENERGY);
          if(dropped.length){
            if(creep.pickup(dropped[0])== ERR_NOT_IN_RANGE){
              creep.moveTo(dropped[0],cacheSize);
            }
          }else{
            var sourceID = creep.memory.source;
            if(sourceID){
              var source = Game.getObjectById(sourceID);
              if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(source,cacheSize);
              }
            }else{
              this.assignSource(creep);
            }
          }
      }
      else {
          creep.memory._move = null;
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
                  creep.moveTo(p1[0],cacheSize);
              }
          }else if(p2.length>0){
            if(creep.transfer(p2[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(p2[0],cacheSize);
            }
          }else if(p3.length>0){
            if(creep.transfer(p3[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(p3[0],cacheSize);
            }
          }else{
            //If storage is full, Build to not waste time
            roleBuilder.run(creep);
          }
      }
  }
};

module.exports = roleHarvester;
