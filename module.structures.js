//Tower initial Memory
var initialTowerMem = {
  "target":null,
  "mode":"attack"
};

var roleStructures = {

  //Tower related functions
  inSight:function(pos, tower){

  },

  attack:function(tower){
    var enemy = Game.getObjectById(Memory.tower.target);
    if(enemy){
      tower.attack(enemy);
    }
  },

  heal:function(tower){

  },

  run:function(tower){
    if(Memory.tower.mode === "attack"){
      attack(tower);
    }else{
      heal(tower);
    }

  },

  pickTargets:function(controller){
    //priority Targets
    var pTargets = controller.pos.findInRange(FIND_HOSTILE_CREEPS,20);
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
