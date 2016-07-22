var roleRepair = {
  run: function(creep) {

    if(creep.memory.building && creep.carry.energy === 0) {
        creep.memory.building = false;
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
    }

    if(creep.memory.building){
      if(creep.memory.toFix=== ""){
        //This finds the closest structure and checks if it needs repair
        var fixe = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: function(object){
          var brokenRoad = object.structureType ===STRUCTURE_ROAD && (object.hits < object.hitsMax/2);
          var brokenWall = object.structureType ===STRUCTURE_WALL && (object.hits < object.hitsMax-1000);
          return brokenRoad || brokenWall;
        }
      });
          creep.memory.toFix = fixe.id;
          if(creep.repair(fixe) == ERR_NOT_IN_RANGE) {
              creep.moveTo(fixe);
          }else if(creep.carry.energy ===0){
            creep.memory.toFix = "";
          }
      }else{
        var oldFixe = Game.getObjectById(creep.memory.toFix);
        if(creep.repair(oldFixe) == ERR_NOT_IN_RANGE) {
            creep.moveTo(oldFixe);
        }else if(creep.carry.energy ===0){
          creep.memory.toFix = "";
        }
      }
    }else {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0]);
      }
    }
  }
};

module.exports = roleRepair;
