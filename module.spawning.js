var roleArchitect = require('role.architect');
var bodyObj = require('module.bodyTypes');

var modSpawning = {
  incrementNum:function(creepType){
    if(creepType==="harvester"){
      ++Memory.roles.numHarvesters;
    }else if(creepType === "upgrader"){
      ++Memory.roles.numUpgraders;
    }else if(creepType === "builder"){
      ++Memory.roles.numBuilders;
    }else if(creepType === "repair"){
      ++Memory.roles.numRepair;
    }else if (creepType === "architect"){
      ++Memory.roles.numArchitects;
    }else if(creepType === "miner"){
      ++Memory.roles.numMiners;
    }else if(creepType === "hauler"){
      ++Memory.roles.numHaulers;
    }else if(creepType === "feeder"){
      ++Memory.roles.numFeeders;
    }
    ++Memory.roles.numCreeps;
  },

  spawn:function(spawner,energyCapacity,controllerLvl){
    var numSources = spawner.room.find(FIND_SOURCES).length;
    var numTowers = spawner.room.find(FIND_STRUCTURES, {filter: (struct)=> struct.structureType === STRUCTURE_TOWER}).length;
    var isStorage = spawner.room.find(FIND_STRUCTURES, {filter: (struct)=> struct.structureType === STRUCTURE_STORAGE}).length >0;
    var betterHarvesters1 = Memory.roles.betterHarvesters1; // number of tier2 harvesters spawned, to track shift

    var betterHarvesters2 = Memory.roles.betterHarvesters2; // number of tier2 harvesters spawned, to track shift
    var controllerLvlMod = Math.ceil((controllerLvl-1)/3);  //modifier to the max amount of each creep

    var notEnoughHarvest = ((Memory.roles.numHarvesters < Memory.roles.maxHarvesters) && (Memory.roles.numMiners + Memory.roles.numHarvesters < 1));  //if there are enough harvesters, to stop other higher tier spawns

    var noHarvest = (Memory.roles.numHarvesters < 1) && (Memory.roles.numHaulers<1);

    var spawnTier1 = (energyCapacity<550 || (spawner.room.energyAvailable<550 && noHarvest)); //boolean for tier 1 spawning

    var spawnTier2 = (energyCapacity<800 || (spawner.room.energyAvailable<800 && notEnoughHarvest));  //boolean for tier2 spawning

    var spawnTier3 = (energyCapacity<1300 || (spawner.room.energyAvailable<800 && notEnoughHarvest));  //boolean for tier3 spawning

    var spawnTier4 = (energyCapacity>=1300);

    var flags = _.filter(spawner.room.find(FIND_FLAGS), (flag) => roleArchitect.ableToBuild(controllerLvl, flag.name));
    var body = [MOVE];
    if(spawnTier1){
        //make sure there is energy and the spawner isnt already working, then spawn harvesters, upgrader, and repair in that priority
        if((!spawner.spawning) && (spawner.room.energyAvailable>=300)){
            if(Memory.roles.numHarvesters < (Memory.roles.maxHarvesters)){
              body = bodyObj.getBody('harvester',1);
              var hc = spawner.createCreep(body, undefined,{role: 'harvester',selfHarvest:true, source:""});
              console.log("Spawned Harvester: " + hc);
              this.incrementNum("harvester");
            }
            else if(Memory.roles.numUpgraders < Math.min(Memory.roles.maxUpgraders+controllerLvlMod, spawner.room.find(FIND_SOURCES).length)){
              body = bodyObj.getBody('upgrader',1);
              var uc = spawner.createCreep(body, undefined,{role: 'upgrader', selfHarvest:true});
              console.log("Spawned Upgrader: " + uc);
              this.incrementNum("upgrader");
            }
            else if(Memory.roles.numRepair< (Memory.roles.maxRepair - numTowers)){
              body = bodyObj.getBody('repair',1);
              var rc = spawner.createCreep(body, undefined,{role: 'repair', toFix:'', selfHarvest:true, military:true});
              console.log("Spawned Repair: " + rc);
              this.incrementNum("repair");
            }
            else if(flags.length && Memory.roles.numArchitects < 1){
              body = bodyObj.getBody('architect',1);
              var ac = spawner.createCreep(body, undefined,{role: 'architect', toFix:'', selfHarvest:false});
              console.log("Spawned Architect: " + ac);
              this.incrementNum("architect");
            }
        }
    }else if(spawnTier2){
      //make sure there is energy and the spawner isnt already working, then spawn harvesters, builders, upgrader, and repair in that priority
      var moveOn = (betterHarvesters1>=(Memory.roles.maxHarvesters));
      if((!spawner.spawning) && (spawner.room.energyAvailable>=550)){
          if(Memory.roles.numHarvesters < (Memory.roles.maxHarvesters)){
            body = bodyObj.getBody('harvester',2);
            var h2c = spawner.createCreep(body, undefined,{role: 'harvester',selfHarvest:true, source:""});
             console.log("Spawned Harvester: " + h2c);
             betterHarvesters1++;
             this.incrementNum("harvester");
          }
          else if(moveOn && spawner.room.find(FIND_MY_CONSTRUCTION_SITES).length && (Memory.roles.numBuilders < (Memory.roles.maxBuilders)) && Memory.roles.numArchitects === 0){
            body = bodyObj.getBody('builder',2);
            var b2c = spawner.createCreep(body, undefined,{role: 'builder',selfHarvest:false});
            console.log("Spawned Builder: " + b2c);
            this.incrementNum("builder");
          }
          else if(moveOn && Memory.roles.numUpgraders < Math.min(Memory.roles.maxUpgraders+controllerLvlMod, spawner.room.find(FIND_SOURCES).length)){
            body = bodyObj.getBody('upgrader',2);
            var u2c = spawner.createCreep(body, undefined,{role: 'upgrader', selfHarvest:false});
            console.log("Spawned Upgrader: " + u2c);
            this.incrementNum("upgrader");
          }
          else if(moveOn && Memory.roles.numRepair< (Memory.roles.maxRepair - numTowers)){
            body = bodyObj.getBody('repair',2);
            var r2c = spawner.createCreep(body, undefined,{role: 'repair', toFix:'', selfHarvest:true, military:true});
            console.log("Spawned Repair: " + r2c);
            this.incrementNum("repair");
          }
          else if(moveOn && flags.length && Memory.roles.numArchitects < 1){
            body = bodyObj.getBody('architect',2);
            var a2c = spawner.createCreep(body, undefined,{role: 'architect', toFix:'', selfHarvest:false});
            console.log("Spawned Architect: " + a2c);
            this.incrementNum("architect");
          }
      }
    }else if(spawnTier3){
      //make sure there is energy and the spawner isnt already working, then spawn harvesters, builders, upgrader, and repair in that priority
      var moveOn2 = (betterHarvesters2>=(Memory.roles.maxHarvesters));
      if((!spawner.spawning) && (spawner.room.energyAvailable>=800)){
        if(Memory.roles.numHarvesters < (Memory.roles.maxHarvesters)){
          body = bodyObj.getBody('harvester',3);
          var h3c = spawner.createCreep(body, undefined,{role: 'harvester',selfHarvest:true, source:""});
          console.log("Spawned Harvester: " + h3c);
          betterHarvesters2++;
          this.incrementNum("harvester");
        }
        else if(moveOn2 && spawner.room.find(FIND_MY_CONSTRUCTION_SITES).length && (Memory.roles.numBuilders < (Memory.roles.maxBuilders)) && Memory.roles.numArchitects === 0){
          body = bodyObj.getBody('builder',3);
          var b3c = spawner.createCreep(body, undefined,{role: 'builder',selfHarvest:false});
          console.log("Spawned Builder: " + b3c);
          this.incrementNum("builder");
        }
        else if(moveOn2 && Memory.roles.numUpgraders < Math.min(Memory.roles.maxUpgraders+controllerLvlMod, spawner.room.find(FIND_SOURCES).length)){
          body = bodyObj.getBody('upgrader',3);
          var u3c = spawner.createCreep(body, undefined,{role: 'upgrader', selfHarvest:false});
          console.log("Spawned Upgrader: " + u3c);
          this.incrementNum("upgrader");
        }
        else if(moveOn2 && Memory.roles.numRepair< (Memory.roles.maxRepair - numTowers)){
          body = bodyObj.getBody('repair',3);
          var r3c = spawner.createCreep(body, undefined,{role: 'repair', toFix:'', selfHarvest:true, military:true});
          console.log("Spawned Repair: " + r3c);
          this.incrementNum("repair");
        }
        else if(moveOn2 && flags.length && Memory.roles.numArchitects < 1){
          body = bodyObj.getBody('architect',3);
          var a3c = spawner.createCreep(body, undefined,{role: 'architect', toFix:'', selfHarvest:false});
          console.log("Spawned Architect: " + a3c);
          this.incrementNum("architect");
        }
      }
    }else if (spawnTier4){
      if(!spawner.spawning && (spawner.room.energyAvailable >=800)){
        var moveOn3 = (Memory.roles.numMiners >= numSources) && (Memory.roles.numHaulers>=1);
        if(Memory.roles.numMiners< numSources){
          body = bodyObj.getBody('miner',4);
          var mine = spawner.createCreep(body, undefined,{role: 'miner',source:"", dropOff: "", military:true});
          console.log("Spawned Miner: " + mine);
          this.incrementNum("miner");
        }
        else if(Memory.roles.numHaulers<Memory.roles.maxHaulers){
          body = bodyObj.getBody('hauler',4);
          var haul = spawner.createCreep(body, undefined,{role: 'hauler', military:true, dropOff:""});
          console.log("Spawned Hauler: " + haul);
          this.incrementNum("hauler");
        }
        else if(moveOn3 && Memory.roles.numFeeders<Memory.roles.maxFeeders && isStorage){
          body = bodyObj.getBody('feeder',4);
          var feed = spawner.createCreep(body, undefined,{role: 'feeder', military:true});
          console.log("Spawned Feeder: " + feed);
          this.incrementNum("feeder");
        }
        else if(moveOn3 && spawner.room.find(FIND_MY_CONSTRUCTION_SITES).length && (Memory.roles.numBuilders < (Memory.roles.maxBuilders)) && Memory.roles.numArchitects === 0){
          body = bodyObj.getBody('builder',4);
          var b4c = spawner.createCreep(body, undefined,{role: 'builder',selfHarvest:false});
          console.log("Spawned Builder: " + b4c);
          this.incrementNum("builder");
        }
        else if(moveOn3 && Memory.roles.numUpgraders < Math.min(Memory.roles.maxUpgraders+controllerLvlMod, spawner.room.find(FIND_SOURCES).length)){
          body = bodyObj.getBody('upgrader',4);
          var u4c = spawner.createCreep(body, undefined,{role: 'upgrader', selfHarvest:false});
          console.log("Spawned Upgrader: " + u4c);
          this.incrementNum("upgrader");
        }
        else if(moveOn3 && Memory.roles.numRepair< (Memory.roles.maxRepair - numTowers)){
          body = bodyObj.getBody('repair',4);
          var r4c = spawner.createCreep(body, undefined,{role: 'repair', toFix:'', selfHarvest:false, military:true});
          console.log("Spawned Repair: " + r4c);
          this.incrementNum("repair");
        }
        else if(moveOn3 && flags.length && Memory.roles.numArchitects < 1){
          body = bodyObj.getBody('architect',4);
          var a4c = spawner.createCreep(body, undefined,{role: 'architect', toFix:'', selfHarvest:false});
          console.log("Spawned Architect: " + a4c);
          this.incrementNum("architect");
        }
      }
    }
    Memory.roles.betterHarvesters1 = betterHarvesters1;
    Memory.roles.betterHarvesters2 = betterHarvesters2;

  }
};
modSpawning.maxCreeps = 20;

module.exports = modSpawning;
