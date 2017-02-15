var roleArchitect = require('role.architect');
var bodyObj = require('module.bodyTypes');
var modCommon = require('module.common');
var modConstants = require('module.constants');
var modMemory = require('module.memory');
//TODO queue system
//var queue = modMemory.getSpawnQ(roomName);
//queue.push(addSpawn);
//var nextSpawn = queue.shift();
//Change max upgraders to 1 and just increase work parts

var modSpawning = {

  //These return booleans
  needHarvester:function(roomName){},//if no harvesters, enqueue largest buildable
  needUpgrader:function(roomName){},
  needBuilder:function(roomName){},
  needRepair:function(roomName){}, //Attacks?
  needArchitect:function(roomName){},
  needMiner:function(roomName){},
  needHauler:function(roomName){},
  needFeeder:function(roomName){},
  needGeoMiner:function(roomName){},
  needMerchant:function(roomName){},

  //Add type to queue, full parameter list object
  //  {description:'Creep Role',body:bodyObj,name:'',memory:{role:'creep-role'}}
  //call memory initCreep() in each
  enqueueHarvester:function(roomName){
    var tier = this.calcTier(roomName);
    var enoughHarvest = (Memory.rooms[roomName].roles.numHarvesters > 0) || (Memory.rooms[roomName].roles.numMiners > 0);

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

    if(!enoughHarvest){
      harvesterObj.body = bodyObj.getBody('harvester',1);
    }else{
      harvesterObj.body = bodyObj.getBody('harvester',tier);
    }

    Memory.rooms[roomName].spawnQ.push(harvesterObj);
  },

  enqueueUpgrader:function(roomName){},
  enqueueBuilder:function(roomName){},
  enqueueRepair:function(roomName){}, //Attacks?
  enqueueArchitect:function(roomName){},
  enqueueMiner:function(roomName){},
  enqueueHauler:function(roomName){},
  enqueueFeeder:function(roomName){},
  enqueueGeoMiner:function(roomName){},
  enqueueMerchant:function(roomName){},

  //TODO call this and spawn() from main
  enqueueAllNeeded(roomName){
    if(this.needHarvester(roomName)) enqueueHarvester(roomName);
    if(this.needUpgrader(roomName)) enqueueUpgrader(roomName);
    if(this.needBuilder(roomName)) enqueueBuilder(roomName);
    if(this.needRepair(roomName)) enqueueRepair(roomName);
    if(this.needArchitect(roomName)) enqueueArchitect(roomName);
    if(this.needMiner(roomName)) enqueueMiner(roomName);
    if(this.needHauler(roomName)) enqueueHauler(roomName);
    if(this.needFeeder(roomName)) enqueueFeeder(roomName);
    if(this.needGeoMiner(roomName)) enqueueGeoMiner(roomName);
    if(this.needMerchant(roomName)) enqueueMerchant(roomName);
  },

  //Returns a number between 1 and highest tier inclusive
  calcTier:function(roomName){
    var energyCapacity = Memory.rooms[roomName].energyCapacityAvailable;

    var spawnTier1 = (energyCapacity<modConstants.tier2EnergyMin);
    var spawnTier2 = (energyCapacity<modConstants.tier3EnergyMin);
    var spawnTier3 = (energyCapacity<modConstants.tier4EnergyMin);
    var spawnTier4 = (energyCapacity>=modConstants.tier4EnergyMin);

    if(spawnTier1){
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
    var available = Memory.rooms[roomName].energyAvailable;
    var queue = Memory.rooms[roomName].spawnQ;
    var spawners = Game.rooms[roomName].find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_SPAWN && !structure.spawning);
      }
    });
    for(var spawn in spawners){
      var toSpawn = queue.shift();
      if(toSpawn !== undefined && bodyObj.calcCost(toSpawn.body)<=available){
        var creep = spawn.createCreep(toSpawn.body,toSpawn.name,toSpawn.memory);
        console.log("Room "+roomName+": Spawning "+toSpawn.description+": "+creep);
      }
    }
  },


  OLD_spawn:function(spawner,energyCapacity,controllerLvl){
    //TODO put all of the constants here in memory after first run, check every 100 or so ticks maybe
    //Maybe an init method for the module
    var numSources = spawner.room.find(FIND_SOURCES).length;
    var numTowers = spawner.room.find(FIND_STRUCTURES, {filter: (struct)=> struct.structureType === STRUCTURE_TOWER}).length;
    var isStorage = (spawner.room.storage !== undefined) && (spawner.room.storage.store.energy > 1000);
    var betterHarvesters1 = Memory.roles.betterHarvesters1; // number of tier2 harvesters spawned, to track shift

    var betterHarvesters2 = Memory.roles.betterHarvesters2; // number of tier2 harvesters spawned, to track shift

    var notEnoughHarvest = ((Memory.roles.numHarvesters < Memory.roles.maxHarvesters) && (Memory.roles.numMiners + Memory.roles.numHarvesters < 1));  //if there are enough harvesters, to stop other higher tier spawns

    var noHarvest = (Memory.roles.numHarvesters < 1) && (Memory.roles.numHaulers<1);

    var spawnTier1 = (energyCapacity<550 || (spawner.room.energyAvailable<550 && noHarvest)); //boolean for tier 1 spawning

    var spawnTier2 = (energyCapacity<800 || (spawner.room.energyAvailable<800 && notEnoughHarvest));  //boolean for tier2 spawning

    var spawnTier3 = (energyCapacity<1300 || (spawner.room.energyAvailable<800 && notEnoughHarvest));  //boolean for tier3 spawning

    var spawnTier4 = (energyCapacity>=1300);

    var flags = _.filter(spawner.room.find(FIND_FLAGS), (flag) => roleArchitect.ableToBuild(controllerLvl, flag.name));

    var body = [MOVE];

    var extractor = _.filter(spawner.room.find(FIND_STRUCTURES), (structure) => structure.structureType === STRUCTURE_EXTRACTOR);

    var market = spawner.room.terminal !== undefined;

    var minerals = (_.filter(spawner.room.find(FIND_MINERALS), (mineral) => mineral.mineralAmount > 0).length) > 0;

    var toSell = !minerals && (modCommon.whatStore(spawner.room.storage) != RESOURCE_ENERGY);

    if(spawnTier1){
        //make sure there is energy and the spawner isnt already working, then spawn harvesters, upgrader, and repair in that priority
        if((!spawner.spawning) && (spawner.room.energyAvailable>=300)){
            if(Memory.roles.numHarvesters < (Memory.roles.maxHarvesters)){
              body = bodyObj.getBody('harvester',1);
              var hc = spawner.createCreep(body, undefined,{role: 'harvester',selfHarvest:true, source:""});
              console.log("Spawning Harvester: " + hc);
              modCommon.incrementCreepNum("harvester");
            }
            else if(Memory.roles.numUpgraders < Math.min(Memory.roles.maxUpgraders+modConstants.getConLvlMod(spawner.room), spawner.room.find(FIND_SOURCES).length)){
              body = bodyObj.getBody('upgrader',1);
              var uc = spawner.createCreep(body, undefined,{role: 'upgrader', selfHarvest:true});
              console.log("Spawning Upgrader: " + uc);
              modCommon.incrementCreepNum("upgrader");
            }
            else if(Memory.roles.numRepair< (Memory.roles.maxRepair - numTowers)){
              body = bodyObj.getBody('repair',1);
              var rc = spawner.createCreep(body, undefined,{role: 'repair', toFix:'', selfHarvest:true, military:true});
              console.log("Spawning Repair: " + rc);
              modCommon.incrementCreepNum("repair");
            }
            else if(flags.length && Memory.roles.numArchitects < 1){
              body = bodyObj.getBody('architect',1);
              var ac = spawner.createCreep(body, undefined,{role: 'architect', toFix:'', selfHarvest:false});
              console.log("Spawning Architect: " + ac);
              modCommon.incrementCreepNum("architect");
            }
        }
    }else if(spawnTier2){
      //make sure there is energy and the spawner isnt already working, then spawn harvesters, builders, upgrader, and repair in that priority
      var moveOn = (betterHarvesters1>=(Memory.roles.maxHarvesters));
      if((!spawner.spawning) && (spawner.room.energyAvailable>=550)){
          if(Memory.roles.numHarvesters < (Memory.roles.maxHarvesters)){
            body = bodyObj.getBody('harvester',2);
            var h2c = spawner.createCreep(body, undefined,{role: 'harvester',selfHarvest:true, source:""});
             console.log("Spawning Harvester: " + h2c);
             betterHarvesters1++;
             modCommon.incrementCreepNum("harvester");
          }
          else if(moveOn && spawner.room.find(FIND_MY_CONSTRUCTION_SITES).length && (Memory.roles.numBuilders < (Memory.roles.maxBuilders)) && Memory.roles.numArchitects === 0){
            body = bodyObj.getBody('builder',2);
            var b2c = spawner.createCreep(body, undefined,{role: 'builder',selfHarvest:false});
            console.log("Spawning Builder: " + b2c);
            modCommon.incrementCreepNum("builder");
          }
          else if(moveOn && Memory.roles.numUpgraders < Math.min(Memory.roles.maxUpgraders+modConstants.getConLvlMod(spawner.room), spawner.room.find(FIND_SOURCES).length)){
            body = bodyObj.getBody('upgrader',2);
            var u2c = spawner.createCreep(body, undefined,{role: 'upgrader', selfHarvest:false});
            console.log("Spawning Upgrader: " + u2c);
            modCommon.incrementCreepNum("upgrader");
          }
          else if(moveOn && Memory.roles.numRepair< (Memory.roles.maxRepair - numTowers)){
            body = bodyObj.getBody('repair',2);
            var r2c = spawner.createCreep(body, undefined,{role: 'repair', toFix:'', selfHarvest:true, military:true});
            console.log("Spawning Repair: " + r2c);
            modCommon.incrementCreepNum("repair");
          }
          else if(moveOn && flags.length && Memory.roles.numArchitects < 1){
            body = bodyObj.getBody('architect',2);
            var a2c = spawner.createCreep(body, undefined,{role: 'architect', toFix:'', selfHarvest:false});
            console.log("Spawning Architect: " + a2c);
            modCommon.incrementCreepNum("architect");
          }
      }
    }else if(spawnTier3){
      //make sure there is energy and the spawner isnt already working, then spawn harvesters, builders, upgrader, and repair in that priority
      var moveOn2 = (betterHarvesters2>=(Memory.roles.maxHarvesters));
      if((!spawner.spawning) && (spawner.room.energyAvailable>=800)){
        if(Memory.roles.numHarvesters < (Memory.roles.maxHarvesters)){
          body = bodyObj.getBody('harvester',3);
          var h3c = spawner.createCreep(body, undefined,{role: 'harvester',selfHarvest:true, source:""});
          console.log("Spawning Harvester: " + h3c);
          betterHarvesters2++;
          modCommon.incrementCreepNum("harvester");

        }
        else if(moveOn2 && spawner.room.find(FIND_MY_CONSTRUCTION_SITES).length && (Memory.roles.numBuilders < (Memory.roles.maxBuilders)) && Memory.roles.numArchitects === 0){
          body = bodyObj.getBody('builder',3);
          var b3c = spawner.createCreep(body, undefined,{role: 'builder',selfHarvest:false});
          console.log("Spawning Builder: " + b3c);
          modCommon.incrementCreepNum("builder");

        }
        else if(moveOn2 && Memory.roles.numUpgraders < Math.min(Memory.roles.maxUpgraders+modConstants.getConLvlMod(spawner.room), spawner.room.find(FIND_SOURCES).length)){
          body = bodyObj.getBody('upgrader',3);
          var u3c = spawner.createCreep(body, undefined,{role: 'upgrader', selfHarvest:false});
          console.log("Spawning Upgrader: " + u3c);
          modCommon.incrementCreepNum("upgrader");
        }
        else if(moveOn2 && Memory.roles.numRepair< (Memory.roles.maxRepair - numTowers)){
          body = bodyObj.getBody('repair',3);
          var r3c = spawner.createCreep(body, undefined,{role: 'repair', toFix:'', selfHarvest:true, military:true});
          console.log("Spawning Repair: " + r3c);
          modCommon.incrementCreepNum("repair");
        }
        else if(moveOn2 && flags.length && Memory.roles.numArchitects < 1){
          body = bodyObj.getBody('architect',3);
          var a3c = spawner.createCreep(body, undefined,{role: 'architect', toFix:'', selfHarvest:false});
          console.log("Spawning Architect: " + a3c);
          modCommon.incrementCreepNum("architect");
        }
      }
    }else if (spawnTier4){
      if(!spawner.spawning && (spawner.room.energyAvailable >=800)){
        var moveOn3 = (Memory.roles.numMiners >= numSources) && (Memory.roles.numHaulers>=1);
        if(Memory.roles.numMiners< numSources){
          body = bodyObj.getBody('miner',4);
          var mine = spawner.createCreep(body, undefined,{role: 'miner',source:"", dropOff: "", military:true});
          console.log("Spawning Miner: " + mine);
          modCommon.incrementCreepNum("miner");
        }
        else if(Memory.roles.numHaulers<Memory.roles.maxHaulers){
          body = bodyObj.getBody('hauler',4);
          var haul = spawner.createCreep(body, undefined,{role: 'hauler', military:true, dropOff:""});
          console.log("Spawning Hauler: " + haul);
          modCommon.incrementCreepNum("hauler");
        }
        else if(moveOn3 && Memory.roles.numFeeders<Memory.roles.maxFeeders && isStorage){
          body = bodyObj.getBody('feeder',4);
          var feed = spawner.createCreep(body, undefined,{role: 'feeder', military:true});
          console.log("Spawning Feeder: " + feed);
          modCommon.incrementCreepNum("feeder");
        }
        else if(moveOn3 && spawner.room.find(FIND_MY_CONSTRUCTION_SITES).length && (Memory.roles.numBuilders < (Memory.roles.maxBuilders)) && Memory.roles.numArchitects === 0){
          body = bodyObj.getBody('builder',4);
          var b4c = spawner.createCreep(body, undefined,{role: 'builder',selfHarvest:false});
          console.log("Spawning Builder: " + b4c);
          modCommon.incrementCreepNum("builder");
        }
        else if(moveOn3 && Memory.roles.numUpgraders < 1){
          body = bodyObj.getBody('upgrader',4);
          var u4c = spawner.createCreep(body, undefined,{role: 'upgrader', selfHarvest:false});
          console.log("Spawning Upgrader: " + u4c);
          modCommon.incrementCreepNum("upgrader");
        }
        else if(moveOn3 && Memory.roles.numRepair< (Memory.roles.maxRepair - numTowers)){
          body = bodyObj.getBody('repair',4);
          var r4c = spawner.createCreep(body, undefined,{role: 'repair', toFix:'', selfHarvest:false, military:true});
          console.log("Spawning Repair: " + r4c);
          modCommon.incrementCreepNum("repair");
        }
        else if(moveOn3 && flags.length && Memory.roles.numArchitects < 1){
          body = bodyObj.getBody('architect',4);
          var a4c = spawner.createCreep(body, undefined,{role: 'architect', toFix:'', selfHarvest:false});
          console.log("Spawning Architect: " + a4c);
          modCommon.incrementCreepNum("architect");
        }
        else if(moveOn3 && extractor && minerals && Memory.roles.numGeo < Memory.roles.maxGeo){
          body = bodyObj.getBody('geoMiner',4);
          var g4c = spawner.createCreep(body, undefined,{role: 'geo', mineral:"", dropOff:""});
          console.log("Spawning GeoMiner: " + g4c);
          modCommon.incrementCreepNum("geo");
        }
        else if(moveOn3 && extractor && Memory.roles.numGeoH < Memory.roles.maxGeoH){
          body = bodyObj.getBody('geoHauler',4);
          var gh4c = spawner.createCreep(body, undefined,{role: 'geoH', dropOff:""});
          console.log("Spawning GeoHauler: " + gh4c);
          modCommon.incrementCreepNum("geoHauler");
        }
        else if(moveOn3 && market && toSell && Memory.roles.numMerchant < Memory.roles.maxMerchant){
          body = bodyObj.getBody('merchant',4);
          var mer4c = spawner.createCreep(body, undefined,{role: 'merchant', terminal:"", storage:""});
          console.log("Spawning Merchant: " + mer4c);
          modCommon.incrementCreepNum("merchant");
        }
      }
    }
    Memory.roles.betterHarvesters1 = betterHarvesters1;
    Memory.roles.betterHarvesters2 = betterHarvesters2;

  }
};
modSpawning.maxCreeps = 20;

module.exports = modSpawning;
