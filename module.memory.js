//TODO have easy memory access and structure here

var defaultCreep = {};
var defaultRoom = {};
var defaultTower = {};

var modMemory = {

  init:function(){}, //TODO init whole structure with global info
  initRoom:function(roomName){}, //TODO init room with all room info
  initCreep:function(creep, creepType){}, //TODO init creep with data currently down in modSpawning
  initTower:function(tower){} //TODO init tower with individual aspects (currently global)

};

module.exports = modMemory;
