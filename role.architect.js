var modCommon = require('module.common');

//TODO make build container at GDropOff's when extractor unlocked
//TODO make build extractor when unlocked
//TODO Storage at flag when unlocked
//TODO Terminal at flag when unlocked
var roleArchitect = {

  //Function to determin if there are buildable structures that need to be
  //assigned a construction site (marked by named flags)
  ableToBuild:function(controllerLvl, structureType){
    var wallBool = (structureType.substring(0,4)==="Wall");
    switch(controllerLvl){
      case 1:
        return (structureType==="Container");
      case 2:
        return (wallBool || structureType === "Extensions1" || structureType==="Container");
      case 3:
        return (wallBool || structureType === "Extensions1" || structureType === "Extensions2" || structureType==="Container" || structureType === "Tower1");
      case 4:
        return (wallBool || structureType === "Extensions1" || structureType === "Extensions2" || structureType === "Extensions3" || structureType==="Container" || structureType === "Tower1");
      case 5:
        return (wallBool || structureType === "Extensions1" || structureType === "Extensions2" || structureType === "Extensions3" || structureType === "Extensions4" || structureType==="Container" || structureType === "Tower1" || structureType === "Tower2" || structureType.substring(0,4)==="Link");
      default:
        return false;
    }
  },

  //Function to mark the pattern of 5 extensions that are granted at
  //controler level 2 and 3
  markExtensions1: function(creep){
    var x = creep.pos.x;
    var y = creep.pos.y;
    creep.room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x+1, y, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x-1, y, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x, y+1, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x, y-1, STRUCTURE_EXTENSION);
  },

  //Function to mark the pattern of 5 extensions that are granted at
  //controler level 4 and 5
  markExtensions2: function(creep){
    var x = creep.pos.x;
    var y = creep.pos.y;
    creep.room.createConstructionSite(x-2, y-1, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x-1, y-1, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x, y-1, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x+1, y-1, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x+2, y-1, STRUCTURE_EXTENSION);

    creep.room.createConstructionSite(x-2, y+1, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x-1, y+1, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x, y+1, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x+1, y+1, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x+2, y+1, STRUCTURE_EXTENSION);
  },

  // marks a container site
  markContainer:function(creep){
      creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
  },

  //marks a tower site
  markTower: function(creep){
      creep.room.createConstructionSite(creep.pos, STRUCTURE_TOWER);
  },

  //marks wall sites starting at the flag, going in the specified
  //direction for the given amount of blocks
  markWall:function(creep, flagName){
    var len = parseInt(flagName.substring(5));
    var direction = flagName.substring(4,5);
    var x = creep.pos.x;
    var y = creep.pos.y;
    if(direction === "U"){
        for(i=0; i<=len; i++){
          creep.room.createConstructionSite(x, y-i, STRUCTURE_WALL);
        }
    }else if(direction === "D"){
      for(i=0; i<=len; i++){
        creep.room.createConstructionSite(x,y+i, STRUCTURE_WALL);
      }
    }else if(direction === "R"){
      for(i=0; i<=len; i++){
        creep.room.createConstructionSite(x+i,y, STRUCTURE_WALL);
      }
    }else if(direction === "L"){
      for(i=0; i<=len; i++){
        creep.room.createConstructionSite(x-i,+y, STRUCTURE_WALL);
      }
    }
  },

  /** @param {Creep} creep **/
  run: function(creep) {
    var controllerLvl = creep.room.controller.level;
    var flags = _.filter(creep.room.find(FIND_FLAGS), (flag) => this.ableToBuild(controllerLvl, flag.name));
    if(creep.memory.working && flags.length<1) {
        creep.memory.working = false;
        creep.memory.path = null;
    }
    if(!creep.memory.working && flags.length) {
        creep.memory.working = true;
        creep.memory.path = null;
    }

    if(!creep.memory.working){
      Memory.roles.numArchitects = Memory.roles.numArchitects - 1;
      Memory.roles.numBuilders = Memory.roles.numBuilders + 1;
      creep.memory.role = 'builder';
      if(controllerLvl<=1){
        creep.memory.selfHarvest = true;
      }
    }else{
      var flag = flags[0];
      if(!creep.pos.isEqualTo(flag.pos)){
        modCommon.move(creep,flag.pos);
      }else{
        if(flag.name === "Container"){
          this.markContainer(creep);
          flag.remove();
          creep.memory.path = null;
        }else if(flag.name === "Tower1" || flag.name === "Tower2"){
            this.markTower(creep);
            flag.remove();
            creep.memory.path =null;
        }else if(flag.name === "Extensions1" || flag.name ==="Extensions2"){
            this.markExtensions1(creep);
            flag.remove();
            creep.memory.path =null;
        }else if(flag.name === "Extensions3" || flag.name ==="Extensions4"){
            this.markExtensions2(creep);
            flag.remove();
            creep.memory.path = null;
        }else if(flag.name.substring(0,4)==="Wall"){
            this.markWall(creep, flag.name);
            flag.remove();
            creep.memory.path =null;
        }
      }
    }
  }
};

module.exports = roleArchitect;
