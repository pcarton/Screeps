// Module to initialize Memory space for use and do any one time setup type tasks
// Identify how many miners can be at each source and save that in memory
// Attach live creeps to sources when harvesting

var init = {
    initTasks: function(room) {
        if(!Memory.tasks){
            Memory.tasks = {};
            Memory.tasks[room] = []
        }else {
            Memory.tasks[room] = []
        }
    },

    initCreeps: function() {
        if(!Memory.creeps) {
            Memory.creeps = {};
        }
    },

    initRoom: function(room) {
        if(!Memory.rooms){
            Memory.rooms = {};
            Memory.rooms[room] = {}
        }else {
            Memory.room[room] = {}
        }
    },

    init: function(room) {
        if(!Memory.initialized){
            this.initRoom(room);
            this.initCreeps();
            this.initTasks(room);
            Memory.initialized = true;
        }
    }
};

module.exports = init;