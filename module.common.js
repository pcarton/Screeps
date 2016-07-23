var modCommon = {
  getEn: function(creep){

    var storage = creep.room.find(FIND_STRUCTURES, {
      filter: (object)=>(object.structureType === STRUCTURE_CONTAINER) && (object.store[RESOURCE_ENERGY] > creep.carryCapacity)
    });
    if(storage.length){
      var getEnergy = creep.withdraw(storage[0], RESOURCE_ENERGY, creep.carryCapacity-creep.carry);
      if(getEnergy===ERR_NOT_IN_RANGE) {
          creep.moveTo(storage[0]);
      }
    }else if(creep.memory.selfHarvest){
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0]);
      }
    }
  }
};

module.exports = modCommon;
