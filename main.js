//Requires for the other roles and modules

//Roles
var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleArchitect = require('role.architect');
var roleFeeder = require('role.feeder');
var roleJuniorHauler = require('role.juniorHauler');

//Modules
var modSpawning = require('module.spawning');
var modCommon = require('module.common');
var modStructures = require('module.structures');


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
    "betterHarvesters2":0,
    "numMiners":0,
    "maxMiners":0,
    "numHaulers":0,
    "maxHaulers":1,
    "numFeeders":0,
    "maxFeeders":1

};

//Tower initial memory JSON
var initialTowerMem = {
  "target":null,
  "mode":"attack",
  "fixe":null
};

//Set all the above JSONs into memeory on first start
function initialize(){
  //TODO make these per room
  Memory.roles = initialRolesMem;
  Memory.towersMem = initialTowerMem;
  Memory.initialized = true;
  Memory.conservation = false;
  Memory.fortify = false;
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

//Gets the number of living architect Creeps
function getNumArchitects(creepList){
  var architects = _.filter(creepList, (creep) => creep.memory.role == 'architect');
  var aL = architects.length;
  if(Memory.roles.numArchitects != aL){
    Memory.roles.numArchitects = aL;
    console.log('Architects: ' + aL);
  }
  return aL;
}

//Gets the number of living miner Creeps
function getNumMiners(creepList){
  var miners = _.filter(creepList, (creep) => creep.memory.role == 'miner');
  var mL = miners.length;
  if(Memory.roles.numMiners != mL){
    Memory.roles.numMiners = mL;
    console.log('Miners: ' + mL);
  }
  return mL;
}

//Gets the number of living hauler Creeps
function getNumHaulers(creepList){
  var haulers = _.filter(creepList, (creep) => creep.memory.role == 'hauler');
  var haulL = haulers.length;
  if(Memory.roles.numHaulers != haulL){
    Memory.roles.numHaulers = haulL;
    console.log('Haulers: ' + haulL);
  }
  return haulL;
}

function getNumFeeders(creepList){
  var feeders = _.filter(creepList, (creep) => creep.memory.role == 'feeder');
  var feedL = feeders.length;
  if(Memory.roles.numFeeders != feedL){
    Memory.roles.numFeeders = feedL;
    console.log('Haulers: ' + feedL);
  }
  return feedL;
}

//main loop
module.exports.loop = function () {

  //Only initialize if it hasnt been done (or it was manually set to false)
  if(Memory.initialized!==true){
    initialize();
  }

  //Loop to check each room that is visible to the script
  for(var roomName in Game.rooms){
    var room = Game.rooms[roomName];

    if(Memory.fortify && (!room.controller.safeMode || room.controller.safeMode<1000)){
      Memory.fortify = false;
    }

    //Creep lists in each room, comparing lengths shows if there are 'others'
    var allCreepList = room.find(FIND_CREEPS);
    var myCreepList = _.filter(allCreepList, (creep) => (creep.owner && creep.owner.username ==="PCarton"));
    var enemyPresent = allCreepList.length>myCreepList.length;

    //Al the structures in the room that are controlled by the player
    var allStructs = room.find(FIND_MY_STRUCTURES);
    var towers = _.filter(allStructs, (struct) => struct.structureType === STRUCTURE_TOWER);

    //calculates the breakdown of creeps by roles
    /* var h  = getNumHarvesters(myCreepList);
    var u = getNumUpgraders(myCreepList);
    var b = getNumBuilders(myCreepList);
    var r = getNumRepair(myCreepList);
    var a = getNumArchitects(myCreepList);
    var m = getNumMiners(myCreepList);
    var ha = getNumHaulers(myCreepList);
    var f = getNumFeeders(myCreepList);
    Memory.roles.numCreeps = h + u + b + r + a + m + ha + f;
    */

    //Clear dead creeps from memory
    modCommon.clearDead();

    //assign the right run method to each creep based on its role
    for(var name in myCreepList) {
        var creep = myCreepList[name];

        //Has the non-military creeps retreat
        //Mining creeps are considered military - like the supply line
        if(!room.controller.safeMode && enemyPresent && creep.memory.military !== true){
          modCommon.retreat(creep);
        }
        //If there are no enemies, run the appropriate role method
        else if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'builder'){
          roleBuilder.run(creep);
        }
        else if(creep.memory.role == 'repair'){
          roleRepair.run(creep);
        }
        else if(creep.memory.role == 'architect'){
          roleArchitect.run(creep);
        }
        else if(creep.memory.role == 'miner'){
          roleMiner.run(creep);
        }
        else if(creep.memory.role == 'hauler'){
          if(creep.pos.findClosestByRange(FIND_STRUCTURES,{
            filter: (structure) => {
              return (structure.structureType === STRUCTURE_STORAGE);
          }})){
            roleHauler.run(creep);
          }else {
            roleJuniorHauler.run(creep);
          }
        }
        else if(creep.memory.role == 'feeder'){
          roleFeeder.run(creep);
        }
    }

    //determine if new creeps need to be spawned and pick an appropriate spawner
    //Spawn logic is in a seperate module
    if(Memory.roles.numCreeps < modSpawning.maxCreeps){
        for(var spawn in Game.spawns){
          var spawner = Game.spawns[spawn];
          var controllerLvl= spawner.room.controller.level;
          var energyCapacity = spawner.room.energyCapacityAvailable;
          modSpawning.spawn(spawner,energyCapacity,controllerLvl);

        }
    }

    var control = room.controller;

    if(enemyPresent && modCommon.playerAttack(allCreepList) && !(control.safeMode || control.safeModeCooldown) && control.safeModeAvailable > 0 ){
      control.activateSafeMode();
      Memory.fortify = true;
      Game.notify("Activated Safe Mode at " + Game.time.toString);
    }

    //Variable to keep track of which enemy to shoot
    var target = Game.getObjectById(Memory.towersMem.target);


    //Notify the user on enemies or switch to healing and repairing
    if(enemyPresent){
      Memory.towersMem.mode = "attack";
      Game.notify("EnemyFound at "+ Game.time.toString(),600);
    }else{
      Memory.towersMem.mode = "heal";
    }

    //Run through the towers, picking a target if needed
    for(var towerName in towers){
      var t = towers[towerName];
      if(enemyPresent && (target===null || target.room !== t.room)){
        modStructures.pickTargets(t.room.controller, allCreepList);
      }
      modStructures.runTower(t,allCreepList);
    }
  }
};
