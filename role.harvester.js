var roleBuilder = require('role.builder');
var modCommon = require('module.common');

var roleHarvester = {

  assignSource:function(creep){
    var flags = _.filter(creep.room.find(FIND_FLAGS), (flag) => flag.name.substring(0,1)==="S" && flag.name !== "Storage" && flag.name.substring(0,5) !== "Spawn");
    var roomName = creep.room.name;
    var maxHarvesters = 0;
    for(var fName in flags){
      var f = flags[fName];
      var gID = creep.room.lookForAt(LOOK_SOURCES,f)[0].id;
      var numberToHarvest = parseInt(f.name.substring(1));
      maxHarvesters = maxHarvesters + numberToHarvest;
      for(var cName in Game.creeps){
          var c = Game.creeps[cName];
          if(c.memory.source === gID){
            numberToHarvest = numberToHarvest-1;
          }
      }
      if(numberToHarvest>0 && creep.memory.source === ""){
        creep.memory.source = gID;
      }
    }
    Memory.rooms[roomName].roles.maxHarvesters = maxHarvesters;
  },

  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.memory.working && creep.carry.energy === 0) {
        creep.memory.working = false;
        creep.memory.path = null;
        creep.memory.currentlyHarvester = true;
    }
    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = true;
        creep.memory.path = null;
        creep.memory.currentlyHarvester = true;
    }

    if(!creep.memory.working){
        var dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if(dropped && dropped.resourceType === RESOURCE_ENERGY){
            if(creep.pickup(dropped)== ERR_NOT_IN_RANGE){
              modCommon.move(creep,dropped.pos);
            }else{
              creep.memory.path = null;
            }
          }else{
            var sourceID = creep.memory.source;
            if(sourceID){
              var source = Game.getObjectById(sourceID);
              if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                modCommon.move(creep,source.pos);
              }
            }else{
                this.assignSource(creep);
            }
          }
    }else{
          var p1 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                  filter: (structure) => {
                      return ((structure.structureType == STRUCTURE_EXTENSION ||
                              structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity);
                  }
          });
          var p2 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                  filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity-100) || (structure.structureType === STRUCTURE_STORAGE && (structure.store[RESOURCE_ENERGY]<structure.storeCapacity));
                  }
                });

          var p3Flag = creep.pos.findClosestByRange(FIND_FLAGS, {
              filter: (flag) => flag.name.substring(0,7)=="Deliver"
          });
          var p3 = _.filter(creep.room.lookForAt(LOOK_STRUCTURES,p3Flag), (struct)=> struct.structureType === STRUCTURE_CONTAINER)[0];
          var construct = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES,p3Flag);
          if(p3Flag && !p3 && construct.length === 0){
            p3Flag.memory.marked = false;
          }

          var p4Flag = creep.pos.findClosestByPath(FIND_FLAGS,{
            filter: (flag) => {
              return (flag.name.substring(0,9)==="Container" || flag.name.substring(0,7)==="DropOff" || flag.name.substring(0,7)==="Deliver");
            }
          });
          var p4 = null;
          if(p4Flag){
            var p4Arr = creep.room.lookForAt(LOOK_STRUCTURES, p4Flag);
            if(p4Arr){
              p4 = _.filter(p4Arr, (object) => object.structureType == STRUCTURE_CONTAINER)[0];
            }
          }

          if(p1) {
              if(creep.transfer(p1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                modCommon.move(creep,p1.pos);
              }else{
                creep.memory.path = null;
              }
          }else if(p2){
            if(creep.transfer(p2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              modCommon.move(creep,p2.pos);
            }else{
              creep.memory.path = null;
            }
          }else if(p3 && p3.store[RESOURCE_ENERGY] < p3.storeCapacity){
            if(creep.transfer(p3, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              modCommon.move(creep,p3.pos);
            }else{
              creep.memory.path = null;
            }
          }else if(p4){
            if(creep.transfer(p4, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              modCommon.move(creep,p4.pos);
            }else{
              creep.memory.path = null;
            }
          }else{
            roleBuilder.run(creep);
          }
      }
  }
};

module.exports = roleHarvester;
