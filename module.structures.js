var roleStructures = {

  //Tower related functions
  inSight:function(pos, tower){

  },

  attack:function(tower){
    var enemy= Game.getObjectById(Memory.tower.target);
    if(enemy){
      tower.attack(enemy);
    }
  },

  heal:function(tower){

  },

  runTower:function(tower){
    if(Memory.tower.mode === "attack"){
      attack(tower);
    }else{
      heal(tower);
    }

  },

  pickTargets:function(allCreepList){
    //priority Targets
    var pTargets = _.filter(allCreepList, (creep) => (creep.owner && creep.owner.username !=="PCarton"));
    if(pTargets.length>0){
      Memory.tower.target = pTargets[0].id;
    }else{
      var targets = controller.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if(targets.length>0){
        Memory.tower.target = targets[0].id;
      }
    }
  }
  //End Tower related functions
};

module.exports = roleStructures;
