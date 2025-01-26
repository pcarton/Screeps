const { drop } = require("lodash");

// Module for various upkeep tasks, like updating memory
var upkeep = {
    updateSourceDropOffs: function(roomName) {
        var sources = Game.rooms[roomName].find(FIND_SOURCES_ACTIVE);
        for(var sourceIndex in sources) {
            var sourceId = sources[sourceIndex].id
            var source = sources[sourceIndex];
            var pos = source.pos;
            var room = source.room
            var sorroundings = room.lookAtArea(pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1, true);
            var dropOffs = _.filter(sorroundings, function (object) {
                return ( object.type == "structure" && object.structure.structureType == STRUCTURE_CONTAINER);
            });
            if (dropOffs && dropOffs.length > 0) {
                Memory.rooms[roomName].sources[sourceId].dropOffId = dropOffs[0].structure.id
            }
        }
    },
    performUpkeep: function(roomName) {
        this.updateSourceDropOffs(roomName);
    },
};

module.exports = upkeep;