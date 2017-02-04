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
    var mineralID = creep.memory.source;
    var source = null;
    if(sourceID !== ""){
      source = Game.getObjectById(sourceID);

      var dropOffFlag = source.pos.findClosestByRange(FIND_FLAGS, { filter: (object)=>(object.name.substring(0,8) === "GDropOff")});
      var dropOffArr = creep.room.lookForAt(LOOK_STRUCTURES, dropOffFlag);
      var dropOff = _.filter(dropOffArr, (object) => object.structureType != STRUCTURE_ROAD)[0];
      if(dropOff){
        creep.memory.dropOff = dropOff.id;
      }
    }else{
      this.assignMineral(creep);
    }
  },

};

module.exports = roleGeoMiner;
