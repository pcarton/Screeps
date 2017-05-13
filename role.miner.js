var modCommon = require('module.common');
var roleMiner = {

  assignSource:function(creep){
    var roomName = creep.room.name;
    var sources = creep.room.find(FIND_SOURCES);
    for(var sIndex in sources){
      var s = sources[sIndex];
      var gID = s.id;
      var thisAssigned = false;
      for(var cName in Game.creeps){
          var c = Game.creeps[cName];
          if(c.memory.role === "miner" && c.memory.source === gID){
            thisAssigned = true;
          }
      }
      if(!thisAssigned && creep.memory.source === ""){
        creep.memory.source = gID;
      }
    }
    Memory.rooms[roomName].roles.maxMiners = sources.length;
  },

  assignDropOff:function(creep){
    var sourceID = creep.memory.source;
    var source = null;
    if(sourceID !== ""){
      source = Game.getObjectById(sourceID);

      var dropOffFlag = source.pos.findClosestByRange(FIND_FLAGS, { filter: (object)=>(object.name.substring(0,7) === "DropOff")});
      var dropOffArr = creep.room.lookForAt(LOOK_STRUCTURES, dropOffFlag);
      var dropOff = _.filter(dropOffArr, (object) => object.structureType != STRUCTURE_ROAD)[0];
      if(dropOff){
        creep.memory.dropOff = dropOff.id;
      }
    }else{
      this.assignSource(creep);
    }
  },

  run: function(creep) {

    var sPos = null;
    var sourceID = creep.memory.source;
    var source = null;

    var dPos = null;
    var dropOffID = creep.memory.dropOff;
    var dropOff = null;

    if(sourceID === ""){
      this.assignSource(creep);
    }else{
      if(sourceID){
        source = Game.getObjectById(sourceID);
        sPos = source.pos;
      }
    }
    if(dropOffID === ""){
      this.assignDropOff(creep);
    }else{
      if(dropOffID){
        dropOff = Game.getObjectById(dropOffID);
        if(dropOff){
          dPos = dropOff.pos;
        }else{
          this.assignDropOff(creep);
          return;
        }
      }
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
