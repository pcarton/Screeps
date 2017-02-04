var modCommon = require('module.common');

var roleGeoMiner = {

  assignMineral:function(creep){
    var minerals = creep.room.find(FIND_STRUCTURES,{
      filter: (structure) => {
        return structure.structureType === STRUCTURE_EXTRACTOR;
      }
    });
    for(var mIndex in minerals){
      var m = minerals[mIndex];
      var gID = m.id;
      var thisAssigned = false;
      for(var cName in Game.creeps){
          var c = Game.creeps[cName];
          if(c.memory.role === "geo" && c.memory.mineral === gID){
            thisAssigned = true;
          }
      }
      if(!thisAssigned && creep.memory.mineral === ""){
        creep.memory.mineral = gID;
      }
    }
    Memory.roles.maxGeo = minerals.length;
  },

  assignDropOff:function(creep){
    var mineralID = creep.memory.mineral;
    var mineral = null;
    if(mineralID !== ""){
      mineral = Game.getObjectById(mineralID);

      var dropOffFlag = mineral.pos.findClosestByRange(FIND_FLAGS, { filter: (object)=>(object.name.substring(0,8) === "GDropOff")});
      var dropOffArr = creep.room.lookForAt(LOOK_STRUCTURES, dropOffFlag);
      var dropOff = _.filter(dropOffArr, (object) => object.structureType != STRUCTURE_ROAD)[0];
      if(dropOff){
        creep.memory.dropOff = dropOff.id;
      }
    }else{
      this.assignMineral(creep);
    }
  },

  run:function(creep){
    var sPos = null;
    var mineralID = creep.memory.mineral;
    var mineral = null;

    var dPos = null;
    var dropOffID = creep.memory.dropOff;
    var dropOff = null;

    if(mineralID === ""){
      this.assignMineral(creep);
    }else{
      if(mineralID){
        mineral = Game.getObjectById(mineralID);
        sPos = mineral.pos;
      }
    }
    if(dropOffID === ""){
      this.assignDropOff(creep);
    }else{
      if(dropOffID){
        dropOff = Game.getObjectById(dropOffID);
        dPos = dropOff.pos;
      }
    }

    if(_.sum(creep.carry) == creep.carryCapacity){
      if(creep.transfer(dropOff, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        modCommon.move(creep,dPos);
      }else{
        creep.memory.path = null;
      }
    }else{
      if(creep.harvest(mineral) === (ERR_NOT_IN_RANGE)) {
        modCommon.move(creep,sPos);
      }
    }
  }

};

module.exports = roleGeoMiner;
