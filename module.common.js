var modCommon = {

  //Gets energy from availible locations, including sources
  //if it can self harvest but at a lower priority
  getEn: function(creep){
    //Priority 1 is dropped energy, since it detiorates
    var dropped = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
    if(dropped){
      if(creep.pickup(dropped)== ERR_NOT_IN_RANGE){
        modCommon.move(creep,dropped.pos);
      }else{
        creep.memory.path = null;
      }
    }else{
      //Next priority is the closest container or storage
      var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (object)=>((object.structureType === STRUCTURE_CONTAINER) || (object.structureType === STRUCTURE_STORAGE)) && (object.store[RESOURCE_ENERGY] > creep.carryCapacity)
      });
      if(storage!==null){
        var getEnergy = creep.withdraw(storage, RESOURCE_ENERGY, creep.carryCapacity-creep.carry);
        if(getEnergy===ERR_NOT_IN_RANGE) {
            modCommon.move(creep, storage);
        }else{
          creep.memory.path = null;
        }
      //Finally, the creep will harvest if it can
      }else if(creep.memory.selfHarvest){
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          modCommon.move(creep, sources[0]);
        }else{
          creep.memory.path = null;
        }
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
  },

  //Method to find the next structure to repair, shared by repair creeps and towers
  findToFixArr: function(room){
    var fixeArr = room.find(FIND_STRUCTURES, {filter: function(object){
      var brokenRoad = object.structureType ===STRUCTURE_ROAD && (object.hits < object.hitsMax/2);
      var brokenWall = object.structureType ===STRUCTURE_WALL && (object.hits < 5000) && (object.hitsMax-object.hits>0);
      var brokenRamp = object.structureType ===STRUCTURE_RAMPART && (object.hits < 5000);
      var brokenCont = object.structureType ===STRUCTURE_CONTAINER && (object.hits < 100000);
      return brokenRoad || brokenWall || brokenRamp || brokenCont;
    }});

    return fixeArr;
  },

  //Function to run away and hide
  retreat: function(creep){
    this.move(creep, creep.room.controller.pos);
    creep.say("HELP ME!");
  },

  //Function to move useing a stored path
  move:function(creep,pos){
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

    if(emptyPath || (lastObj && (pos.x !== destX || pos.y !== destY))){
      creep.memory.path = creep.pos.findPathTo(pos);
    }
    creep.moveByPath(creep.memory.path);
  },

  playerAttack:function(allCreepList){
    //priority Targets
    var pTargets = _.filter(allCreepList, (creep) => (creep.owner && !( creep.owner.username ==="PCarton" || creep.owner.username === 'Invader')));
    return pTargets !== null;
  }
  //TODO Emergency upgrade logic
};

module.exports = modCommon;
