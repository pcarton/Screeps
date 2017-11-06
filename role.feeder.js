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
    var dropOffFlag = creep.room.find(FIND_FLAGS, { filter: (object)=>(object.name.substring(0,8) === "GDropOff")})[0];
    var dropOffArr;
    var dropOff;
    if(dropOffFlag){
      dropOffArr = creep.room.lookForAt(LOOK_STRUCTURES, dropOffFlag);
      dropOff = _.filter(dropOffArr, (object) => object.structureType == STRUCTURE_CONTAINER )[0];
    }
    if(!dropOff && dropOffFlag){
      var construct = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES,dropOffFlag);
      if(construct.length === 0){
        dropOffFlag.memory.marked = false;
      }
    }else if(dropOff){
      if(_.sum(dropOff.store) >= creep.carryCapacity){
        return dropOff;
      }else{
        return null;
      }
    }
  },

  findCloseDeliver(creep){
    var otherFeeders = modCommon.getCreepsByJob('feeder',creep.memory.room);
    var otherDests = [];
    for(var cName in otherFeeders){
      otherDests.push(otherFeeders[cName].memory.deliver);
    }
    var p1 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity) && (otherDests.indexOf(structure.id) == -1);
            }
    });
    var p2 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
              return (structure.structureType == STRUCTURE_TOWER && structure.energy < (structure.energyCapacity-100)) && (otherDests.indexOf(structure.id) == -1);
            }
          });
    var p3Flag = creep.pos.findClosestByRange(FIND_FLAGS, {
        filter: (flag) => flag.name.substring(0,7)=="Deliver" || flag.name.substring(0,4)=="Load"
    });
    var p3 = _.filter(creep.room.lookForAt(LOOK_STRUCTURES,p3Flag), (struct)=> (struct.structureType === STRUCTURE_CONTAINER || struct.structureType === STRUCTURE_LINK));
    var p3Low = _.filter(p3, (struct) => (struct.structureType === STRUCTURE_CONTAINER && struct.store[RESOURCE_ENERGY]< struct.storeCapacity) || (struct.structureType === STRUCTURE_LINK && struct.energy < struct.energyCapacity))[0];
    var construct = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES,p3Flag);
    var deliver = null;
    if(p3Flag && p3.length===0 && construct.length === 0){
      p3Flag.memory.marked = false;
    }
    if(p1){
      deliver = p1;
      creep.memory.deliver = deliver.id;
    }else if(p2){
      deliver = p2;
      creep.memory.deliver = deliver.id;
    }else if(p3Low){
      deliver = p3Low;
      creep.memory.deliver = deliver.id;
    }else{
      deliver = "Nowhere to Go";
    }
    //TODO add this to memory and check if another feeder is going there

    return deliver;
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
      if(creep.memory.deliver){
        dest = Game.getObjectById(creep.memory.deliver);
      }else{
        dest = this.findCloseDeliver(creep);
      }
      if(dest === "Nowhere to Go"){
        roleUpgrader.upgrade(creep);
      }else if(creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        modCommon.move(creep,dest.pos);
      }else{
        creep.memory.path = null;
        creep.memory.deliver = null;
      }
    }else{
      var dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
      if(dropped && (dropped.amount >= 1000 || dropped.resourceType !== RESOURCE_ENERGY)){
        if(creep.pickup(dropped)== ERR_NOT_IN_RANGE){
          modCommon.move(creep,dropped.pos);
        }else{
          creep.memory.path = null;
        }
      }else{
        dest = this.findCloseDropOff(creep);
        var minerals = this.findMineralDropOff(creep);
        resourceType = RESOURCE_ENERGY;
        var roomForMinerals = _.sum(creep.room.storage.store)<=creep.room.storage.storeCapacity*0.95;
        if(minerals && roomForMinerals){
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
