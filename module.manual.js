var modMemory = require("module.memory");
var bodyObj = require('module.bodyTypes');
var modManual ={
  spawn:function(type, tier, roomName, pos){
    var memoryObj = modMemory.getInitalCreepMem(type);
    memoryObj.dest = pos;

    var obj = {
      description:"Manual-"+type,
      body: null,
      role: type,
      name: undefined,
      memory:memoryObj
    };
    obj.body = bodyObj.getBody(type, tier);
    Memory.rooms[roomName].spawnQ.unshift(obj); //unshift it so it is priority
    return "Scheduled";
  }  
};
module.exports = modManual;
