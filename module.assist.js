//TODO room assist module: have one room send creeps to work in a new
//room and recycle themselves at end of life to jump start the room
var modConstants = require('module.constants');
var modCommon = require('module.common');

var modAssist = {

  run:function(creep){
    if(creep.ticksToLive <= modConstants.nearDeath){
      //TODO near death, recycle
    }else if(creep.memory.roomName === creep.room.name){
      //TODO in right room
    }else{
      modCommon.runCreep(creep);
    }

  }

};

module.exports = modAssist;
