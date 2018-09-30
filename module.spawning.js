var modSpawning = {

    tierOneGenericBody = [],

    enqueueGeneric(roomName, tier){
      if(!tier){
        tier = this.calcTier(roomName);
      }
        
      var genericCreep = {
        description:"Generic Creep",
        body: null,
        name: undefined,
        memory:{
            job: null,
        }
      };
      harvesterObj.body = bodyObj.getBody('harvester',tier);
      //Using unshift() to add to front, basic priority
      //Only use this for miners/harvesters
      Memory.rooms[roomName].spawnQ.unshift(harvesterObj);
      modUtil.incrementCreepNum("harvester",roomName);
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