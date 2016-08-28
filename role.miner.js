var modCommon = require('module.common');

var roleMiner = {

  assignSource:function(creep){
    var sources = creep.room.find(FIND_SOURCES);
    for(var sIndex in sources){
      var s = sources[sIndex];
      var gID = s.id;
      var thisAssigned =false;
      for(var cName in Game.creeps){
          var c = Game.creeps[cName];
          if(c.memory.source === gID){
            thisAssigned = true;
          }
      }
      if(!thisAssigned && creep.memory.source === ""){
        creep.memory.source = gID;
      }
      Memory.roles.maxMiners = sources.length;
    }
  },

  assignDropOff:function(creep){
    if(creep.memory.source === ""){
      assignSource(creep);
    }
    var sourceID = creep.memory.source;
    var source = null;
    if(sourceID){
      source = Game.getObjectById(sourceID);
    }
    var dropOff = source.pos.findClosestByPath(FIND_STRUCTURES, (structure) => struture.structureType === "STRUCTURE_CONTAINER" || struture.structureType === "STRUCTURE_STORAGE" || struture.structureType === "STRUCTURE_LINK");

    creep.memory.dropOff = dropOff.id;
  },

  run: function(creep) {

    if(creep.memory.source === ""){
      assignSource(creep);
    }
    if(creep.memory.dropOff === ""){
      assignDropOff(creep);
    }

    var sPos = null;
    var sourceID = creep.memory.source;
    var source = null;
    if(sourceID){
      source = Game.getObjectById(sourceID);
      sPos = source.pos;
    }

    var dPos = null;
    var dropOffID = creep.memory.dropOff;
    var dropOff = null;
    if(dropOffID){
      dropOff = Game.getObjectById(dropOffID);
      dPos = dropOff.pos;
    }

    if(creep.carry.energy == creep.carryCapacity){
      if(creep.transfer(dropOff, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        modCommon.move(creep,dPos);
      }else{
        creep.memory.path = null;
      }
    }else{
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        modCommon.move(creep,sPos);
      }
    }
  }
};

module.exports = roleMiner;
