var roleBuilder = require('role.builder');
var modCommon = require('module.common');

var roleRepair = {
  run: function(creep) {

    if(creep.memory.working && creep.carry.energy === 0) {
        creep.memory.working = false;
        creep.memory.toFix = "";
        creep.memory.path = null;
        creep.memory.currentlyRepair = true;
    }
    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = true;
        creep.memory.path = null;
        creep.memory.currentlyRepair = true;
    }

    if(creep.memory.working){
      if(creep.memory.toFix=== ""){
        //This finds the closest structure and checks if it needs repair
        var fixe = creep.pos.findClosestByPath(modCommon.findToFixArr(creep.room));
          if(fixe!==null){
            creep.memory.toFix = fixe.id;
            if(creep.repair(fixe) == ERR_NOT_IN_RANGE) {
              modCommon.move(creep,fixe.pos);
            }
          }else{
            //If repairing is done, build to not waste time
            if(creep.memory.currentlyRepair){
              creep.memory.currentlyRepair = false;
              creep.memory.path = null;
            }
            roleBuilder.run(creep);
          }
      }else{
        var oldFixe = Game.getObjectById(creep.memory.toFix);
        if(!oldFixe || oldFixe.hits >= oldFixe.hitsMax){
          creep.memory.toFix = "";
        }else if(creep.repair(oldFixe) == ERR_NOT_IN_RANGE){
          modCommon.move(creep,oldFixe.pos);
        }
      }
    }else{
        modCommon.getEn(creep);
      }
    }
};

module.exports = roleRepair;
