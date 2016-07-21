var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

var hBody = [WORK, CARRY, MOVE];
var uBody = [WORK, CARRY, MOVE, TOUGH];

var maxHarvesters = 3;
var maxUpgraders = 2;

var maxCreeps = maxHarvesters + maxUpgraders;

function getNumHarvesters(){
  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  var hL = harvesters.length;
  if(Memory.roles.numHarvesters != hL){
    Memory.roles.numHarvesters = hL;
    console.log('Harvesters: ' + hL);
  }
  return hL;
}

function getNumUpgraders(){
  var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
  var uL = upgraders.length;
  if(Memory.roles.numUpgraders != uL){
    Memory.roles.numUpgraders = uL;
    console.log('Upgraders: ' + uL);
  }
  return uL;
}

module.exports.loop = function () {

  var h  = getNumHarvesters();
  var u = getNumUpgraders();
  Memory.roles.numCreeps = h + u;

  for(var name in Game.creeps) {
      var creep = Game.creeps[name];
      if(creep.memory.role == 'harvester') {
          roleHarvester.run(creep);
      }
      if(creep.memory.role == 'upgrader') {
          roleUpgrader.run(creep);
      }
  }


  if(Memory.roles.numCreeps < maxCreeps){
      for(var spawn in Game.spawns){
        if((!Game.spawns[spawn].spawning) && (Game.spawns[spawn].energy>=200)){
            if(Memory.roles.numHarvesters < maxHarvesters){
               var c = Game.spawns[spawn].createCreep(hBody, undefined,{role: 'harvester'});
               console.log("Spawned: " + c);
            }
            if(Memory.roles.numUpgraders < maxUpgraders){
               var c = Game.spawns[spawn].createCreep(uBody, undefined,{role: 'upgrader'});
               console.log("Spawned: " + c);
            }
        }
      }
  }

}
