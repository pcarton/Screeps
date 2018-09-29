var memoryHandler = {

  init(){
    Memory.rooms = {};
    for(var roomName in Game.rooms){
      this.initRoom(roomName);
    }
    Memory.initialized = true;
  },

  initRoom(roomName){
    Memory.rooms[roomName] = {
      spawnQ: [],
      jobQ: [],
      sourceIDs:[],
      signMsg:"",
      initialized:false, //Set to true when init is run
    };
    Memory.rooms[roomName].initialized = true;
  },

  storeJob(creep, job){
    creep.memory.job = job;
  }

};

module.exports = memoryHandler;
