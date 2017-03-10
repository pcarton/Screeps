var roleBuilder = require('role.builder');
var modCommon = require('module.common');

var roleHarvester = {

  assignSource:function(creep){
    var flags = _.filter(creep.room.find(FIND_FLAGS), (flag) => flag.name.substring(0,1)==="S" && flag.name !== "Storage");
    var roomName = creep.room.name;
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
    Memory.rooms[roomName].roles.maxHarvesters = maxHarvesters;
  },

  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.memory.working && creep.carry.energy === 0) {
        creep.memory.working = false;
        creep.memory.path = null;
        creep.memory.currentlyHarvester = true;
    }
    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = true;
        creep.memory.path = null;
        creep.memory.currentlyHarvester = true;
    }

    if(!creep.memory.working){
          var dropped = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
          if(dropped){
            if(creep.pickup(dropped)== ERR_NOT_IN_RANGE){
              modCommon.move(creep,dropped.pos);
            }else{
              creep.memory.path = null;
            }
          }else{
            var sourceID = creep.memory.source;
            if(sourceID){
              var source = Game.getObjectById(sourceID);
              if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                modCommon.move(creep,source.pos);
              }
            }else{
                this.assignSource(creep);
            }
          }
    }else{
          var p1 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                  filter: (structure) => {
                      return ((structure.structureType == STRUCTURE_EXTENSION ||
                              structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity);
                  }
          });
          var p2 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                  filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity) || (structure.structureType === STRUCTURE_STORAGE && (structure.store[RESOURCE_ENERGY]<structure.storeCapacity));
                  }
                });
          var p3 = creep.pos.findClosestByPath(FIND_STRUCTURES,{
            filter: (structure) => {
              return (structure.structureType == STRUCTURE_CONTAINER && (structure.store[RESOURCE_ENERGY]<structure.storeCapacity));
            }
          });
          if(p1) {
              if(creep.transfer(p1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                modCommon.move(creep,p1.pos);
              }else{
                creep.memory.path = null;
              }
          }else if(p2){
            if(creep.transfer(p2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              modCommon.move(creep,p2.pos);
            }else{
              creep.memory.path = null;
            }
          }else if(p3){
            if(creep.transfer(p3, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              modCommon.move(creep,p3.pos);
            }else{
              creep.memory.path = null;
            }
          }else{
            roleBuilder.run(creep);
          }
      }
  }
};

module.exports = roleHarvester;
