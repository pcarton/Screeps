// Module to initialize Memory space for use and do any one time setup type tasks
// Identify how many miners can be at each source and save that in memory
// Attach live creeps to sources when harvesting

var common = require('common');

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
        //Need to add calculations for max harvesters per source and max upgraders
        if(!Memory.rooms){
            Memory.rooms = {};
            Memory.rooms[room] = {};
        }else {
            Memory.rooms[room] = {};
        }

        var sourceMemoryMap = {};

        var sources = Game.rooms[room].find(FIND_SOURCES);
        for( var sourceIndex in sources) {
            var sourceId = sources[sourceIndex].id
            var sourceMem = {
                "id": sourceId,
                "dropOffId": null, //to be used once a container is placed near the source
                "maxHarvesters": common.getAccessibleHarvestLocations(sourceId),
            };
            sourceMemoryMap[sourceId] = sourceMem;
        }
        Memory.rooms[room].sources = sourceMemoryMap;
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