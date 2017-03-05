//TODO have easy memory access and structure here

var defaultCreep = {
  role:"none",
  path:null,
  dest:null,
};
var defaultRoom = {
  roles: {
      numCreeps:0,
      numHarvesters:0,
      maxHarvesters:1,
      numUpgraders:0,
      maxUpgraders:0,
      numBuilders:0,
      maxBuilders:1,
      numRepair:0,
      maxRepair:1,
      numArchitects:0,
      betterHarvesters1:0,
      betterHarvesters2:0,
      numMiners:0,
      maxMiners:0,
      numHaulers:0,
      maxHaulers:1,
      numFeeders:0,
      maxFeeders:1,
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
  towers:[],
  sourceIDs:[],
  initialized:false, //Set to true when init is run

};
var defaultTower = {
  target:null,
  mode:"attack"
};

var modMemory = {

  init:function(){
    for(var roomName in Game.rooms){
      this.initRoom(roomName);
    }
    Memory.initialized = true;
  },
  initRoom:function(roomName){
    Memory.rooms[roomName] = defaultRoom;
    //TODO any other things go here (like Tower init)
    Memory.rooms[roomName].initialized = true;
  },
  initCreep:function(creep, creepType){}, //TODO init creep with data currently down in modSpawning
  initTower:function(tower){
    var roomName = tower.room.name;
    var towerID = tower.id;
    Memory.rooms[roomName].towers[tower.id] = defaultTower;
  },
  getSpawnQ:function(roomName){
    return Memory.rooms[roomName].spawnQ;
  },
  changeCreepNum:function(roomName,creepType,num,set){}, //creepType - creepJob to change, num, num to add or set to, set - bool, true to set, false to add

};

module.exports = modMemory;
