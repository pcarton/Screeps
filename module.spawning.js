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

var modSpawning = {
  spawn:function(spawner,energyCapacity,controllerLvl){
    var betterHarvesters1 = Memory.roles.betterHarvesters1; // number of tier2 harvesters spawned, to track shift
    var controllerLvlMod = controllerLvl - 1;  //modifier to the max amount of each creep
    var notEnoughHarvest = (Memory.roles.numHarvesters < (this.maxHarvesters + controllerLvlMod));  //if there are enough harvesters, to stop other higher tier spawns
    var spawnTier1 = (betterHarvesters1<1 &&energyCapacity<550 || (spawner.room.energyAvailable<550 && notEnoughHarvest)); //boolean for tier 1 spawning
    var spawnTier2 = (energyCapacity<800 || (spawner.room.energyAvailable<800 && notEnoughHarvest));  //boolean for tier2 spawning
    if(spawnTier1){
        //make sure there is energy and the spawner isnt already working, then spawn harvesters, upgrader, and repair in that priority
        if((!spawner.spawning) && (spawner.room.energyAvailable>=300)){
            if(Memory.roles.numHarvesters < (this.maxHarvesters)){
               var hc = spawner.createCreep(hBody, undefined,{role: 'harvester',selfHarvest:true});
               console.log("Spawned: " + hc);
            }
            else if(Memory.roles.numUpgraders < (this.maxUpgraders + controllerLvlMod)){
               var uc = spawner.createCreep(uBody, undefined,{role: 'upgrader', selfHarvest:false});
               console.log("Spawned: " + uc);
            }
            else if(Memory.roles.numRepair< (this.maxRepair)){
               var rc = spawner.createCreep(rBody, undefined,{role: 'repair', toFix:'', selfHarvest:true});
               console.log("Spawned: " + rc);
            }
        }
    }else if(spawnTier2){
      //make sure there is energy and the spawner isnt already working, then spawn harvesters, builders, upgrader, and repair in that priority
      var moveOn = (betterHarvesters1>=(this.maxHarvesters));
      if((!spawner.spawning) && (spawner.room.energyAvailable>=550)){
          if(Memory.roles.numHarvesters < (this.maxHarvester)){
             var h2c = spawner.createCreep(h2Body, undefined,{role: 'harvester',selfHarvest:true});
             console.log("Spawned: " + h2c);
             betterHarvesters1++;
          }
          else if(moveOn && spawner.room.find(FIND_MY_CONSTRUCTION_SITES).length && (Memory.roles.numBuilders < (this.maxBuilders))){
             var b2c = spawner.createCreep(b2Body, undefined,{role: 'builder',selfHarvest:false});
             console.log("Spawned: " + b2c);
          }
          else if(moveOn && Memory.roles.numUpgraders < (this.maxUpgraders + controllerLvlMod)){
             var u2c = spawner.createCreep(u2Body, undefined,{role: 'upgrader', selfHarvest:false});
             console.log("Spawned: " + u2c);
          }
          else if(moveOn && Memory.roles.numRepair< (this.maxRepair)){
             var r2c = spawner.createCreep(r2Body, undefined,{role: 'repair', toFix:'', selfHarvest:true});
             console.log("Spawned: " + r2c);
          }
      }
    }
    Memory.roles.betterHarvesters1 = betterHarvesters1;

  }
};
//variables for the number of creeps of each type to auto spawn
modSpawning.maxHarvesters = 3;
modSpawning.maxUpgraders = 0;
modSpawning.maxBuilders = 1;
modSpawning.maxRepair = 1;

modSpawning.maxCreeps = 20;

module.exports = modSpawning;
