//Requires for the other roles and modules
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleArchitect = require('role.architect');
var modSpawning = require('module.spawning');
var modCommon = require('module.common');
var modStructures = require('module.structures');

//TODO have a find() of ALL creeps and use that in filters instead of
//creepList so enemy creeps can be passed to towers
//remember to make multiple rooms still work

//Initial memory JSON for the roles
//includes counters for roles and maxes
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

//Tower initial Memory
var initialTowerMem = {
  "target":null,
  "mode":"attack"
};

//Set all the above JSONs into memeory on first start
function initialize(){
  Memory.roles = initialRolesMem;
  Memory.tower = initialTowerMem;
  Memory.initialized = true;
}

//Gets the number of living harvester Creeps
function getNumHarvesters(creepList){
  var harvesters = _.filter(creepList, (creep) => creep.memory.role == 'harvester');
  var hL = harvesters.length;
  if(Memory.roles.numHarvesters != hL){
    Memory.roles.numHarvesters = hL;
    console.log('Harvesters: ' + hL);
  }
  return hL;
}

//Gets the number of living upgrader Creeps
function getNumUpgraders(creepList){
  var upgraders = _.filter(creepList, (creep) => creep.memory.role == 'upgrader');
  var uL = upgraders.length;
  if(Memory.roles.numUpgraders != uL){
    Memory.roles.numUpgraders = uL;
    console.log('Upgraders: ' + uL);
  }
  return uL;
}

//Gets the number of living builder Creeps
function getNumBuilders(creepList){
  var builders = _.filter(creepList, (creep) => creep.memory.role == 'builder');
  var bL = builders.length;
  if(Memory.roles.numBuilders != bL){
    Memory.roles.numBuilders = bL;
    console.log('Builders: ' + bL);
  }
  return bL;
}

//Gets the number of living Repair Creeps
function getNumRepair(creepList){
  var repair = _.filter(creepList, (creep) => creep.memory.role == 'repair');
  var rL = repair.length;
  if(Memory.roles.numRepair != rL){
    Memory.roles.numRepair = rL;
    console.log('Repair: ' + rL);
  }
  return rL;
}

//Gets the number of living harvester Creeps
function getNumArchitects(creepList){
  var architects = _.filter(creepList, (creep) => creep.memory.role == 'architect');
  var aL = architects.length;
  if(Memory.roles.numArchitects != aL){
    Memory.roles.numArchitects = aL;
    console.log('Architects: ' + aL);
  }
  return aL;
}

//main loop
module.exports.loop = function () {

  //Only initialize if it hasnt been done (or it was manually set to false)
  if(Memory.initialized!==true){
    initialize();
  }

  for(var roomName in Game.rooms){
    var room = Game.rooms[roomName];
    var allCreepList = room.find(FIND_CREEPS);
    var myCreepList = _.filter(allCreepList, (creep) => (creep.owner && creep.owner.username ==="PCarton"));
    var allStructs = room.find(FIND_MY_STRUCTURES);
    var towers = _.filter(allStructs, (struct) => struct.structureType === STRUCTURE_TOWER);

    //calculates the breakdown of creeps
    var h  = getNumHarvesters(myCreepList);
    var u = getNumUpgraders(myCreepList);
    var b = getNumBuilders(myCreepList);
    var r = getNumRepair(myCreepList);
    var a = getNumArchitects(myCreepList);
    Memory.roles.numCreeps = h + u + b + r + a;

    //Clear dead creeps from memory
    modCommon.clearDead();

    //assign the right run method to each creep
    for(var name in myCreepList) {
        var creep = myCreepList[name];
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

    //TODO action loop for towers, similar to creeps above

    var target = Game.getObjectById(Memory.tower.target);

    for(var towerName in towers){
      if(target===null || target.room !== t.room){
        modStructures.pickTargets(allCreepList);
      }
      var t = towers[towerName];
      modStructures.runTower(t);
    }
  }
};
