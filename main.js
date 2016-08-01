var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleArchitect = require('role.architect');
var modSpawning = require('module.spawning');
var modCommon = require('module.common');

var initialRolesMem = {
    "numCreeps":0,
    "numHarvesters":0,
    "maxHarvesters":1,
    "numUpgraders":0,
    "maxUpgraders":0,
    "numBuilders":0,
    "maxBuilders":1,
    "numRepair":0,
    "maxRepair":1,
    "numArchitects":0,
    "betterHarvesters1":0,
    "betterHarvesters2":0

};

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

//Gets the number of living harvester Creeps
function getNumArchitects(){
  var architects = _.filter(Game.creeps, (creep) => creep.memory.role == 'architect');
  var aL = architects.length;
  if(Memory.roles.numArchitects != aL){
    Memory.roles.numArchitects = aL;
    console.log('Architects: ' + aL);
  }
  return aL;
}

//main loop
module.exports.loop = function () {

  if(Memory.initialized!==true){
    initialize();
  }

  //calculates the breakdown of creeps
  var h  = getNumHarvesters();
  var u = getNumUpgraders();
  var b = getNumBuilders();
  var r = getNumRepair();
  var a = getNumArchitects();
  Memory.roles.numCreeps = h + u + b + r + a;

  //Clear dead creeps from memory
  modCommon.clearDead();

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
      if(creep.memory.role == 'architect'){
        roleArchitect.run(creep);
      }
  }

  //determin if new creeps need to be spawned and pick an appropriate spawner
  if(Memory.roles.numCreeps < modSpawning.maxCreeps){
      for(var spawn in Game.spawns){
        var spawner = Game.spawns[spawn];
        var controllerLvl= spawner.room.controller.level;
        var energyCapacity = spawner.room.energyCapacityAvailable;
        modSpawning.spawn(spawner,energyCapacity,controllerLvl);

      }
  }

};
