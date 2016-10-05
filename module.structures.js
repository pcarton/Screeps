var modCommon = require('module.common');

var roleStructures = {

  //Tower related functions
  inSight:function(pos, tower){

  },

  attack:function(tower){
    var enemy= Game.getObjectById(Memory.towersMem.target);
    if(enemy){
      tower.attack(enemy);
    }
  },

  heal:function(tower, allCreepList){
    var injured = modCommon.findInjured(allCreepList); //TODO add this to mem so it runs less often
    if(injured.length){
      tower.heal(injured[0]);
    }else{
      var damagedStructs;
      if(Memory.fortify){
        damagedStructs= modCommon.findToFixArr(tower.room);
        if(!damagedStructs.length){
          damagedStructs = modCommon.findToFortify(tower.room);
        }
      }else{
        damagedStructs= modCommon.findToFixArr(tower.room);
      }

      toFix = tower.pos.findClosestByRange(damagedStructs);


      if(toFix!==null){
        tower.repair(toFix);
      }
    }
  },

  runTower:function(tower, allCreepList){
    if(Memory.towersMem.mode === "attack"){
      this.attack(tower);
    }else if(tower.energy > 300){
      this.heal(tower,allCreepList);
    }

  },

  pickTargets:function(controller, allCreepList){
    //priority Targets
    var pTargets = _.filter(allCreepList, (creep) => (creep.owner && creep.owner.username !=="PCarton"));
    if(pTargets){
      if(pTargets.length){
        Memory.towersMem.target = pTargets[0].id;
      }
    }else{
      var targets = controller.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if(targets.length>0){
        Memory.towersMem.target = targets[0].id;
      }
    }
  }
  //End Tower related functions
};

module.exports = roleStructures;
