// Module used to evalute which tasks need to be done and enqueue them

// Repair - roads -only repair if enough to justify a full "tank" of energy for the default creep type of that tier, or defensive and being invaded
// Build - only if construction needs to happen, higher priority for Defensive structures, extensions, spawns
// Attack - highest priority if invaders
// Upgrade
// Mine - task that doesnt expire until the creep dies then goes back on the queue. need 1 for each available mining location

var overlord = {

    needHarvesting: function(roomName) {
        //return which source needs a harvester or null if all are full
        //get sources in room and ids
        //get harvestable location count for each
        //get screeps with memory for their task indicating harvest and that source pos
        //get enqueued tasks for harvesting each source in the room
        //if screeps + enqueued < locations for a source then return that source
        //short circut at the first source
    },

    needUpgrading: function(roomName) {
        // get location count available for upgrades
        // get screeps with memory for their task indicating upgrade
        // get enqueued tasks for this room for upgrading
        // if upgrading screeps + enqueued tasks <= available upgrade locations
    }
};

module.exports = overlord;