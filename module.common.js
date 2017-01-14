var modCommon = {

  getFatigue: function(creep){
    var body = creep.body;
    var nonMoveCount = 0;
    var moveCount = 0;
    var total = 0;
    for(var limb in body){
      if(limb.type === MOVE){
        moveCount++;
        total++;
      }else{
        nonMoveCount++;
        total++;
      }
    }
    return 2*(nonMoveCount * 0.5 - moveCount);

  },

  distTo: function(creep, pos){
    var x = creep.pos.x - pos.x;
    var y = creep.pos.y - pos.y;
    var xSquared = x * x;
    var ySquared = y * y;
    var root = xSquared + ySquared;
    var dist = Math.sqrt(root);
    return dist;
  },

  //Gets energy from availible locations, including sources
  //if it can self harvest but at a lower priority
  getEn: function(creep){
    var maxTicks = 50;
    //Priority 1 is dropped energy, since it detiorates
    var dropped = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
    if(dropped){
      var dist = this.distTo(creep, dropped.pos);
      var fat = this.getFatigue(creep);
      var worth = (dist * fat) / maxTicks;
      if(worth<=1){
        if(creep.pickup(dropped)== ERR_NOT_IN_RANGE){
          modCommon.move(creep,dropped.pos);
        }else{
          creep.memory.path = null;
        }
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
          var job = Memory.creeps[i].role;
          this.decrementNum(job);
          delete Memory.creeps[i];
      }
    }
  },

  decrementNum:function(creepType){
    if(creepType==="harvester"){
      --Memory.roles.numHarvesters;
    }else if(creepType === "upgrader"){
      --Memory.roles.numUpgraders;
    }else if(creepType === "builder"){
      --Memory.roles.numBuilders;
    }else if(creepType === "repair"){
      --Memory.roles.numRepair;
    }else if (creepType === "architect"){
      --Memory.roles.numArchitects;
    }else if(creepType === "miner"){
      --Memory.roles.numMiners;
    }else if(creepType === "hauler"){
      --Memory.roles.numHaulers;
    }else if(creepType === "feeder"){
      --Memory.roles.numFeeders;
    }
    --Memory.roles.numCreeps;
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

  findToFortify: function(room){
    // use  '|| object.structureType ===STRUCTURE_RAMPART' ?
    var fortArr = room.find(FIND_STRUCTURES, {filter: function(object){
      return (object.structureType ===STRUCTURE_WALL) && (object.hits < 100000) && (object.hitsMax-object.hits>0);
    }});

    return fortArr;
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
    var pTargets = _.filter(allCreepList, (creep) => (creep.owner && !( creep.owner.username == "PCarton" || creep.owner.username == 'Invader')));
    return pTargets.length;
  },

  findInjured:function(allCreepList){
    var hTargets = _.filter(allCreepList, (creep) => creep.hits<creep.hitsMax && creep.owner.username === "PCarton");
    //TODO sort by a priority
    return hTargets;
  }
  //TODO Emergency upgrade logic

  //TODO link to history page for the room at given tick
  //Formated as https://screeps.com/a/#!/history/E33N43?t=15527000
  //linkRoomAtTick:function(room,tick){}

};

module.exports = modCommon;
