var roleArchitect = require('role.architect');
var bodyObj = require('module.bodyTypes');
var modCommon = require('module.common');
var modConstants = require('module.constants');
var modMemory = require('module.memory');
var modUtil = require('module.utility');

var modSpawning = {

  //These return booleans
  needHarvester:function(roomName){
    var roles = Memory.rooms[roomName].roles;
    var notEnoughHarvest = (roles.numHarvesters <= 0) && (roles.numMiners <= 0);
    var storageFilled = Game.rooms[roomName].storage && Game.rooms[roomName].storage.store.energy>1000;

    var LTMin = roles.numHarvesters < roles.maxHarvesters;
    var tier = this.calcTier(roomName);

    return (LTMin || (notEnoughHarvest && !storageFilled)) && tier<=3;
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
      return construct && LTMin && noArch;
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
    var flags = [];

    if(notEnoughHarvest){
      return false;
    }else{
      flags = _.filter(Game.rooms[roomName].find(FIND_FLAGS), (flag) => roleArchitect.ableToBuild(Game.rooms[roomName].controller.level, flag));

      return flags.length >0 && roles.numArchitects < 1;
    }
  },

  needMiner:function(roomName){
    var roles = Memory.rooms[roomName].roles;

    var tier = this.calcTier(roomName);
    //var sources = Memory.rooms[roomName].sourceIDs.length; TODO use this memory address
    var LTMin = roles.numMiners < roles.maxMiners;
    return (tier >= 4) && LTMin;

  },
  needHauler:function(roomName){
    var roles = Memory.rooms[roomName].roles;
    var notEnoughHarvest = (roles.numHarvesters <= 0) && (roles.numMiners <= 0);
    var miners = roles.numMiners > 0;

    if(notEnoughHarvest){
      return false;
    }else{
      var tier = this.calcTier(roomName);
      var LTMin = roles.numHaulers < roles.maxHaulers;
      return (tier >= 4) && LTMin && miners;
    }
  },

  needFeeder:function(roomName){
    var roles = Memory.rooms[roomName].roles;
    var notEnoughHarvest = (roles.numHarvesters <= 0) && (roles.numMiners <= 0);
    var storageFilled = Game.rooms[roomName].storage && Game.rooms[roomName].storage.store.energy>1000;

    if(notEnoughHarvest && !storageFilled){
      return false;
    }else{
      var tier = this.calcTier(roomName);
      var LTMin = roles.numFeeders < roles.maxFeeders;
      return (tier>=4) && LTMin;
    }
  },

  needGeoMiner:function(roomName){
    var roles = Memory.rooms[roomName].roles;
    var notEnoughHarvest = (roles.numHarvesters <= 0) && (roles.numMiners <= 0);

    if(notEnoughHarvest){
      return false;
    }else{
      var tier = this.calcTier(roomName);
      var LTMin = roles.numGeo < roles.maxGeo;

      var extractor = _.filter(Game.rooms[roomName].find(FIND_STRUCTURES), (structure) => structure.structureType === STRUCTURE_EXTRACTOR).length >0;
      var minerals = _.filter(Game.rooms[roomName].find(FIND_MINERALS), (mineral) => mineral.mineralAmount > 0).length> 0;

      return (tier >=4) && LTMin && extractor && minerals;
    }
  },

  needMerchant:function(roomName){
    var rawMinerals = [RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_LEMERGIUM, RESOURCE_KEANIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST, RESOURCE_GHODIUM];
    var roles = Memory.rooms[roomName].roles;
    var notEnoughHarvest = (roles.numHarvesters <= 0) && (roles.numMiners <= 0);

    if(notEnoughHarvest){
      return false;
    }else{
      var tier = this.calcTier(roomName);
      var storage = Game.rooms[roomName].storage;
      var terminal = Game.rooms[roomName].terminal;
      var LTMin = roles.numMerchant < roles.maxMerchant;
      var minerals = Game.rooms[roomName].find(FIND_MINERALS)[0];

      var resourceType = minerals.mineralType;
      var mineralsLeft = minerals.mineralAmount !== 0;
      var inStore = false;
      inStore = storage && modCommon.getResourceCount(storage.store,resourceType) >= 100;


      var inTerm = false;
      inTerm = terminal && modCommon.getResourceCount(terminal.store,resourceType) >= 100;

      var toSell = inStore || inTerm;

      return !mineralsLeft && toSell && (tier >= 4) && LTMin;
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
  enqueueHarvester:function(roomName, tier){
    if(!tier){
      tier = this.calcTier(roomName);
    }
    var memoryObjH = modMemory.getInitalCreepMem("harvester");
    memoryObjH.room = roomName;

    var harvesterObj = {
      description:"Harvester",
      body: null,
      name: undefined,
      memory:memoryObjH
    };
    harvesterObj.body = bodyObj.getBody('harvester',tier);
    //Using unshift() to add to front, basic priority
    //Only use this for miners/harvesters
    Memory.rooms[roomName].spawnQ.unshift(harvesterObj);
    modUtil.incrementCreepNum("harvester",roomName);
  },

  enqueueUpgrader:function(roomName){
    var tierCalced = this.calcTier(roomName);
    var maxTier = Memory.rooms[roomName].roles.maxUpgraderTier;
    var tier = Math.min(tierCalced,maxTier);
    var memoryObjU = modMemory.getInitalCreepMem("upgrader");
    memoryObjU.room = roomName;

    var obj = {
      description:"Upgrader",
      body: null,
      name: undefined,
      memory:memoryObjU
    };
    if(tier === 1){
      obj.memory.selfHarvest = true;
    }
    obj.body = bodyObj.getBody('upgrader',tier);
    Memory.rooms[roomName].spawnQ.push(obj);
    modUtil.incrementCreepNum("upgrader",roomName);
  },
  enqueueBuilder:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObjB = modMemory.getInitalCreepMem("builder");
    memoryObjB.room = roomName;

    var obj = {
      description:"Builder",
      body: null,
      name: undefined,
      memory:memoryObjB
    };
    obj.body = bodyObj.getBody('builder',tier);
    Memory.rooms[roomName].spawnQ.push(obj);
    modUtil.incrementCreepNum("builder",roomName);
  },
  enqueueRepair:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObjR = modMemory.getInitalCreepMem("repair");
    memoryObjR.room = roomName;

    var obj = {
      description:"Repair",
      body: null,
      name: undefined,
      memory:memoryObjR
    };
    if(tier === 1){
      obj.memory.selfHarvest = true;
    }
    obj.body = bodyObj.getBody('repair',tier);
    Memory.rooms[roomName].spawnQ.push(obj);
    modUtil.incrementCreepNum("repair",roomName);
  }, //Attacks?
  enqueueArchitect:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObjA = modMemory.getInitalCreepMem("architect");
    memoryObjA.room = roomName;

    var obj = {
      description:"Architect",
      body: null,
      name: undefined,
      memory:memoryObjA
    };
    obj.body = bodyObj.getBody('architect',tier);
    Memory.rooms[roomName].spawnQ.push(obj);
    modUtil.incrementCreepNum("architect",roomName);
  },
  enqueueMiner:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObjM = modMemory.getInitalCreepMem("miner");
    memoryObjM.room = roomName;

    var obj = {
      description:"Miner",
      body: null,
      name: undefined,
      memory:memoryObjM
    };
    obj.body = bodyObj.getBody('miner',tier);
    Memory.rooms[roomName].spawnQ.push(obj);
    modUtil.incrementCreepNum("miner",roomName);
  },
  enqueueHauler:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObjHa = modMemory.getInitalCreepMem("hauler");
    memoryObjHa.room = roomName;

    var obj = {
      description:"Hauler",
      body: null,
      name: undefined,
      memory:memoryObjHa
    };
    obj.body = bodyObj.getBody('hauler',tier);
    Memory.rooms[roomName].spawnQ.push(obj);
    modUtil.incrementCreepNum("hauler",roomName);
  },
  enqueueFeeder:function(roomName){
    var tier = this.calcTier(roomName);
    if(Game.rooms[roomName].energyAvailable<=300){
      tier = 1;
    }
    var memoryObjF = modMemory.getInitalCreepMem("feeder");
    memoryObjF.room = roomName;

    var obj = {
      description:"Feeder",
      body: null,
      name: undefined,
      memory:memoryObjF
    };
    obj.body = bodyObj.getBody('feeder',tier);
    Memory.rooms[roomName].spawnQ.unshift(obj);
    modUtil.incrementCreepNum("feeder",roomName);
  },
  enqueueGeoMiner:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObjGm = modMemory.getInitalCreepMem("geo");
    memoryObjGm.room = roomName;

    var obj = {
      description:"Mineral Miner",
      body: null,
      name: undefined,
      memory:memoryObjGm
    };
    obj.body = bodyObj.getBody('geo',tier);
    Memory.rooms[roomName].spawnQ.push(obj);
    modUtil.incrementCreepNum("geo",roomName);
  },
  enqueueMerchant:function(roomName){
    var tier = this.calcTier(roomName);
    var memoryObjMer = modMemory.getInitalCreepMem("merchant");
    memoryObjMer.room = roomName;

    var obj = {
      description:"Merchant",
      body: null,
      name: undefined,
      memory:memoryObjMer
    };
    obj.body = bodyObj.getBody('merchant',tier);
    Memory.rooms[roomName].spawnQ.push(obj);
    modUtil.incrementCreepNum("merchant",roomName);
  },

  enqueueAssist:function(roomName, creepType, toAssist){
    var tier = this.calcTier(roomName);
    var memoryObjAssist = modMemory.getInitalCreepMem(creepType);
    memoryObjAssist.assist = toAssist;
    memoryObjAssist.selfHarvest =true;
    memoryObjAssist.room = toAssist;

    var obj = {
      description:"Assist-" + creepType,
      body: null,
      name: undefined,
      memory:memoryObjAssist
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
    if(this.needMiner(roomName))this.enqueueMiner(roomName);
    if(this.needHauler(roomName))this.enqueueHauler(roomName);
    if(this.needHarvester(roomName))this.enqueueHarvester(roomName);
    if(this.needUpgrader(roomName))this.enqueueUpgrader(roomName);
    if(this.needBuilder(roomName))this.enqueueBuilder(roomName);
    if(this.needRepair(roomName))this.enqueueRepair(roomName);
    if(this.needArchitect(roomName))this.enqueueArchitect(roomName);
    if(this.needFeeder(roomName))this.enqueueFeeder(roomName);
    if(this.needGeoMiner(roomName))this.enqueueGeoMiner(roomName);
    if(this.needMerchant(roomName))this.enqueueMerchant(roomName);
  },

  //Returns a number between 1 and highest tier inclusive
  calcTier:function(roomName){
    var energyCapacity = Game.rooms[roomName].energyCapacityAvailable;
    var notEnoughHarvest = (Memory.rooms[roomName].roles.numHarvesters <= 0) && (Memory.rooms[roomName].roles.numMiners <= 0);

    var noFeeders = Memory.rooms[roomName].roles.numFeeders === 0;
    var noMiners = Memory.rooms[roomName].roles.numMiners === 0;
    var noHaulers = Memory.rooms[roomName].roles.numHaulers === 0;

    var spawnTier1 = (energyCapacity<modConstants.tier2EnergyMin);
    var spawnTier2 = (energyCapacity<modConstants.tier3EnergyMin);
    var spawnTier3 = (energyCapacity<modConstants.tier4EnergyMin || !Game.rooms[roomName].storage || (Game.rooms[roomName].storage.store.energy < modConstants.tier3To4Buffer && (noFeeders && noMiners && noHaulers)));
    var spawnTier4 = (energyCapacity<modConstants.tier5EnergyMin);
    var spawnTier5 = (energyCapacity<modConstants.tier6EnergyMin);
    var spawnTier6 = (energyCapacity<modConstants.tier7EnergyMin);
    var spawnTier7 = (energyCapacity>=modConstants.tier7EnergyMin);

    if(spawnTier1 || notEnoughHarvest){
      return 1;
    }else if(spawnTier2){
      return 2;
    }else if(spawnTier3){
      return 3;
    }else if(spawnTier4){
      return 4;
    }else if(spawnTier5){
      return 5;
    }else if(spawnTier6){
      return 6;
    }else if(spawnTier7){
      return 7;
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
        if(queue.length <= 0){
          break;
        }
        var spawn = spawners[spawnNum];
        var toSpawn = queue.shift();
        if(toSpawn !== undefined && spawn.canCreateCreep(toSpawn.body,toSpawn.name) === OK){
          var creep = spawn.createCreep(toSpawn.body,toSpawn.name,toSpawn.memory);
          console.log("Room "+roomName+": Spawning "+toSpawn.description+": "+creep + "\n" + JSON.stringify(toSpawn.body));
        }else{
            queue.unshift(toSpawn);
            //console.log("Could not spawn", toSpawn.description, "ERROR:",spawn.canCreateCreep(toSpawn.body,toSpawn.name));
            if(queue.length == Memory.rooms[roomName].roles.numCreeps && !spawn.spawning){
              this.enqueueHarvester(roomName,1); //FIXME change to have logic for if there are miners but no haulers, etc
            }
        }
      }
    }
  }
};
modSpawning.maxCreeps = 20;

module.exports = modSpawning;
