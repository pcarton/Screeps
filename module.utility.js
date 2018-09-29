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
var roleSettler = require('role.settler');

var modUtil = {
  runCreep: function(creep){
    var job = creep.memory.job;
    if(job){
      if(creep.pos - job.target.pos <= 1){
        job.action(creep, target)
      }else{
        creep.moveTo(target)
      }
    }
   
  },

  //Decrementes the number of that creep in the memory storage
  decrementCreepNum:function(creepType,roomName){
    if(!roomName){
      return;
    }
    if(creepType==="harvester"){
      Memory.rooms[roomName].roles.numHarvesters--;
    }else if(creepType === "upgrader"){
      Memory.rooms[roomName].roles.numUpgraders--;
    }else if(creepType === "builder"){
      Memory.rooms[roomName].roles.numBuilders--;
    }else if(creepType === "repair"){
      Memory.rooms[roomName].roles.numRepair--;
    }else if (creepType === "architect"){
      Memory.rooms[roomName].roles.numArchitects--;
    }else if(creepType === "miner"){
      Memory.rooms[roomName].roles.numMiners--;
    }else if(creepType === "hauler"){
      Memory.rooms[roomName].roles.numHaulers--;
    }else if(creepType === "feeder"){
      Memory.rooms[roomName].roles.numFeeders--;
    }else if(creepType === "geo"){
      Memory.rooms[roomName].roles.numGeo--;
    }else if(creepType === "geoH"){
      Memory.rooms[roomName].roles.numGeoH--;
    }else if(creepType === "merchant"){
      Memory.rooms[roomName].roles.numMerchant--;
    }
    Memory.rooms[roomName].roles.numCreeps--;
    //console.log(roomName+": Removed a "+creepType+" from count memory");
  },

  //Incrementes the number of that creep in the memory storage
  incrementCreepNum:function(creepType,roomName){
    if(!roomName){
      return;
    }
    if(creepType==="harvester"){
      Memory.rooms[roomName].roles.numHarvesters++;
    }else if(creepType === "upgrader"){
      Memory.rooms[roomName].roles.numUpgraders++;
    }else if(creepType === "builder"){
      Memory.rooms[roomName].roles.numBuilders++;
    }else if(creepType === "repair"){
      Memory.rooms[roomName].roles.numRepair++;
    }else if (creepType === "architect"){
      Memory.rooms[roomName].roles.numArchitects++;
    }else if(creepType === "miner"){
      Memory.rooms[roomName].roles.numMiners++;
    }else if(creepType === "hauler"){
      Memory.rooms[roomName].roles.numHaulers++;
    }else if(creepType === "feeder"){
      Memory.rooms[roomName].roles.numFeeders++;
    }else if(creepType === "geo"){
      Memory.rooms[roomName].roles.numGeo++;
    }else if(creepType === "geoH"){
      Memory.rooms[roomName].roles.numGeoH++;
    }else if(creepType === "merchant"){
      Memory.rooms[roomName].roles.numMerchant++;
    }
    Memory.rooms[roomName].roles.numCreeps++;
    //console.log(roomName+": Added a "+creepType+" to count memory");
  },


};

module.exports = modUtil;
