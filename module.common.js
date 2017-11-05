var modConstants = require('module.constants');

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

  getCreepsByJob: function(job, roomName){
    var result = [];
    for(var cName in Game.creeps){
        var c = Game.creeps[cName];
        if(c.memory.role === job && c.memory.room === roomName){
          result.push(c);
        }
    }
    return result;
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
    //TODO find why creeps will pick up compounds
    var dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    if(dropped && dropped.resourceType === RESOURCE_ENERGY){
      var dist;
      var fat;
      var worth = 2;
      dist = this.distTo(creep, dropped.pos);
      fat = this.getFatigue(creep);
      worth = (dist * fat) / maxTicks;
      if(dropped && worth<=1){
        if(creep.pickup(dropped)== ERR_NOT_IN_RANGE){
          modCommon.move(creep,dropped.pos);
        }else{
          creep.memory.path = null;
        }
        return;
      }
    }
    //Next priority is the closest container or storage
    var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (object)=>(((object.structureType === STRUCTURE_CONTAINER) || (object.structureType === STRUCTURE_STORAGE)) && (object.store[RESOURCE_ENERGY] >= creep.carryCapacity)) || (object.structureType === STRUCTURE_LINK && object.energy > creep.carryCapacity)
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
      var source = creep.pos.findClosestByPath(FIND_SOURCES);
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        modCommon.move(creep, source);
      }else{
        creep.memory.path = null;
      }
    }
  },

  stillToFix:function(object){
    var modifier = Math.max(Math.pow(10,controlLvl-3),10);

    if(room.storage.store.energy < modConstants.roomEnergyBuffer){
      var brokenRoad = object.structureType ===STRUCTURE_ROAD && (object.hits < 3000);
      var brokenRamp = object.structureType ===STRUCTURE_RAMPART && (object.hits < 5000)&& (object.hitsMax-object.hits>0);
      var brokenCont = object.structureType ===STRUCTURE_CONTAINER && (object.hits < 100000);
      var brokenWall = object.structureType ===STRUCTURE_WALL && (object.hits < 5000) && (object.hitsMax-object.hits>0);

      return brokenRoad || brokenRamp || brokenCont || brokenWall;
    }else{
      var brokenRamp2 = object.structureType ===STRUCTURE_RAMPART && (object.hits < (500*modifier+modConstants.structBuffer))&& (object.hitsMax-object.hits>0);

      var brokenWall2 = object.structureType ===STRUCTURE_WALL && (object.hits < (500*modifier+modConstants.structBuffer)) && (object.hitsMax-object.hits>0);
      if(brokenRamp2){
        return brokenRamp2;
      }else {
        return brokenWall2;
      }
    }
    return false;
  },

  //Method to find the next structure to repair, shared by repair creeps and towers
  findToFixArr: function(room){
    var controlLvl = room.controller.level;
    var modifier = Math.max(Math.pow(10,controlLvl-3),10);

    var fixeArrPriority = room.find(FIND_STRUCTURES, {filter: function(object){
      var brokenRoad = object.structureType == STRUCTURE_ROAD && (object.hits < 3000);
      var brokenRamp = object.structureType == STRUCTURE_RAMPART && (object.hits < 5000)&& (object.hitsMax-object.hits>0);
      var brokenCont = object.structureType == STRUCTURE_CONTAINER && (object.hits < 100000);
      var brokenWall = object.structureType == STRUCTURE_WALL && (object.hits < 5000) && (object.hitsMax-object.hits>0);
      return brokenRoad || brokenRamp || brokenCont || brokenWall;
    }});

    var fixeArr = room.find(FIND_STRUCTURES, {filter: function(object){
      var brokenRamp = object.structureType ===STRUCTURE_RAMPART && (object.hits < (500*modifier+modConstants.structBuffer))&& (object.hitsMax-object.hits>0);
      return brokenRamp;
    }});

    var fixeArr2 = room.find(FIND_STRUCTURES, {filter: function(object){
      var brokenWall = object.structureType ===STRUCTURE_WALL && (object.hits < (500*modifier+modConstants.structBuffer)) && (object.hitsMax-object.hits>0);
      return brokenWall;
    }});

    if((room.storage && room.storage.store.energy < modConstants.roomEnergyBuffer) || fixeArrPriority.length>0){
      return fixeArrPriority;
    }else if(fixeArr.length>0){
      return fixeArr;
    }else {
      return fixeArr2;
    }
    return NULL;
  },

  findToFortify: function(room){
    // use  '|| object.structureType ===STRUCTURE_RAMPART' ?
    var fortArr = room.find(FIND_STRUCTURES, {filter: function(object){
      return (object.structureType === STRUCTURE_WALL || object.structureType === STRUCTURE_RAMPART) && (object.hits < 100000);
    }});

    return fortArr;
  },

  //Function to run away and hide
  retreat: function(creep){
    this.move(creep, creep.room.controller.pos);
    creep.say("Help Me!");
  },

  //Function to move useing a stored path
  move:function(creep,pos){
    if(creep.pos.roomName === pos.roomName){
      if(creep.pos.x === 0){
        return creep.move(RIGHT);
      }else if(creep.pos.x === 49){
        return creep.move(LEFT);
      }else if(creep.pos.y === 49){
        return creep.move(TOP);
      }else if(creep.pos.y === 0){
        return creep.move(BOTTOM);
      }
    }
    var opts = {};
    //opts.ignore = Game.rooms[pos.roomName].find(FIND_MY_CONSTRUCTION_SITES);
    var posStr = null;
    if(pos.roomName === undefined || pos.x === undefined || pos.y === undefined){
      posStr = null;
    }else{
      posStr = pos.roomName+":"+pos.x+","+pos.y;
    }
    var creepPath = creep.memory.path;
    var reCalc = creep.memory.reCalc;
    if(!creepPath || creep.memory.dest != posStr || posStr === null || reCalc){
        if(!reCalc){
          opts.ignoreCreeps = true;
        }else {
          opts.ignoreCreeps = false;
        }
        opts.serialize = true;
        if(pos.roomName == creep.room.name){
          opts.maxOps = 1000;
        }else{
          opts.maxOps = 9000;
        }
        creep.memory.path = creep.pos.findPathTo(pos, opts);
        creep.memory.dest = posStr;
        creep.memory.reCalc = false;
    }
    creep.memory.lastPos = creep.pos;
    var result = creep.moveByPath(creep.memory.path);
    if(result != OK && result != ERR_TIRED){
      creep.memory.path = null;
      //console.log("Move error: "+result);
    }else if(result === OK){
      if((creep.memory.lastPos === creep.pos) && (creep.fatigue === 0)){
        creep.memory.reCalc = true;
      }
      creep.memory.lastPos = creep.pos;
    }

    return result;
  },

  playerAttack:function(allCreepList){
    //priority Targets
    var pTargets = _.filter(allCreepList, (creep) => !creep.my);
    var attackers = [];
    for(var creepName in pTargets){
      var owner = pTargets[creepName].owner.username;
      if(owner != "Invader"){
        var bodies = pTargets[creepName].body;
        var justAttack = _.filter(bodies, (part)=>(part.type==ATTACK || part.type==RANGED_ATTACK));
        if(justAttack.length > 0 && !attackers.includes(owner))
          attackers.push(owner);
      }
    }
    if(attackers.length > 0){
      return attackers[0]; //TODO turn this into a string of all attackers;
    }else{
      return null;
    }
  },

  findInjured:function(allCreepList){
    var hTargets = _.filter(allCreepList, (creep) => creep.hits<creep.hitsMax && creep.owner.username === "PCarton");
    //TODO sort by a priority
    return hTargets;
  },

  whatCarry:function(creep){
    var creepCarry = creep.carry;
    for(var type in creepCarry){
      if(creepCarry[type]>0 && type !== RESOURCE_ENERGY){
        return type;
      }
    }
    return RESOURCE_ENERGY;
  },

  whatStore:function(struct){
    if(!struct){
      return null;
    }
    var structStore = struct.store;
    for(var type in structStore){
      if(structStore[type]>0 && type !== RESOURCE_ENERGY){
        return type;
      }
    }
    return RESOURCE_ENERGY;
  },

  getResourceCount:function(storeObj, resourceType){
    var count;
    if(storeObj){
      count = storeObj[resourceType];
    }
    return count;
  },
  //TODO Emergency upgrade logic

  linkRoomAtTick:function(room,tick,msg){
    //Disables the autolinking
    //See http://support.screeps.com/hc/en-us/community/posts/206652879-Email-links-broken
    let roomName = room.name.replace(/^\w/,"&#"+room.name.charCodeAt(0)+";");

    var link = "http://screeps.com/a/#!/history/"+roomName+"?t="+tick;
    msg = "Room>"+roomName+":"+msg+"@"+tick;
    return "<a href="+link+">"+msg+"</a>";
  }

};

module.exports = modCommon;
