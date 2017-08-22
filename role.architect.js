var modCommon = require('module.common');

var roleArchitect = {

  //Function to determin if there are buildable structures that need to be
  //assigned a construction site (marked by named flags)
  //TODO fix the naming conventions to support multiple rooms
  ableToBuild:function(controllerLvl, flag){
    var structureType = flag.name;
    var wallBool = (structureType.substring(0,4)==="Wall");
    var containerBool = (structureType.substring(0,9)==="Container" || structureType.substring(0,7)==="DropOff" || structureType.substring(0,7)==="Deliver");
    var mineralContainerBool =  structureType.substring(0,8)==="GDropOff";
    var containerBoolEarly = (structureType.substring(0,9)==="Container" ||  structureType.substring(0,7)==="Deliver");
    var marked = flag.memory.marked;
    switch(controllerLvl){
      case 1:
        return containerBoolEarly && !marked;
      case 2:
        return (wallBool || structureType === "Extensions1" || containerBool) && !marked;
      case 3:
        return (wallBool || structureType === "Extensions1" || structureType === "Extensions2" || containerBool || structureType === "Tower1") && !marked;
      case 4:
        return (wallBool || structureType === "Extensions1" || structureType === "Extensions2" || structureType === "Extensions3" || containerBool || structureType === "Tower1" || structureType === "Storage") && !marked;
      case 5:
        return (wallBool || structureType === "Extensions1" || structureType === "Extensions2" || structureType === "Extensions3" || structureType === "Extensions4" || containerBool || structureType === "Tower1" || structureType === "Tower2" || structureType.substring(0,4)==="Link" || structureType === "Storage") && !marked;
      case 6:
        return (wallBool || structureType === "Extensions1" || structureType === "Extensions2" || structureType === "Extensions3" || structureType === "Extensions4" || containerBool || structureType === "Tower1" || structureType === "Tower2" || structureType.substring(0,4)==="Link" || structureType === "Storage" || structureType === "Extractor" || structureType === "Terminal" || mineralContainerBool) && !marked;
      case 7:
        var extentionsBool = (structureType === "Extensions1" || structureType === "Extensions2" || structureType === "Extensions3" || structureType === "Extensions4");
        return (wallBool || extentionsBool|| containerBool || structureType === "Tower1" || structureType === "Tower2" || structureType === "Tower3" || structureType.substring(0,4)==="Link" || structureType === "Storage" || structureType === "Extractor" || structureType === "Terminal" || mineralContainerBool)  && !marked;
      case 8:
        var extensionsBool =  structureType === "Extensions1" || structureType === "Extensions2" || structureType === "Extensions3" || structureType === "Extensions4";

        var towerBool = structureType === "Tower1" || structureType === "Tower2" || structureType === "Tower3" || structureType === "Tower4";

        return (wallBool || extensionsBool || containerBool || towerBool || structureType.substring(0,4)==="Link" || structureType === "Storage" || structureType === "Extractor" || structureType === "Terminal" || mineralContainerBool)  && !marked;

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

    flag.memory.marked = true;
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

    flag.memory.marked = true;
  },

  // marks a container site
  markContainer:function(flag){
    flag.room.createConstructionSite(flag.pos, STRUCTURE_CONTAINER);
    flag.memory.marked = true;
  },

  //marks a tower site
  markTower: function(flag){
      flag.room.createConstructionSite(flag.pos, STRUCTURE_TOWER);
      flag.memory.marked = true;
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
        flag.memory.marked = true;
    }else if(direction === "D"){
      for(i=0; i<=len; i++){
        flag.room.createConstructionSite(x,y+i, STRUCTURE_WALL);
      }
      flag.memory.marked = true;
    }else if(direction === "R"){
      for(i=0; i<=len; i++){
        flag.room.createConstructionSite(x+i,y, STRUCTURE_WALL);
      }
      flag.memory.marked = true;
    }else if(direction === "L"){
      for(i=0; i<=len; i++){
        flag.room.createConstructionSite(x-i,+y, STRUCTURE_WALL);
      }
      flag.memory.marked = true;
    }
  },

  markExtractor:function(flag){
      flag.room.createConstructionSite(flag.pos, STRUCTURE_EXTRACTOR);
      flag.memory.marked = true;
  },
  markTerminal:function(flag){
      flag.room.createConstructionSite(flag.pos, STRUCTURE_TERMINAL);
      flag.memory.marked = true;
  },
  markStorage:function(flag){
      flag.room.createConstructionSite(flag.pos, STRUCTURE_STORAGE);
      flag.memory.marked = true;
  },
  markLink:function(flag){
      flag.room.createConstructionSite(flag.pos, STRUCTURE_LINK);
      flag.memory.marked = true;
  },

  /** @param {Creep} creep **/
  run: function(creep) {
    var controllerLvl = creep.room.controller.level;
    var flags = _.filter(creep.room.find(FIND_FLAGS), (flag) => this.ableToBuild(controllerLvl, flag));
    if(creep.memory.working && flags.length<1) {
        creep.memory.working = false;
        creep.memory.path = null;
    }
    if(!creep.memory.working && flags.length) {
        creep.memory.working = true;
        creep.memory.path = null;
    }

    if(!creep.memory.working){
      var roomName = creep.room.name;
      Memory.rooms[roomName].roles.numArchitects = Memory.rooms[roomName].roles.numArchitects - 1;
      Memory.rooms[roomName].roles.numBuilders = Memory.rooms[roomName].roles.numBuilders + 1;
      creep.memory.role = 'builder';
      if(!creep.room.storage){
        creep.memory.selfHarvest = true;
      }
    }else{
      var flag = flags[0];
      var structureType = flag.name;
      var wallBool = (structureType.substring(0,4)==="Wall");
      var containerBool = (structureType.substring(0,9)==="Container" || structureType.substring(0,7)==="DropOff" || structureType.substring(0,8)==="GDropOff" || structureType.substring(0,7)==="Deliver");
      if(containerBool){
        this.markContainer(flag);
        if(structureType.substring(0,9) === "Container"){
          flag.memory = {};
          flag.remove();
        }
      }else if(structureType.substring(0,5) === "Tower"){
          this.markTower(flag);
          flag.memory = {};
          flag.remove();
      }else if(structureType === "Extensions1" || structureType ==="Extensions2"){
          this.markExtensions1(flag);
          flag.memory = {};
          flag.remove();
      }else if(structureType === "Extensions3" || structureType ==="Extensions4"){
          this.markExtensions2(flag);
          flag.memory = {};
          flag.remove();
      }else if(wallBool){
          this.markWall(flag, structureType);
          flag.memory = {};
          flag.remove();
      }else if(structureType === "Link"){
          this.markLink(flag);
          flag.memory = {};
          flag.remove();
      }else if(structureType === "Storage"){
          this.markStorage(flag);
          flag.memory = {};
          flag.remove();
      }else if(structureType === "Terminal"){
          this.markTerminal(flag);
          flag.memory = {};
          flag.remove();
      }else if(structureType === "Extractor"){
          this.markExtractor(flag);
          flag.memory = {};
          flag.remove();
      }

    }
  }
};

module.exports = roleArchitect;
