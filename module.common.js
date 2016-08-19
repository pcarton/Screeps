var modCommon = {
  //Gets energy from availible locations, including sources
  //if it can self harvest but at a lower priority
  getEn: function(creep){

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

    var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (object)=>(object.structureType === STRUCTURE_CONTAINER) && (object.store[RESOURCE_ENERGY] > creep.carryCapacity)
    });
    if(storage!==null){
      var getEnergy = creep.withdraw(storage, RESOURCE_ENERGY, creep.carryCapacity-creep.carry);
      if(getEnergy===ERR_NOT_IN_RANGE) {
        if(emptyPath || (lastObj && (storage.pos.x !== destX || storage.pos.y !== destY))){
          creep.memory.path = creep.pos.findPathTo(storage);
        }
        creep.moveByPath(creep.memory.path);
      }else{
        creep.memory.path = null;
      }
    }else if(creep.memory.selfHarvest){
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        if(emptyPath || (lastObj && (sources[0].pos.x !== destX || sources[0].pos.y !== destY))){
          creep.memory.path = creep.pos.findPathTo(sources[0]);
        }
        creep.moveByPath(creep.memory.path);
      }else{
        creep.memory.path = null;
      }
    }
  },

  //Function to remove 'dead' creeps from the memory to conserve space
  clearDead: function(){
    for(var i in Memory.creeps) {
      if(!Game.creeps[i]) {
          delete Memory.creeps[i];
      }
    }
  }

  //TODO Emergency upgrade logic
};

module.exports = modCommon;
