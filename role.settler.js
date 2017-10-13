var modCommon = require('module.common');
var roleSettler = {

  run: function(creep){
    var goto = new RoomPosition(creep.memory.manualDest.x,creep.memory.manualDest.y,creep.memory.manualDest.roomName);
    //If not in the right room yet
    if(goto && creep.pos != goto){
      modCommon.move(creep,goto);
    }else if(goto){ //if at the rally
      goto = null;
    }else{ //if in right room and arrived at rally
      var controller = creep.room.controller;
      var success = creep.claimController(controller);
      if(success === ERR_NOT_IN_RANGE){
        modCommon.move(creep, controller.pos);
      }else if(success === OK){
        creep.memory.role = upgrader;
        creep.memory.selfHarvest = true;
      }else{
        creep.suicide(); //TODO think of something better to do
      }
    }
  }
};

module.exports = roleSettler;
