var roleArchitect = require('role.architect');
//variables for the different creeps that auto spawn
//Tier 1
var hBody = [WORK, CARRY, CARRY, MOVE, MOVE];
var uBody = [WORK, CARRY, CARRY, CARRY, MOVE];
var bBody = [WORK, CARRY, WORK, MOVE];
var rBody = [WORK, WORK, CARRY, MOVE];

//Tier 2
var h2Body = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
var u2Body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
var b2Body = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
var r2Body = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];

//Tier 3
var h3Body = [WORK, WORK, CARRY, CARRY, CARRY, CARRY,CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
var u3Body = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
var b3Body = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
var r3Body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];

var modSpawning = {
  spawn:function(spawner,energyCapacity,controllerLvl){
    var betterHarvesters1 = Memory.roles.betterHarvesters1; // number of tier2 harvesters spawned, to track shift

    var betterHarvesters2 = Memory.roles.betterHarvesters2; // number of tier2 harvesters spawned, to track shift

    var controllerLvlMod = Math.floor(controllerLvl/2);  //modifier to the max amount of each creep

    var notEnoughHarvest = (Memory.roles.numHarvesters < (Memory.roles.maxHarvesters));  //if there are enough harvesters, to stop other higher tier spawns

    var noHarvest = (Memory.roles.numHarvesters < 1);

    var spawnTier1 = (energyCapacity<550 || (spawner.room.energyAvailable<550 && noHarvest)); //boolean for tier 1 spawning

    var spawnTier2 = (energyCapacity<800 || (spawner.room.energyAvailable<800 && notEnoughHarvest));  //boolean for tier2 spawning

    var spawnTier3 = (energyCapacity>=800);  //boolean for tier3 spawning

    var flags = _.filter(spawner.room.find(FIND_FLAGS), (flag) => roleArchitect.ableToBuild(controllerLvl, flag.name));
    if(spawnTier1){
        //make sure there is energy and the spawner isnt already working, then spawn harvesters, upgrader, and repair in that priority
        if((!spawner.spawning) && (spawner.room.energyAvailable>=300)){
            if(Memory.roles.numHarvesters < (Memory.roles.maxHarvesters)){
               var hc = spawner.createCreep(hBody, undefined,{role: 'harvester',selfHarvest:true, source:""});
               console.log("Spawned: " + hc);
            }
            else if(Memory.roles.numUpgraders < (Memory.roles.maxUpgraders + controllerLvlMod)){
               var uc = spawner.createCreep(uBody, undefined,{role: 'upgrader', selfHarvest:false});
               console.log("Spawned: " + uc);
            }
            else if(Memory.roles.numRepair< (Memory.roles.maxRepair)){
               var rc = spawner.createCreep(rBody, undefined,{role: 'repair', toFix:'', selfHarvest:true});
               console.log("Spawned: " + rc);
            }
            else if(flags.length && Memory.roles.numArchitects < 1){
              var ac = spawner.createCreep(bBody, undefined,{role: 'architect', toFix:'', selfHarvest:false});
              console.log("Spawned: " + ac);
            }
        }
    }else if(spawnTier2){
      //make sure there is energy and the spawner isnt already working, then spawn harvesters, builders, upgrader, and repair in that priority
      var moveOn = (betterHarvesters1>=(Memory.roles.maxHarvesters));
      if((!spawner.spawning) && (spawner.room.energyAvailable>=550)){
          if(Memory.roles.numHarvesters < (Memory.roles.maxHarvesters)){
             var h2c = spawner.createCreep(h2Body, undefined,{role: 'harvester',selfHarvest:true, source:""});
             console.log("Spawned: " + h2c);
             betterHarvesters1++;
          }
          else if(moveOn && spawner.room.find(FIND_MY_CONSTRUCTION_SITES).length && (Memory.roles.numBuilders < (Memory.roles.maxBuilders)) && Memory.roles.numArchitects === 0){
             var b2c = spawner.createCreep(b2Body, undefined,{role: 'builder',selfHarvest:false});
             console.log("Spawned: " + b2c);
          }
          else if(moveOn && Memory.roles.numUpgraders < (Memory.roles.maxUpgraders + controllerLvlMod)){
             var u2c = spawner.createCreep(u2Body, undefined,{role: 'upgrader', selfHarvest:false});
             console.log("Spawned: " + u2c);
          }
          else if(moveOn && Memory.roles.numRepair< (Memory.roles.maxRepair)){
             var r2c = spawner.createCreep(r2Body, undefined,{role: 'repair', toFix:'', selfHarvest:true});
             console.log("Spawned: " + r2c);
          }
          else if(moveOn && flags.length && Memory.roles.numArchitects < 1){
            var a2c = spawner.createCreep(bBody, undefined,{role: 'architect', toFix:'', selfHarvest:false});
            console.log("Spawned: " + a2c);
          }
      }
    }else if(spawnTier3){
      //make sure there is energy and the spawner isnt already working, then spawn harvesters, builders, upgrader, and repair in that priority
      var moveOn2 = (betterHarvesters2>=(Memory.roles.maxHarvesters));
      if((!spawner.spawning) && (spawner.room.energyAvailable>=800)){
        if(Memory.roles.numHarvesters < (Memory.roles.maxHarvesters)){
           var h3c = spawner.createCreep(h3Body, undefined,{role: 'harvester',selfHarvest:true, source:""});
           console.log("Spawned: " + h3c);
           betterHarvesters2++;
        }
        else if(moveOn2 && spawner.room.find(FIND_MY_CONSTRUCTION_SITES).length && (Memory.roles.numBuilders < (Memory.roles.maxBuilders)) && Memory.roles.numArchitects === 0){
           var b3c = spawner.createCreep(b3Body, undefined,{role: 'builder',selfHarvest:false});
           console.log("Spawned: " + b3c);
        }
        else if(moveOn2 && Memory.roles.numUpgraders < (Memory.roles.maxUpgraders + controllerLvlMod)){
           var u3c = spawner.createCreep(u3Body, undefined,{role: 'upgrader', selfHarvest:false});
           console.log("Spawned: " + u3c);
        }
        else if(moveOn2 && Memory.roles.numRepair< (Memory.roles.maxRepair)){
           var r3c = spawner.createCreep(r3Body, undefined,{role: 'repair', toFix:'', selfHarvest:true});
           console.log("Spawned: " + r3c);
        }
        else if(moveOn2 && flags.length && Memory.roles.numArchitects < 1){
          var a3c = spawner.createCreep(bBody, undefined,{role: 'architect', toFix:'', selfHarvest:false});
          console.log("Spawned: " + a3c);
        }
      }
    }
    Memory.roles.betterHarvesters1 = betterHarvesters1;
    Memory.roles.betterHarvesters2 = betterHarvesters2;

  }
};
modSpawning.maxCreeps = 20;

module.exports = modSpawning;
