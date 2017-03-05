//Requires for the other roles and modules

//Roles
var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleGeoMiner = require('role.geoMiner');
var roleGeoHauler = require('role.geoHauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleArchitect = require('role.architect');
var roleFeeder = require('role.feeder');
var roleMerchant = require('role.merchant');
var roleJuniorHauler = require('role.juniorHauler');

//Modules
var modSpawning = require('module.spawning');
var modCommon = require('module.common');
var modStructures = require('module.structures');
var modMemory = require('module.memory');

//main loop
module.exports.loop = function () {

  //Only initialize if it hasnt been done (or it was manually set to false)
  if(Memory.initialized!==true){
    modMemory.init();
  }

  //Loop to check each room that is visible to the script
  for(var roomName in Memory.rooms){
    var room = Game.rooms[roomName];

    //Creep lists in each room, comparing lengths shows if there are 'others'
    var allCreepList = room.find(FIND_CREEPS);
    var myCreepList = _.filter(allCreepList, (creep) => (creep.owner && creep.owner.username ==="PCarton"));
    var enemyPresent = allCreepList.length>myCreepList.length;

    //Al the structures in the room that are controlled by the player
    var allStructs = room.find(FIND_MY_STRUCTURES);
    var towers = _.filter(allStructs, (struct) => struct.structureType === STRUCTURE_TOWER);

    if(allStructs.lenth <=0){
      //TODO add builders/upgraders to spawn queue in nearest controlled room
    }

    for(var tower in towers){
      if(Memory.rooms[roomName].towers[tower.id] === null){
        modMemory.initTower(tower);
      }
    }

    //Clear dead creeps from memory
    modCommon.clearDead();

    //assign the right run method to each creep based on its role
    for(var name in myCreepList) {
        var creep = myCreepList[name];

        //Has the non-military creeps retreat
        //Mining creeps are considered military - like the supply line
        if(!room.controller.safeMode && enemyPresent && creep.memory.military !== true){
          modCommon.retreat(creep);
          //TODO make Memory role count not get overwritten
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
          if(creep.room.storage){
            roleHauler.run(creep);
          }else {
            roleJuniorHauler.run(creep);
          }
        }
        else if(creep.memory.role == 'feeder'){
          roleFeeder.run(creep);
        }
        else if(creep.memory.role == 'geo'){
          roleGeoMiner.run(creep);
        }
        else if(creep.memory.role == 'geoH'){
          roleGeoHauler.run(creep);
        }
        else if(creep.memory.role == 'merchant'){
          roleMerchant.run(creep);
        }
    }

    //determine if new creeps need to be spawned and pick an appropriate spawner
    //Spawn logic is in a seperate module
    if(Memory.rooms[roomName].roles.numCreeps < modSpawning.maxCreeps){
      if(Game.time%modConstants.spawnFrequency===0)
        modSpawning.enqueueAllNeeded(roomName);
      modSpawning.spawn(roomName);
    }

    var control = room.controller;

    if(enemyPresent && modCommon.playerAttack(allCreepList) && !(control.safeMode || control.safeModeCooldown) && control.safeModeAvailable > 0 ){
      control.activateSafeMode();
      Game.notify(modCommon.linkRoomAtTick(room,Game.time,"Activated Safe Mode"),0);
    }

    var newEnemy = true;



    for(var towerId in Memory.rooms[roomName].towers){
      if(Memory.rooms[roomName].towers[towerId].mode === "attack")
        newEnemy = false;
      var towerObj = Game.getObjectById(towerId);
      if(enemyPresent){
        Memory.rooms[roomName].towers[towerId].mode = "attack";
        var targetID =   Memory.rooms[roomName].towers[towerId].target;
        var target = null;
        try{
          target = Game.getObjectById(targetID);
        }catch(err){
          console.log(err.name + "\n" + err.message);
        }
        if(!target){
          modStructures.pickTargets(room.controller, allCreepList);
        }
      }else{ //TODO check for injured creeps and set to heal
        Memory.rooms[roomName].towers[towerId].mode = "repair";
      }
      modStructures.runTower(towerObj,allCreepList);
    }

    if(enemyPresent && newEnemy)
      Game.notify(modCommon.linkRoomAtTick(room, Game.time, "EnemyFound"),60);
  }
};
