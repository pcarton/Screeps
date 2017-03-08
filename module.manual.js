var bodyObj = require('module.bodyTypes');
var modManual ={
  spawn:function(type, tier, roomName){
    var memoryObj = modMemory.getInitalCreepMem(type);

    var obj = {
      description:"Manual-"+type,
      body: null,
      name: undefined,
      memory:memoryObj
    };
    obj.body = bodyObj.getBody(type, tier);
    Memory.rooms[roomName].spawnQ.unshift(obj); //unshift it so it is priority
  }
};
module.exports = modManual;
