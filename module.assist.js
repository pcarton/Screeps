//Room assist module: have one room send creeps to work in a new
//room and recycle themselves at end of life to jump start the room
var modConstants = require('module.constants');
var modCommon = require('module.common');
var modUtil = require('module.utility');

var modAssist = {

  run:function(creep){
    var controllerPos = Game.rooms[creep.memory.assist].controller.pos;

    if(creep.memory.assist !== creep.room.name){
      modCommon.move(creep,controllerPos);
    }else if(creep.ticksToLive <= modConstants.nearDeath){
      var spawn =creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType === STRUCTURE_SPAWN);
        }
      });
      if(spawn.recycleCreep(creep) === ERR_NOT_IN_RANGE)
        modCommon.move(creep,spawn.pos);
    }else{
      modUtil.runCreep(creep);
    }

  }

};

module.exports = modAssist;
