var roleArchitect = {

  ableToBuild:function(controllerLvl, structureType){
    var wallBool = (structureType.substring(0,4)==="Wall");
    switch(controllerLvl){
      case 1:
        return (structureType==="Container");
      case 2:
        return (wallBool || structureType === "Extensions1" || structureType==="Container");
      case 3:
        return (wallBool || structureType === "Extensions1" || structureType === "Extensions2" || structureType==="Container" || structureType === "Tower1");
      default:
        return false;
    }
  },

  markExtensions1: function(creep){
    var x = creep.pos.x;
    var y = creep.pos.y;
    creep.room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x+1, y, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x-1, y, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x, y+1, STRUCTURE_EXTENSION);
    creep.room.createConstructionSite(x, y-1, STRUCTURE_EXTENSION);
  },

  markContainer:function(creep){
      creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
  },

  markTower: function(creep){
      creep.room.createConstructionSite(creep.pos, STRUCTURE_TOWER);
  },

  //TODO
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
    }
    if(!creep.memory.working && flags.length) {
        creep.memory.working = true;
    }

    if(!creep.memory.working){
      creep.memory.role = 'builder';
      if(controllerLvl<=1){
        creep.memory.selfHarvest = true;
      }
    }else{
      var flag = flags[0];
      if(!creep.pos.isEqualTo(flag.pos)){
        creep.moveTo(flag);
      }else{
        if(flag.name === "Container"){
          this.markContainer(creep);
          flag.remove();
        }else if(flag.name === "Tower1"){
            this.markTower(creep);
            flag.remove();
        }else if(flag.name === "Extensions1" || flag.name ==="Extensions2"){
            this.markExtensions1(creep);
            flag.remove();
        }else if(flag.name.substring(0,4)==="Wall"){
            this.markWall(creep, flag.name);
            flag.remove();
        }
      }
    }
  }
};

module.exports = roleArchitect;
