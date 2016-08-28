var roleMiner = {

  assignSource:function(creep){
    var sources = creep.room.find(FIND_SOURCES);
    for(var sIndex in sources){
      var s = sources[sIndex];
      var gID = s.id;
      var thisAssigned =false;
      for(var cName in Game.creeps){
          var c = Game.creeps[cName];
          if(c.memory.source === gID){
            thisAssigned = true;
          }
      }
      if(!thisAssigned && creep.memory.source === ""){
        creep.memory.source = gID;
      }
      Memory.roles.maxMiners = sources.length;
    }
  },

  run: function(creep) {

  }

};

module.exports = roleMiner;
