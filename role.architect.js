var modCommon = require('module.common');

//TODO make build extractor when unlocked - need flag currently
var roleArchitect = {

  //Function to determin if there are buildable structures that need to be
  //assigned a construction site (marked by named flags)
  //TODO finish this method for through controllerLvl 8
  ableToBuild:function(controllerLvl, structureType){
    var wallBool = (structureType.substring(0,4)==="Wall");
    var containerBool = (structureType.substring(0,9)==="Container" || structureType.substring(0,7)==="DropOff" || structureType.substring(0,8)==="GDropOff" || structureType.substring(0,7)==="Deliver");
    switch(controllerLvl){
      case 1:
        return containerBool;
      case 2:
        return (wallBool || structureType === "Extensions1" || containerBool);
      case 3:
        return (wallBool || structureType === "Extensions1" || structureType === "Extensions2" || containerBool || structureType === "Tower1");
      case 4:
        return (wallBool || structureType === "Extensions1" || structureType === "Extensions2" || structureType === "Extensions3" || containerBool || structureType === "Tower1" || structureType === "Storage");
      case 5:
        return (wallBool || structureType === "Extensions1" || structureType === "Extensions2" || structureType === "Extensions3" || structureType === "Extensions4" || containerBool || structureType === "Tower1" || structureType === "Tower2" || structureType.substring(0,4)==="Link" || structureType === "Storage");
      case 6:
        return (wallBool || structureType === "Extensions1" || structureType === "Extensions2" || structureType === "Extensions3" || structureType === "Extensions4" || containerBool || structureType === "Tower1" || structureType === "Tower2" || structureType.substring(0,4)==="Link" || structureType === "Storage" || structureType === "Extractor" || structureType === "Terminal");
      case 7:
        return (wallBool || structureType === "Extensions1" || structureType === "Extensions2" || structureType === "Extensions3" || structureType === "Extensions4" || containerBool || structureType === "Tower1" || structureType === "Tower2" || structureType === "Tower3" || structureType.substring(0,4)==="Link" || structureType === "Storage" || structureType === "Extractor" || structureType === "Terminal");
      case 8:
        return (wallBool || structureType === "Extensions1" || structureType === "Extensions2" || structureType === "Extensions3" || structureType === "Extensions4" || containerBool || structureType === "Tower1" || structureType === "Tower2" || structureType === "Tower3" || structureType.substring(0,4)==="Link" || structureType === "Storage" || structureType === "Extractor" || structureType === "Terminal");
      default:
        return false;
    }
  },

  //Function to mark the pattern of 5 extensions that are granted at
  //controler level 2 and 3
  markExtensions1: function(flag){
    var x = flag.pos.x;
    var y = flag.pos.y;
    flag.room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
    flag.room.createConstructionSite(x+1, y, STRUCTURE_EXTENSION);
    flag.room.createConstructionSite(x-1, y, STRUCTURE_EXTENSION);
    flag.room.createConstructionSite(x, y+1, STRUCTURE_EXTENSION);
    flag.room.createConstructionSite(x, y-1, STRUCTURE_EXTENSION);
  },

  //Function to mark the pattern of 5 extensions that are granted at
  //controler level 4 and 5
  markExtensions2: function(flag){
    var x = flag.pos.x;
    var y = flag.pos.y;
    flag.room.createConstructionSite(x-2, y-1, STRUCTURE_EXTENSION);
    flag.room.createConstructionSite(x-1, y-1, STRUCTURE_EXTENSION);
    flag.room.createConstructionSite(x, y-1, STRUCTURE_EXTENSION);
    flag.room.createConstructionSite(x+1, y-1, STRUCTURE_EXTENSION);
    flag.room.createConstructionSite(x+2, y-1, STRUCTURE_EXTENSION);

    flag.room.createConstructionSite(x-2, y+1, STRUCTURE_EXTENSION);
    flag.room.createConstructionSite(x-1, y+1, STRUCTURE_EXTENSION);
    flag.room.createConstructionSite(x, y+1, STRUCTURE_EXTENSION);
    flag.room.createConstructionSite(x+1, y+1, STRUCTURE_EXTENSION);
    flag.room.createConstructionSite(x+2, y+1, STRUCTURE_EXTENSION);
  },

  // marks a container site
  markContainer:function(flag){
      flag.room.createConstructionSite(flag.pos, STRUCTURE_CONTAINER);
  },

  //marks a tower site
  markTower: function(flag){
      flag.room.createConstructionSite(flag.pos, STRUCTURE_TOWER);
  },

  //marks wall sites starting at the flag, going in the specified
  //direction for the given amount of blocks
  markWall:function(flag, flagName){
    var len = parseInt(flagName.substring(5));
    var direction = flagName.substring(4,5);
    var x = flag.pos.x;
    var y = flag.pos.y;
    if(direction === "U"){
        for(i=0; i<=len; i++){
          flag.room.createConstructionSite(x, y-i, STRUCTURE_WALL);
        }
    }else if(direction === "D"){
      for(i=0; i<=len; i++){
        flag.room.createConstructionSite(x,y+i, STRUCTURE_WALL);
      }
    }else if(direction === "R"){
      for(i=0; i<=len; i++){
        flag.room.createConstructionSite(x+i,y, STRUCTURE_WALL);
      }
    }else if(direction === "L"){
      for(i=0; i<=len; i++){
        flag.room.createConstructionSite(x-i,+y, STRUCTURE_WALL);
      }
    }
  },

  //TODO implement these methods and use it
  markExtractor:function(flag){
      flag.room.createConstructionSite(flag.pos, STRUCTURE_EXTRACTOR);
  },
  markTerminal:function(flag){
      flag.room.createConstructionSite(flag.pos, STRUCTURE_TERMINAL);
  },
  markStorage:function(flag){
      flag.room.createConstructionSite(flag.pos, STRUCTURE_STORAGE);
  },
  markLink:function(flag){
      flag.room.createConstructionSite(flag.pos, STRUCTURE_LINK);
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
      var structureType = structureType;
      var wallBool = (structureType.substring(0,4)==="Wall");
      var containerBool = (structureType.substring(0,9)==="Container" || structureType.substring(0,7)==="DropOff" || structureType.substring(0,8)==="GDropOff" || structureType.substring(0,7)==="Deliver");
      //TODO autoBuilds like extractor

      //then flag builds after
      if(containerBool){
        this.markContainer(flag);
        flag.remove();
      }else if(structureType.substring(0,5) === "Tower"){
          this.markTower(flag);
          flag.remove();
      }else if(structureType === "Extensions1" || structureType ==="Extensions2"){
          this.markExtensions1(flag);
          flag.remove();
      }else if(structureType === "Extensions3" || structureType ==="Extensions4"){
          this.markExtensions2(flag);
          flag.remove();
      }else if(wallBool){
          this.markWall(flag, structureType);
          flag.remove();
      }else if(structureType === "Link"){
        this.markLink(flag);
        flag.remove();
      }else if(structureType === "Storage"){
        this.markStorage(flag);
        flag.remove();
      }else if(structureType === "Terminal"){
        this.markTerminal(flag);
        flag.remove();
      }else if(structureType === "Extractor"){
        this.markExtractor(flag);
        flag.remove();
      }

    }
  }
};

module.exports = roleArchitect;
