var modMemory = {

  init:function(){
    Memory.rooms = {};
    for(var roomName in Game.rooms){
      this.initRoom(roomName);
    }
    Memory.initialized = true;
  },
  initRoom:function(roomName){
    Memory.rooms[roomName] = {
      roles: {
          numCreeps:0,
          numHarvesters:0,
          maxHarvesters:1,
          numUpgraders:0,
          maxUpgraders:1,
          maxUpgradersTier:8,
          numBuilders:0,
          maxBuilders:1,
          numRepair:0,
          maxRepair:1,
          numArchitects:0,
          betterHarvesters1:0,
          betterHarvesters2:0,
          numMiners:0,
          maxMiners:1,
          numHaulers:0,
          maxHaulers:1,
          numFeeders:0,
          maxFeeders:2,
          numGeo:0,
          maxGeo:1,
          numGeoH:0,
          maxGeoH:0,
          numMerchant:0,
          maxMerchant:0,
        },
      spawnQ:[],
      conservation: false,
      fortify: false,
      towers:{},
      links:{},
      sourceIDs:[],
      signMsg:"",
      //TODO extend the creep prototype and add signing based on this memory value
      //http://support.screeps.com/hc/en-us/articles/203013212-Creep#signController
      initialized:false, //Set to true when init is run

    };
    //TODO any other things go here (like Tower init)
    Memory.rooms[roomName].roomBorders = this.getBorders(roomName);
    Memory.rooms[roomName].initialized = true;
  },
  initTower:function(tower){
    var roomName = tower.room.name;
    var towerID = tower.id;
    Memory.rooms[roomName].towers[tower.id]={
      target:null,
      mode:"attack"
    };
  },
  initLink:function(link){
    var roomName = link.room.name;
    var linkID = link.id;
    Memory.rooms[roomName].links[link.id]={};
    isFlagged = _.filter(link.room.lookAt(link.pos),(obj) => obj.type == LOOK_FLAGS && obj[LOOK_FLAGS].name == "Load").length >0;
    if(isFlagged){
      Memory.rooms[roomName].links[link.id].load = true;
    }else{
      Memory.rooms[roomName].links[link.id].load = false;
    }
  },
  getSpawnQ:function(roomName){
    return Memory.rooms[roomName].spawnQ;
  },
  changeCreepNum:function(roomName,creepType,num,set){}, //creepType - creepJob to change, num, num to add or set to, set - bool, true to set, false to add
  getInitalCreepMem:function(creepType){
    var memoryObj ={
      role:"none",
      path:null,
      dest:null,
      assist:"", //set to roomName of assisted room
      room:"",
    };
    if(creepType === "harvester"){
      memoryObj.role = 'harvester';
      memoryObj.selfHarvest = true;
      memoryObj.source = "";
      memoryObj.military = true;
    }
    else if(creepType === "upgrader"){
      memoryObj.role = 'upgrader';
      memoryObj.selfHarvest = true;
    }
    else if(creepType === "builder"){
      memoryObj.role = 'builder';
      memoryObj.selfHarvest = 'false';
    }
    else if(creepType === "repair"){
      memoryObj.role = 'repair';
      memoryObj.selfHarvest = true;
      memoryObj.toFix = '';
      memoryObj.military = true;
    }
    else if(creepType === "architect"){
      memoryObj.role = 'architect';
      memoryObj.selfHarvest = false;
    }
    else if(creepType === "miner"){
      memoryObj.role = 'miner';
      memoryObj.dropOff = "";
      memoryObj.source = "";
      memoryObj.military = true;
    }
    else if(creepType === "hauler"){
      memoryObj.role = 'hauler';
      memoryObj.dropOff = "";
      memoryObj.military = true;
    }
    else if(creepType === "feeder"){
      memoryObj.role = 'feeder';
      memoryObj.military = true;
    }
    else if(creepType === "geo"){
      memoryObj.role = 'geo';
      memoryObj.mineral = "";
      memoryObj.dropOff = "";
    }
    else if(creepType === "merchant"){
      memoryObj.role = 'merchant';
      memoryObj.terminal = "";
      memoryObj.storage = "";
      var toLoad = {};
      toLoad.amount = 0;
      toLoad.resource = RESOURCE_ENERGY;
      memoryObj.toLoad = toLoad;
    }
    else if(creepType === "settler"){
      memoryObj.role = 'settler';
    }

    return memoryObj;
  },
  getBorders:function(roomName){
    roomBorders = [];
    for(i = 0; i<50; i++){
      for(j = 0; j<50; j++){
        if(i===0 || i===49 || j===0 || j===49){
          roomBorders.push(new RoomPosition(i,j,roomName));
        }
      }
    }
    return roomBorders;
  }
};

module.exports = modMemory;
