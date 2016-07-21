var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

//variables for the different creeps that auto spawn
var hBody = [WORK, CARRY, MOVE];
var uBody = [WORK, CARRY, MOVE];
var bBody = [WORK, CARRY, MOVE];

//variables for the number of creeps of each type to auto spawn
var maxHarvesters = 3;
var maxUpgraders = 2;
var maxBuilders = 2;

var maxCreeps = maxHarvesters + maxUpgraders + maxBuilders;


//Gets the number of living harvester Creeps
function getNumHarvesters(){
  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  var hL = harvesters.length;
  if(Memory.roles.numHarvesters != hL){
    Memory.roles.numHarvesters = hL;
    console.log('Harvesters: ' + hL);
  }
  return hL;
}

//Gets the number of living upgrader Creeps
function getNumUpgraders(){
  var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
  var uL = upgraders.length;
  if(Memory.roles.numUpgraders != uL){
    Memory.roles.numUpgraders = uL;
    console.log('Upgraders: ' + uL);
  }
  return uL;
}

//Gets the number of living builder Creeps
function getNumBuilders(){
  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
  var bL = builders.length;
  if(Memory.roles.numBuilders != bL){
    Memory.roles.numBuilders = bL;
    console.log('Builders: ' + bL);
  }
  return bL;
}

//main loop
module.exports.loop = function () {

  //calculates the breakdown of creeps
  var h  = getNumHarvesters();
  var u = getNumUpgraders();
  var b = getNumBuilders();
  Memory.roles.numCreeps = h + u + b;

  //assign the right run method to each creep
  for(var name in Game.creeps) {
      var creep = Game.creeps[name];
      if(creep.memory.role == 'harvester') {
          roleHarvester.run(creep);
      }
      if(creep.memory.role == 'upgrader') {
          roleUpgrader.run(creep);
      }
      if(creep.memory.role == 'builder'){
        roleBuilder.run(creep);
      }
  }


  //determin if new creeps need to be spawned and pick an appropriate spawner
  if(Memory.roles.numCreeps < maxCreeps){
      for(var spawn in Game.spawns){
        if((!Game.spawns[spawn].spawning) && (Game.spawns[spawn].energy>=200)){
            if(Memory.roles.numHarvesters < maxHarvesters){
               var c = Game.spawns[spawn].createCreep(hBody, undefined,{role: 'harvester'});
               console.log("Spawned: " + c);
            }
            else if(Memory.roles.numUpgraders < maxUpgraders){
               var c = Game.spawns[spawn].createCreep(uBody, undefined,{role: 'upgrader'});
               console.log("Spawned: " + c);
            }
            else if(Memory.roles.numBuilders < maxBuilders){
               var c = Game.spawns[spawn].createCreep(bBody, undefined,{role: 'builder'});
               console.log("Spawned: " + c);
            }
        }
      }
  }

}
