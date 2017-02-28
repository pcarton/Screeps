var modCommon = require('module.common');
var roleUpgrader = require('role.upgrader');

//moves from containers marked by flags to other storage
//Flags: Drop-Off: where miners leave resouce
//Deliver: where upgraders, etc will likely pick up
//priority from first to last(energy): Spawn/Extensions - Tower - Deliver flags - Storage
var roleFeeder = {
  findCloseDropOff:function(creep){
    var dropOff = creep.pos.findClosestByRange(FIND_STRUCTURES,{
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_STORAGE && (structure.store[RESOURCE_ENERGY]>(creep.carryCapacity)));
      }
    });
    return dropOff;
  },
  findMineralDropOff:function(creep){
    var dropOffFlag = creep.room.find(FIND_FLAGS, { filter: (object)=>(object.name.substring(0,8) === "GDropOff")});
    var dropOffArr = creep.room.lookForAt(LOOK_STRUCTURES, dropOffFlag[0]);
    var dropOff = _.filter(dropOffArr, (object) => object.structureType == STRUCTURE_CONTAINER)[0];
    return dropOff;
  },

  findCloseDeliver(creep){
    var p1 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity);
            }
    });
    var p2Raw = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
              return (structure.structureType == STRUCTURE_TOWER && structure.energy < (structure.energyCapacity-100));
            }
          });
    var p2 = _.sortBy(p2Raw,['energy','pos']);
    var p3Flag = creep.pos.findClosestByRange(FIND_FLAGS, {
        filter: (flag) => flag.name.substring(0,7)=="Deliver"
    });
    var p3 = _.filter(creep.room.lookForAt(LOOK_STRUCTURES,p3Flag), (struct)=> struct.structureType === STRUCTURE_CONTAINER && struct.store[RESOURCE_ENERGY] < struct.storeCapacity)[0];
    var deliver = null;
    if(p1){
      deliver = p1;
    }else if(p2){
      deliver = p2;
    }else if(p3){
      deliver = p3;
    }else{
      deliver = "Nowhere to Go";
    }
    return deliver;

    //TODO add this to memory and check if another feeder is going there
  },

  run:function(creep){
    var dest = null;
    var resourceType = modCommon.whatCarry(creep);
    if(_.sum(creep.carry)>0 && creep.carry.energy < _.sum(creep.carry)){
      var dropOff = this.findCloseDropOff(creep);
      resourceType = modCommon.whatCarry(creep);
      if(dropOff && resourceType){
        if(creep.transfer(dropOff, resourceType) === ERR_NOT_IN_RANGE){
          modCommon.move(creep, dropOff.pos);
        }else{
          creep.memory.path = null;
        }
      }
    }
    else if(creep.carry.energy > 0){
      dest = this.findCloseDeliver(creep);
      if(dest === "Nowhere to Go"){
        roleUpgrader.upgrade(creep);
      }else if(creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        modCommon.move(creep,dest.pos);
      }else{
        creep.memory.path = null;
      }
    }else{
      var dropped = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
      if(dropped){
        if(creep.pickup(dropped)== ERR_NOT_IN_RANGE){
          modCommon.move(creep,dropped.pos);
        }else{
          creep.memory.path = null;
        }
      }else{
        dest = this.findCloseDropOff(creep);
        var minerals = this.findMineralDropOff(creep);
        resourceType = RESOURCE_ENERGY;
        if(minerals && _.sum(minerals.store)>0){
          dest = minerals;
          resourceType = modCommon.whatStore(minerals);
        }
        if(dest && creep.withdraw(dest, resourceType) == ERR_NOT_IN_RANGE) {
          modCommon.move(creep,dest.pos);
        }else{
          creep.memory.path = null;
        }
      }
    }
  }
};

module.exports = roleFeeder;
