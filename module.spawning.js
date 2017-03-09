var roleArchitect = require('role.architect');
var bodyObj = require('module.bodyTypes');
var modCommon = require('module.common');
var modConstants = require('module.constants');
var modMemory = require('module.memory');

var modSpawning = {

  //These return booleans
  needHarvester:function(roomName){
    var roles = Memory.rooms[roomName].roles;

    var LTMin = roles.numHarvesters < roles.maxHarvesters;
    var tier = this.calcTier(roomName);

    return LTMin && tier<=3;
  },

  needUpgrader:function(roomName){
    var roles = Memory.rooms[roomName].roles;
    var notEnoughHarvest = (roles.numHarvesters <= 0) && (roles.numMiners <= 0);

    if(notEnoughHarvest){
      return false;
    }else{
      var LTMin = roles.numUpgraders < roles.maxUpgraders;
      return LTMin;
    }
  },

  needBuilder:function(roomName){
    var roles = Memory.rooms[roomName].roles;
    var notEnoughHarvest = (roles.numHarvesters <= 0) && (roles.numMiners <= 0);

    if(notEnoughHarvest){
      return false;
    }else{
      var tier = this.calcTier(roomName);
      var construct = Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES).length;
      var LTMin = roles.numBuilders < roles.maxBuilders;
      var noArch = roles.numArchitects === 0;
      return (tier > 1) && construct && LTMin && noArch;
    }
  },

  needRepair:function(roomName){
    var roles = Memory.rooms[roomName].roles;
    var notEnoughHarvest = (roles.numHarvesters <= 0) && (roles.numMiners <= 0);

    if(notEnoughHarvest){
      return false;
    }else{
      var numTowers = Memory.rooms[roomName].towers.length;
      var LTMin = roles.numRepair < (roles.maxRepair - numTowers);
      if(LTMin){
        var toRepair = modCommon.findToFixArr(Game.rooms[roomName]).length>0;
        return toRepair;
      }else{
        return false;
      }
    }
  },

  needArchitect:function(roomName){
    var roles = Memory.rooms[roomName].roles;
    var notEnoughHarvest = (roles.numHarvesters <= 0) && (roles.numMiners <= 0);

    if(notEnoughHarvest){
      return false;
    }else{
      var flags = _.filter(Game.rooms[roomName].find(FIND_FLAGS), (flag) => roleArchitect.ableToBuild(Game.rooms[roomName].controller.level, flag));

      return flags.length && roles.numArchitects < 1;
    }
  },

  needMiner:function(roomName){
    var roles = Memory.rooms[roomName].roles;
    var notEnoughHarvest = (roles.numHarvesters <= 0) && (roles.numMiners <= 0);

    if(notEnoughHarvest){
      return false;
    }else{
      var tier = this.calcTier(roomName);
      var sources = Memory.rooms[roomName].sourceIDs.length;
      var LTMin = roles.numMiners < sources;
      return (tier >= 4) && LTMin;
    }
  },
  needHauler:function(roomName){
    var roles = Memory.rooms[roomName].roles;
    var notEnoughHarvest = (roles.numHarvesters <= 0) && (roles.numMiners <= 0);

    if(notEnoughHarvest){
      return false;
    }else{
      var tier = this.calcTier(roomName);
      var LTMin = roles.numHaulers < roles.maxHaulers;
      return (tier >= 4) && LTMin;
    }
  },

  needFeeder:function(roomName){
    var roles = Memory.rooms[roomName].roles;
    var notEnoughHarvest = (roles.numHarvesters <= 0) && (roles.numMiners <= 0);

    if(notEnoughHarvest){
      return false;
    }else{
      var storage = Game.rooms[roomName].storage !== undefined;
      var LTMin = roles.numFeeders < roles.maxFeeders;
      return storage && LTMin;
    }
  },

  needGeoMiner:function(roomName){
    var roles = Memory.rooms[roomName].roles;
    var notEnoughHarvest = (roles.numHarvesters <= 0) && (roles.numMiners <= 0);

    if(notEnoughHarvest){
      return false;
    }else{
      var tier = this.calcTier(roomName);
      var LTMin = roles.numGeo < 1;

      var extractor = _.filter(Game.rooms[roomName].find(FIND_STRUCTURES), (structure) => structure.structureType === STRUCTURE_EXTRACTOR);
      var minerals = (_.filter(Game.rooms[roomName].find(FIND_MINERALS), (mineral) => mineral.mineralAmount > 0).length) > 0;

      return (tier >=4) && LTMin && extractor && minerals;
    }
  },

  needMerchant:function(roomName){
    var roles = Memory.rooms[roomName].roles;
    var notEnoughHarvest = (roles.numHarvesters <= 0) && (roles.numMiners <= 0);

    if(notEnoughHarvest){
      return false;
    }else{
      var tier = this.calcTier(roomName);
      var LTMin = roles.numMerchant < 1;

      var minerals = (_.filter(Game.rooms[roomName].find(FIND_MINERALS), (mineral) => mineral.mineralAmount > 0).length) > 0;
      var toSell = Game.rooms[roomName].storage && modCommon.whatStore(Game.rooms[roomName].storage) != RESOURCE_ENERGY;

      return !minerals && toSell && (tier >= 4) && LTMin;
    }
  },

  /* Add type to queue, full parameter list object
      Example:
      var memoryObj = {
        role:'harvester',
        selfHarvest:true,
        source:""
      };

      var harvesterObj = {
        description:"",
        body: null,
        name: undefined,
        memory:memoryObj
      };
  */
  enqueueHarvester:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObj = modMemory.getInitalCreepMem("harvester");
    memoryObj.room = roomName;

    var harvesterObj = {
      description:"Harvester",
      body: null,
      name: undefined,
      memory:memoryObj
    };
    harvesterObj.body = bodyObj.getBody('harvester',tier);
    //Using unshift() to add to front, basic priority
    //Only use this for miners/harvesters
    Memory.rooms[roomName].spawnQ.unshift(harvesterObj);
    Memory.rooms[roomName].roles.numHarvesters = Memory.rooms[roomName].roles.numHarvesters + 1;
  },

  enqueueUpgrader:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObj = modMemory.getInitalCreepMem("upgrader");
    memoryObj.room = roomName;

    var obj = {
      description:"Upgrader",
      body: null,
      name: undefined,
      memory:memoryObj
    };
    if(tier === 1){
      obj.memory.selfHarvest = true;
    }
    obj.body = bodyObj.getBody('upgrader',tier);
    Memory.rooms[roomName].spawnQ.push(obj);
    Memory.rooms[roomName].roles.numUpgraders = Memory.rooms[roomName].roles.numUpgraders + 1;
  },
  enqueueBuilder:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObj = modMemory.getInitalCreepMem("builder");
    memoryObj.room = roomName;

    var obj = {
      description:"Builder",
      body: null,
      name: undefined,
      memory:memoryObj
    };
    obj.body = bodyObj.getBody('builder',tier);
    Memory.rooms[roomName].spawnQ.push(obj);
    Memory.rooms[roomName].roles.numBuilders = Memory.rooms[roomName].roles.numBuilders + 1;
  },
  enqueueRepair:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObj = modMemory.getInitalCreepMem("repair");
    memoryObj.room = roomName;

    var obj = {
      description:"Repair",
      body: null,
      name: undefined,
      memory:memoryObj
    };
    if(tier === 1){
      obj.memory.selfHarvest = true;
    }
    obj.body = bodyObj.getBody('repair',tier);
    Memory.rooms[roomName].spawnQ.push(obj);
    Memory.rooms[roomName].roles.numRepair = Memory.rooms[roomName].roles.numRepair + 1;
  }, //Attacks?
  enqueueArchitect:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObj = modMemory.getInitalCreepMem("architect");
    memoryObj.room = roomName;

    var obj = {
      description:"Architect",
      body: null,
      name: undefined,
      memory:memoryObj
    };
    obj.body = bodyObj.getBody('architect',tier);
    Memory.rooms[roomName].spawnQ.push(obj);
    Memory.rooms[roomName].roles.numArchitects = Memory.rooms[roomName].roles.numArchitects + 1;
  },
  enqueueMiner:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObj = modMemory.getInitalCreepMem("miner");
    memoryObj.room = roomName;

    var obj = {
      description:"Miner",
      body: null,
      name: undefined,
      memory:memoryObj
    };
    obj.body = bodyObj.getBody('miner',tier);
    Memory.rooms[roomName].spawnQ.unshift(obj);
    Memory.rooms[roomName].roles.numMiners = Memory.rooms[roomName].roles.numMiners + 1;
  },
  enqueueHauler:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObj = modMemory.getInitalCreepMem("hauler");
    memoryObj.room = roomName;

    var obj = {
      description:"Hauler",
      body: null,
      name: undefined,
      memory:memoryObj
    };
    obj.body = bodyObj.getBody('hauler',tier);
    Memory.rooms[roomName].spawnQ.unshift(obj);
    Memory.rooms[roomName].roles.numHaulers = Memory.rooms[roomName].roles.numHaulers + 1;
  },
  enqueueFeeder:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObj = modMemory.getInitalCreepMem("feeder");
    memoryObj.room = roomName;

    var obj = {
      description:"Feeder",
      body: null,
      name: undefined,
      memory:memoryObj
    };
    obj.body = bodyObj.getBody('feeder',tier);
    Memory.rooms[roomName].spawnQ.push(obj);
    Memory.rooms[roomName].roles.numFeeders = Memory.rooms[roomName].roles.numFeeders + 1;
  },
  enqueueGeoMiner:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObj = modMemory.getInitalCreepMem("geo");
    memoryObj.room = roomName;

    var obj = {
      description:"Mineral Miner",
      body: null,
      name: undefined,
      memory:memoryObj
    };
    obj.body = bodyObj.getBody('geo',tier);
    Memory.rooms[roomName].spawnQ.push(obj);
    Memory.rooms[roomName].roles.numGeo = Memory.rooms[roomName].roles.numGeo + 1;
  },
  enqueueMerchant:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObj = modMemory.getInitalCreepMem("merchant");
    memoryObj.room = roomName;

    var obj = {
      description:"Merchant",
      body: null,
      name: undefined,
      memory:memoryObj
    };
    obj.body = bodyObj.getBody('merchant',tier);
    Memory.rooms[roomName].spawnQ.push(obj);
    Memory.rooms[roomName].roles.numMerchant = Memory.rooms[roomName].roles.numMerchant + 1;
  },

  enqueueAssist:function(roomName, creepType, toAssist){
    var tier = this.calcTier(roomName);
    var memoryObj = modMemory.getInitalCreepMem(creepType);
    memoryObj.assist = toAssist;
    memoryObj.selfHarvest =true;
    memoryObj.room = toAssist;

    var obj = {
      description:"Assist-" + creepType,
      body: null,
      name: undefined,
      memory:memoryObj
    };
    obj.body = bodyObj.getBody(creepType,tier);
    Memory.rooms[roomName].spawnQ.push(obj);
  },

  enqueuByJob: function(creepType,roomName,override){
    if(creepType==="harvester" && (this.needHarvester(roomName) || override))
     this.enqueueHarvester(roomName);
    if(creepType==="upgrader" && (this.needUpgrader(roomName) || override))
     this.enqueueUpgrader(roomName);
    if(creepType==="builder" && (this.needBuilder(roomName) || override))
     this.enqueueBuilder(roomName);
    if(creepType==="repair" && (this.needRepair(roomName) || override))
     this.enqueueRepair(roomName);
    if(creepType==="architect" && (this.needArchitect(roomName) || override))
     this.enqueueArchitect(roomName);
    if(creepType==="miner" && (this.needMiner(roomName) || override))
     this.enqueueMiner(roomName);
    if(creepType==="hauler" && (this.needHauler(roomName) || override))
     this.enqueueHauler(roomName);
    if(creepType==="feeder" && (this.needFeeder(roomName) || override))
     this.enqueueFeeder(roomName);
    if(creepType==="geo" && (this.needGeoMiner(roomName) || override))
     this.enqueueGeoMiner(roomName);
    if(creepType==="merchant" && (this.needMerchant(roomName) || override))
     this.enqueueMerchant(roomName);
  },

  enqueueAllNeeded(roomName){
    if(this.needHarvester(roomName))this.enqueueHarvester(roomName);
    if(this.needUpgrader(roomName))this.enqueueUpgrader(roomName);
    if(this.needBuilder(roomName))this.enqueueBuilder(roomName);
    if(this.needRepair(roomName))this.enqueueRepair(roomName);
    if(this.needArchitect(roomName))this.enqueueArchitect(roomName);
    if(this.needMiner(roomName))this.enqueueMiner(roomName);
    if(this.needHauler(roomName))this.enqueueHauler(roomName);
    if(this.needFeeder(roomName))this.enqueueFeeder(roomName);
    if(this.needGeoMiner(roomName))this.enqueueGeoMiner(roomName);
    if(this.needMerchant(roomName))this.enqueueMerchant(roomName);
  },

  //Returns a number between 1 and highest tier inclusive
  calcTier:function(roomName){
    var energyCapacity = Memory.rooms[roomName].energyCapacityAvailable;
    var notEnoughHarvest = (Memory.rooms[roomName].roles.numHarvesters <= 0) && (Memory.rooms[roomName].roles.numMiners <= 0);

    var spawnTier1 = (energyCapacity<modConstants.tier2EnergyMin);
    var spawnTier2 = (energyCapacity<modConstants.tier3EnergyMin);
    var spawnTier3 = (energyCapacity<modConstants.tier4EnergyMin);
    var spawnTier4 = (energyCapacity>=modConstants.tier4EnergyMin);

    if(spawnTier1 || notEnoughHarvest){
      return 1;
    }else if(spawnTier2){
      return 2;
    }else if(spawnTier3){
      return 3;
    }else if(spawnTier4){
      return 4;
    }
    return 1;
  },

  //dequeue and spawn
  spawn:function(roomName){
    var available = Game.rooms[roomName].energyAvailable;
    var queue = Memory.rooms[roomName].spawnQ;
    if(queue.length > 0){
      var spawners = Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType === STRUCTURE_SPAWN && !structure.spawning);
        }
      });
      for(var spawnNum in spawners){
        var spawn = spawners[spawnNum];
        var toSpawn = queue.shift();
        if(toSpawn !== undefined && spawn.canCreateCreep(toSpawn.body,toSpawn.name) === OK){
          var creep = spawn.createCreep(toSpawn.body,toSpawn.name,toSpawn.memory);
          console.log("Room "+roomName+": Spawning "+toSpawn.description+": "+creep + "\n" + JSON.stringify(toSpawn.body));
        }else{
            queue.unshift(toSpawn);
        }
      }
    }
  }
};
modSpawning.maxCreeps = 20;

module.exports = modSpawning;
