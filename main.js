var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var initialRolesMem = {
    "numCreeps":0,
    "numHarvesters":0,
    "numUpgraders":0,
    "numBuilders":0,
    "numRepair":0

};

//variables for the different creeps that auto spawn
var hBody = [WORK, CARRY, CARRY, MOVE, MOVE];
var uBody = [WORK, CARRY, CARRY, CARRY, MOVE];
var bBody = [WORK, CARRY, WORK, MOVE];
var rBody = [WORK, CARRY, MOVE, MOVE, MOVE];

//variables for the number of creeps of each type to auto spawn
var maxHarvesters = 3;
var maxUpgraders = 0;
var maxBuilders = 0;
var maxRepair = 1;

var maxCreeps = 20;


function initialize(){
  Memory.roles = initialRolesMem;
  Memory.initialized = true;
}

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

function getNumRepair(){
  var repair = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
  var rL = repair.length;
  if(Memory.roles.numRepair != rL){
    Memory.roles.numRepair = rL;
    console.log('Repair: ' + rL);
  }
  return rL;
}

//main loop
module.exports.loop = function () {

  var initialized = Memory.initialized;
  if(!initialized){
    initialize();
  }

  //calculates the breakdown of creeps
  var h  = getNumHarvesters();
  var u = getNumUpgraders();
  var b = getNumBuilders();
  var r = getNumRepair();
  Memory.roles.numCreeps = h + u + b + r;

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
      if(creep.memory.role == 'repair'){
        roleRepair.run(creep);
      }
  }

  //determin if new creeps need to be spawned and pick an appropriate spawner
  if(Memory.roles.numCreeps < maxCreeps){
      for(var spawn in Game.spawns){
        var controllerLvlMod = Game.spawns[spawn].room.controller.level - 1;
        if((!Game.spawns[spawn].spawning) && (Game.spawns[spawn].room.energyAvailable>=300)){
            if(Memory.roles.numHarvesters < (maxHarvesters + controllerLvlMod)){
               var hc = Game.spawns[spawn].createCreep(hBody, undefined,{role: 'harvester',selfHarvest:true});
               console.log("Spawned: " + hc);
            }
            else if(Game.spawns[spawn].room.find(FIND_MY_CONSTRUCTION_SITES).length && (Memory.roles.numBuilders < (maxBuilders + controllerLvlMod - 2))){
               var bc = Game.spawns[spawn].createCreep(bBody, undefined,{role: 'builder',selfHarvest:false});
               console.log("Spawned: " + bc);
            }
            else if(Memory.roles.numUpgraders < (maxUpgraders + controllerLvlMod)){
               var uc = Game.spawns[spawn].createCreep(uBody, undefined,{role: 'upgrader', selfHarvest:false});
               console.log("Spawned: " + uc);
            }
            else if(Memory.roles.numRepair< (maxRepair + controllerLvlMod)){
               var rc = Game.spawns[spawn].createCreep(rBody, undefined,{role: 'repair', toFix:'', selfHarvest:true});
               console.log("Spawned: " + rc);
            }
        }
      }
  }

};
