// Module used to evalute which tasks need to be done and enqueue them

// Repair - roads -only repair if enough to justify a full "tank" of energy for the default creep type of that tier, or defensive and being invaded
// Build - only if construction needs to happen, higher priority for Defensive structures, extensions, spawns
// Attack - highest priority if invaders
// Upgrade
// Mine - task that doesnt expire until the creep dies then goes back on the queue. need 1 for each available mining location
var task = require('task');

var overlord = {

    meetNeedsHarvesting: function(roomName) {
        var room = Game.rooms[roomName];
        if (room.energyCapacityAvailable <= 300){
            return; //Dont need harvesters at tier 1, need upgrades and construction
        }
        //return which source needs a harvester or null if all are full
        //get sources in room and ids
        //get harvestable location count for each
        var sources = Memory.rooms[roomName].sources;
        var harvestTasks = task.getEnqueuedHarvestTasks(roomName);
        var activeHarvestTasks = task.getAssignedHarvestTasks(roomName);
        for (var sourceId in sources){
            for (var task in harvestTasks) {
                if (task.targetId == sourceId) {
                    sources[sourceId].maxHarvesters =  sources[sourceId].maxHarvesters - 1;
                }
            }
            for (var activeTask in activeHarvestTasks) {
                if (activeTask.targetId == sourceId) {
                    sources[sourceId].maxHarvesters =  sources[sourceId].maxHarvesters - 1;
                }
            }
            for (let i = 0; i < sources[sourceId].maxHarvesters; i++) {
                task.queueHarvestTask(roomName,sourceId, sources[sourceId].dropOffId);
            }
        }

        //get screeps with memory for their task indicating harvest and that source pos
        //get enqueued tasks for harvesting each source in the room
        //enqueue any needed tasks
    },

    meetNeedsUpgrading: function(roomName) {
        // get location count available for upgrades
        // get screeps with memory for their task indicating upgrade
        // get enqueued tasks for this room for upgrading
        // if upgrading screeps + enqueued tasks <= available upgrade locations
        //enqueue any needed tasks
    },

    meetNeedsConstructing: function(roomName) {
        // See how many construction sites exist
        // See how many creeps are working on construction
        //enqueue any needed tasks
    },

    meetNeedsHauling: function(roomName) {

        //enqueue any needed tasks
    },

    meetNeeds: function(roomName) {
        console.log("Evaluating tasks needed");
        this.meetNeedsHarvesting(roomName);
        this.meetNeedsUpgrading(roomName);
        this.meetNeedsConstructing(roomName);
        this.meetNeedsHauling(roomName);
    }
};

module.exports = overlord;