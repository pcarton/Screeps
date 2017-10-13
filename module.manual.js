var modMemory = require("module.memory");
var bodyObj = require('module.bodyTypes');
var modUtil = require('module.utility');
var modManual ={
  spawn:function(type, tier, roomName, pos){
    var memoryObj = modMemory.getInitalCreepMem(type);
    memoryObj.manualDest = pos;
    memoryObj.room = roomName;

    var obj = {
      description:"Manual-"+type,
      body: null,
      role: type,
      name: undefined,
      memory:memoryObj
    };
    obj.body = bodyObj.getBody(type, tier);
    Memory.rooms[roomName].spawnQ.unshift(obj); //unshift it so it is priority
    modUtil.incrementCreepNum(type,roomName);
    return "Scheduled";
  },
  recountCreeps:function(roomName){
    var roles = Memory.rooms[roomName].roles;
    var gameCreeps = _.filter(Game.creeps, (creep) => creep.room.name == roomName);
    var spawnQ = Memory.rooms[roomName].spawnQ;

    roles.numCreeps = gameCreeps.length + spawnQ.length;
    roles.numHarvesters = 0;
    roles.numUpgraders =0;
    roles.numBuilders = 0;
    roles.numRepair = 0;
    roles.numArchitects = 0;
    roles.numMiners = 0;
    roles.numHaulers = 0;
    roles.numFeeders = 0;
    roles.numGeo = 0;
    roles.numGeoH = 0;
    roles.numMerchant = 0;

    for(var c in gameCreeps){
      var creep = gameCreeps[c];
      if(creep.room.name == roomName){
        if(creep.memory.role == 'harvester') {
          roles.numHarvesters++;
        }else if(creep.memory.role == 'upgrader') {
          roles.numUpgraders++;
        }else if(creep.memory.role == 'builder'){
          roles.numBuilders++;
        }else if(creep.memory.role == 'repair'){
          roles.numRepair++;
        }else if(creep.memory.role == 'architect'){
          roles.numArchitects++;
        }else if(creep.memory.role == 'miner'){
          roles.numMiners++;
        }else if(creep.memory.role == 'hauler'){
          roles.numHaulers++;
        }else if(creep.memory.role == 'feeder'){
          roles.numFeeders++;
        }else if(creep.memory.role == 'geo'){
          roles.numGeo++;
        }else if(creep.memory.role == 'geoH'){
          roles.numGeoH++;
        }else if(creep.memory.role == 'merchant'){
          roles.numMerchant++;
        }
      }
    }

    for(var s in spawnQ){
      var spawnee = spawnQ[s];
      if(spawnee.memory.role == 'harvester') {
        roles.numHarvesters++;
      }else if(spawnee.memory.role == 'upgrader') {
        roles.numUpgraders++;
      }else if(spawnee.memory.role == 'builder'){
        roles.numBuilders++;
      }else if(spawnee.memory.role == 'repair'){
        roles.numRepair++;
      }else if(spawnee.memory.role == 'architect'){
        roles.numArchitects++;
      }else if(spawnee.memory.role == 'miner'){
        roles.numMiners++;
      }else if(spawnee.memory.role == 'hauler'){
        roles.numHaulers++;
      }else if(spawnee.memory.role == 'feeder'){
        roles.numFeeders++;
      }else if(spawnee.memory.role == 'geo'){
        roles.numGeo++;
      }else if(spawnee.memory.role == 'geoH'){
        roles.numGeoH++;
      }else if(spawnee.memory.role == 'merchant'){
        roles.numMerchant++;
      }
    }

  },

  clearQueue:function(roomName){
    var roles = Memory.rooms[roomName].roles;
    var spawnQ = Memory.rooms[roomName].spawnQ;

    for(var s in spawnQ){
      var spawnee = spawnQ[s];
      if(spawnee.memory.role == 'harvester') {
        roles.numHarvesters--;
      }else if(spawnee.memory.role == 'upgrader') {
        roles.numUpgraders--;
      }else if(spawnee.memory.role == 'builder'){
        roles.numBuilders--;
      }else if(spawnee.memory.role == 'repair'){
        roles.numRepair--;
      }else if(spawnee.memory.role == 'architect'){
        roles.numArchitects--;
      }else if(spawnee.memory.role == 'miner'){
        roles.numMiners--;
      }else if(spawnee.memory.role == 'hauler'){
        roles.numHaulers--;
      }else if(spawnee.memory.role == 'feeder'){
        roles.numFeeders--;
      }else if(spawnee.memory.role == 'geo'){
        roles.numGeo--;
      }else if(spawnee.memory.role == 'geoH'){
        roles.numGeoH--;
      }else if(spawnee.memory.role == 'merchant'){
        roles.numMerchant--;
      }
      roles.numCreeps--;
    }

    Memory.rooms[roomName].spawnQ = [];
  }
};
module.exports = modManual;
