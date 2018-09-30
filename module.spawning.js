var memoryModule = require('module.memory');

var modSpawning = {

    tierOneGenericBody: [WORK,MOVE,MOVE,CARRY,CARRY],

    enqueueGeneric(roomName, tier){
      var genericCreep = {
        description: "Generic Creep",
        body: this.tierOneGenericBody,
        name: undefined,
        memory: {
            job: null,
        }
      };
      memoryModule.enqueueCreep(roomName,genericCreep);
    },
  
    //dequeue and spawn
    spawn:function(roomName){
      var queue = memoryModule.getSpawnQueue(roomName);
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
          }
        }
      }
    }
  };

module.exports = modSpawning;