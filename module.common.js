var modCommon = {
  getEn: function(creep){

    var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (object)=>(object.structureType === STRUCTURE_CONTAINER) && (object.store[RESOURCE_ENERGY] > creep.carryCapacity)
    });
    if(storage!==null){
      var getEnergy = creep.withdraw(storage, RESOURCE_ENERGY, creep.carryCapacity-creep.carry);
      if(getEnergy===ERR_NOT_IN_RANGE) {
          creep.moveTo(storage);
      }
    }else if(creep.memory.selfHarvest){
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0]);
      }
    }
  },

  clearDead: function(){
    for(var i in Memory.creeps) {
      if(!Game.creeps[i]) {
          delete Memory.creeps[i];
      }
    }
  }
};

module.exports = modCommon;
