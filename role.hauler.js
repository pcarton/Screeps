//moves from containers marked by flags to other storage
//Flags: Drop-Off: where miners leave resouce
//Deliver: where upgraders, etc will likely pick up
//priority from first to last(energy): Spawn/Extensions - Tower - Deliver flags - Storage
var roleHauler = {
  findCloseDropOff:function(creep){
    var flag = _.filter(creep.pos.findClosestByPath(FIND_FLAGS), (flag) => flag.name.substring(0,7)==="DropOff");
    var dropOff = creep.room.lookForAt(LOOK_STRUCTURES,flag);
    return dropOff;
  },

  findCloseDeliver(creep){
    var p1 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity);
            }
    });
    var p2 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
              return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity);
            }
          });
    var p3Flag = _.filter(creep.pos.findClosestByPath(FIND_FLAGS), (flag) => flag.name.substring(0,7)==="Deliver");
    var p3 = creep.room.lookForAt(LOOK_STRUCTURES,flag);
    var p4 = creep.pos.findClosestByPath(FIND_STRUCTURES,{
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_STORAGE && (structure.store[RESOURCE_ENERGY]<structure.storeCapacity));
      }
    });
    var deliver = null;
    if(p1){
      deliver = p1;
    }else if(p2){
      deliver = p2;
    }else if(p3){
      deliver = p3;
    }else if(p4){
      deliver = p4;
    }

    return deliver;
  },

  run:function(creep){
    var dest = null;
    if(creep.carry.energy > 0){
      dest = findCloseDeliver(creep);
      if(dest && creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        modCommon.move(creep,dest.pos);
      }else{
        creep.memory.path = null;
      }
    }else{
      dest = findCloseDropOff(creep);
      if(dest && creep.withdraw(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        modCommon.move(creep,dest.pos);
      }else{
        creep.memory.path = null;
      }
    }
  }
};

module.exports = roleHauler;
