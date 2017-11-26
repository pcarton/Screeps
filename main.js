//Modules
var modSpawning = require('module.spawning');
var modCommon = require('module.common');
var modUtil = require('module.utility');
var modStructures = require('module.structures');
var modMemory = require('module.memory');
var modAssist = require('module.assist');
var modConstants = require('module.constants');


//Function to remove 'dead' creeps from the memory to conserve space
function clearDead(){
  for(var i in Memory.creeps) {
    if(!Game.creeps[i]) {
      var job = Memory.creeps[i].role;
      var roomName = Memory.creeps[i].room;
      if(roomName){
        modUtil.decrementCreepNum(job,roomName);
        modSpawning.enqueuByJob(job,roomName,false);
      }
      delete Memory.creeps[i];
      console.log("Removed creep "+i+" (a "+job+") from memory");
    }
  }
}

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
    var allConstruct = room.find(FIND_MY_CONSTRUCTION_SITES);
    var towers = _.filter(allStructs, (struct) => struct.structureType === STRUCTURE_TOWER);
    var links = _.filter(allStructs, (struct) => struct.structureType === STRUCTURE_LINK);

    if(allStructs.length <=0 && allConstruct.length<=0){
      //Find the nearest room to this new one and spawn an assist builder and upgrader test
      var dist = -1;
      var otherRoom = null;
      for(var roomNameClose in Game.rooms){
        if(roomNameClose !== roomName){
          var tempDist = Game.map.getResourceType(roomName, roomNameClose);
          if(dist === -1 || tempDist < dist){
            dist = tempDist;
            otherRoom = roomNameClose;
          }
        }
      }
      if(otherRoom !== null){
        modSpawning.enqueueAssist(otherRoom, 'builder', roomName);
        modSpawning.enqueueAssist(otherRoom, 'upgrader', roomName);
      }
    }

    for(var tower in towers){
      if(!Memory.rooms[roomName].towers[tower.id]){
        modMemory.initTower(towers[tower]);
      }
    }

    for(var link in links){
      if(!Memory.rooms[roomName].links[link.id]){
        modMemory.initLink(links[link]);
      }
    }


    //Clear dead creeps from memory
    clearDead();

    //assign the right run method to each creep based on its role
    for(var name in myCreepList) {
        var creep = myCreepList[name];

        //Has the non-military creeps retreat
        //Mining creeps are considered military - like the supply line
        if(!room.controller.safeMode && enemyPresent && creep.memory.military !== true){
          modCommon.retreat(creep);
        }
        if(creep.ticksToLive == 1){
          creep.say("Goodbye, cruel world!",false);
        }
        //if the creep is to assist
        else if(creep.memory.assist){
          modAssist.run(creep);
        }
        //If there are no enemies, run the appropriate role method
        else{
          modUtil.runCreep(creep);
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
    var enemy = modCommon.playerAttack(allCreepList);

    if(enemyPresent && enemy){
      if((!control.safeMode && !control.safeModeCooldown) &&  (control.safeModeAvailable > 0 )){
        control.activateSafeMode();
        Game.notify(modCommon.linkRoomAtTick(room,Game.time,"Activated Safe Mode(Player Attack by:"+enemy+")"),0);
      }else{
        Game.notify(modCommon.linkRoomAtTick(room,Game.time,"Player Attack by:"+enemy),0);
      }
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
          modStructures.pickTargets(Game.getObjectById(towerId), allCreepList);
        }
      }else{ //TODO check for injured creeps and set to heal, maybe room variable that triggers on hit
        Memory.rooms[roomName].towers[towerId].mode = "repair";
      }
      modStructures.runTower(towerObj,allCreepList);
    }

    for(var linkID in Memory.rooms[roomName].links){
      var linkMemObj = Memory.rooms[roomName].links[linkID];
      var linkObj = Game.getObjectById(linkID);
      if(linkMemObj.load && linkObj.energy == linkObj.energyCapacity){
        var notLoads = _.filter(links, (obj) => obj.id != linkID && obj.energy <=200 );
        if(notLoads.length && linkObj.cooldown === 0){
          linkObj.transferEnergy(notLoads[0]);
        }
      }
    }

    if(enemyPresent && newEnemy)
      Game.notify(modCommon.linkRoomAtTick(room, Game.time, "EnemyFound"),60);
  }
};
