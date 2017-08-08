var modCommon = require('module.common');
var roleFeeder = require('role.feeder');

//moves from containers marked by flags to other storage
//Flags: Drop-Off: where miners leave resouce
//Deliver: where upgraders, etc will likely pick up
//priority from first to last(energy): Spawn/Extensions - Tower - Deliver flags - Storage
var roleHauler = {
  assignDropOff:function(creep){
    var roomName = creep.room.name;
    var flags = creep.room.find(FIND_FLAGS, {
        filter: (flag) => flag.name.substring(0,7)=="DropOff"
    });
    for(var flagIndex in flags){
      var flag = flags[flagIndex];
      var dropOff = _.filter(creep.room.lookForAt(LOOK_STRUCTURES,flag), (struct)=> struct.structureType === STRUCTURE_CONTAINER || struct.structureType === STRUCTURE_LINK)[0];
      var construct = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES,flag);
      if(dropOff){
        var gID = dropOff.id;
        var thisAssigned = false;
        for (var cName in Game.creeps){
          var c = Game.creeps[cName];
          if(c.memory.role === "hauler" && c.memory.dropOff === gID){
            thisAssigned = true;
          }
        }
        if(!thisAssigned && creep.memory.dropOff === ""){
          creep.memory.dropOff = gID;
        }
      }else if(construct.length === 0 ){
        flag.memory.marked = false;
      }
    }
    Memory.rooms[roomName].roles.maxHaulers = flags.length;
  },

  findCloseDeliver(creep){
    var p1 = null;
    if(Memory.rooms[creep.room.name].roles.numFeeders < 1){
      p1 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
              filter: (structure) => {
                  return ((structure.structureType == STRUCTURE_EXTENSION ||
                          structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity);
              }
      });
    }
    var p4 = creep.pos.findClosestByRange(FIND_STRUCTURES,{
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_STORAGE && (structure.store[RESOURCE_ENERGY]<structure.storeCapacity));
      }
    });
    var deliver = null;
    if(p1){
      deliver = p1;
    }else if(p4){
      deliver = p4;
    }
    return deliver;
  },

  run:function(creep){
    if(Memory.rooms[creep.room.name].roles.numFeeders <= 0){
      roleFeeder.run(creep);
    }else{
      var dest = null;

      var dpos = null;
      var dropOffID = creep.memory.dropOff;
      var dropOff = null;

      if(dropOffID === ""){
        this.assignDropOff(creep);
      }else{
        if(dropOffID){
          dropOff = Game.getObjectById(dropOffID);
          if(dropOff){
            dPos = dropOff.pos;
          }else{
            this.assignDropOff(creep);
            return;
          }
        }
      }

      if(creep.carry.energy === creep.carryCapacity){
        dest = this.findCloseDeliver(creep);
        if(dest && creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          modCommon.move(creep,dest.pos);
        }else{
          creep.memory.path = null;
        }
      }else{
        if(creep.withdraw(dropOff, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          modCommon.move(creep,dPos);
        }else{
          creep.memory.path = null;
        }
      }
    }
  }

};

module.exports = roleHauler;
