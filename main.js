var roleHarvester = require('role.harvester');
var maxHarvesters = 3;

var maxCreeps = maxHarvesters;

function getNumHarvesters(){
  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  console.log('Harvesters: ' + harvesters.length);

  Memory.roles.numHarvesters = harvesters;
}

module.exports.loop = function () {

  getNumHarvesters();

  for(var name in Game.creeps) {
      var creep = Game.creeps[name];
      if(creep.memory.role == 'harvester') {
          roleHarvester.run(creep);
      }
  }


  if(Memory.numCreeps < maxCreeps){
      console.log("in loop 1");
      for(var spawn in Game.spawns){
          console.log("in loop 2");
        if((!Game.spawns[spawn].spawning) && (Game.spawns[spawn].energy>=200)){
            console.log("in if one");
            if(Memory.roles.numHarvesters < maxHarvesters){
               var c = Game.spawns[spawn].createCreep([WORK, CARRY, MOVE], undefined,{role: 'harvester'});
               console.log(c);
            }
        }
      }
  }
  
}
