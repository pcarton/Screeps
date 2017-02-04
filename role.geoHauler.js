var modCommon = require('module.common');

//moves from containers marked by flags to other storage
//Flags: Drop-Off: where miners leave resouce
//Deliver: where upgraders, etc will likely pick up
//priority from first to last(energy): Spawn/Extensions - Tower - Deliver flags - Storage
var roleHauler = {
  assignDropOff:function(creep){
    var flags = creep.room.find(FIND_FLAGS, {
        filter: (flag) => flag.name.substring(0,8)=="GDropOff"
    });
    for(var flagIndex in flags){
      var flag = flags[flagIndex];
      var dropOff = _.filter(creep.room.lookForAt(LOOK_STRUCTURES,flag), (struct)=> struct.structureType === STRUCTURE_CONTAINER || struct.structureType === STRUCTURE_LINK)[0];
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
      }
    }
    Memory.roles.maxHaulers = flags.length;
  },

  findCloseDeliver(creep){
    var p4 = creep.pos.findClosestByRange(FIND_STRUCTURES,{
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_STORAGE && (_.sum(structure.store)<structure.storeCapacity));
      }
    });
    var deliver = null;
    if(p4){
      deliver = p4;
    }
    return deliver;
  },

  run:function(creep){
    var dest = null;

    var dpos = null;
    var dropOffID = creep.memory.dropOff;
    var dropOff = null;
    var resourceType = modCommon.whatCarry(creep);

    if(dropOffID === ""){
      this.assignDropOff(creep);
    }else{
      if(dropOffID){
        dropOff = Game.getObjectById(dropOffID);
        dPos = dropOff.pos;
      }
    }

    if(_.sum(creep.carry) > 0){
      dest = this.findCloseDeliver(creep);
      if(dest && creep.transfer(dest, resourceType) == ERR_NOT_IN_RANGE) {
        modCommon.move(creep,dest.pos);
      }else{
        creep.memory.path = null;
      }
    }else{
      if(creep.withdraw(dropOff, resourceType) == ERR_NOT_IN_RANGE) {
        modCommon.move(creep,dPos);
      }else{
        creep.memory.path = null;
      }
    }
  }
};

module.exports = roleHauler;
