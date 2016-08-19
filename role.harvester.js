var roleBuilder = require('role.builder');
var modCommon = require('module.common');

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
        creep.memory.path = null;
        creep.memory.currentlyHarvester = true;
    }
    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = true;
        creep.memory.path = null;
        creep.memory.currentlyHarvester = true;
    }

    var cH = creep.memory.currentlyHarvester;
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

      if(!creep.memory.working) {
          var dropped = creep.room.find(FIND_DROPPED_ENERGY);
          if(dropped.length){
            if(creep.pickup(dropped[0])== ERR_NOT_IN_RANGE){
              if(emptyPath || (lastObj && (dropped[0].pos.x !== destX || dropped[0].pos.y !== destY))){
                creep.memory.path = creep.pos.findPathTo(dropped[0]);
              }
              creep.moveByPath(creep.memory.path);
            }else{
              creep.memory.path = null;
            }
          }else{
            var sourceID = creep.memory.source;
            if(sourceID){
              var source = Game.getObjectById(sourceID);
              if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                if(emptyPath || (lastObj && (source.pos.x !== destX || source.pos.y !== destY))){
                  creep.memory.path = creep.pos.findPathTo(source);
                }
                creep.moveByPath(creep.memory.path);
              }
            }else{
              this.assignSource(creep);
            }
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
                    return (structure.structureType == STRUCTURE_TOWER || structure.structureType === STRUCTURE_STORAGE) && structure.energy < structure.energyCapacity;
                  }
                });
          var p3 = creep.room.find(FIND_STRUCTURES,{
            filter: (structure) => {
              return (structure.structureType == STRUCTURE_CONTAINER && (structure.store[RESOURCE_ENERGY]<structure.storeCapacity));
            }
          });
          if(cH && p1.length > 0) {
              if(creep.transfer(p1[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if(emptyPath || (lastObj && (p1[0].pos.x !== destX || p1[0].pos.y !== destY))){
                  creep.memory.path = creep.pos.findPathTo(p1[0]);
                }
                creep.moveByPath(creep.memory.path);
              }else{
                creep.memory.path = null;
              }
          }else if(cH && p2.length>0){
            if(creep.transfer(p2[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if(emptyPath || (lastObj && (p2[0].pos.x !== destX || p2[0].pos.y !== destY))){
                  creep.memory.path = creep.pos.findPathTo(p2[0]);
                }
                creep.moveByPath(creep.memory.path);
            }else{
              creep.memory.path = null;
            }
          }else if(cH && p3.length>0){
            if(creep.transfer(p3[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              if(emptyPath || (lastObj && (p3[0].pos.x !== destX || p3[0].pos.y !== destY))){
                creep.memory.path = creep.pos.findPathTo(p3[0]);
              }
              creep.moveByPath(creep.memory.path);
            }else{
              creep.memory.path = null;
            }
          }else{
            //If storage is full, Build to not waste time
            if(creep.memory.currentlyHarvester){
              creep.memory.currentlyHarvester = false;
              creep.memory.path = null;
            }
            roleBuilder.run(creep);
          }
      }
  }
};

module.exports = roleHarvester;
