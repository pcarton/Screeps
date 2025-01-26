// Module for common helper functions like picking nearest targets, etc
var _ = require('lodash');

var common = {
    getAccessibleHarvestLocations: function(sourceId) {
        var source = Game.getObjectById(sourceId);
        var pos = source.pos;
        var room = source.room
        var sorroundings = room.lookAtArea(pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1, true);
        var accessibleSouroundings = _.filter(sorroundings, function (o) {
            return ( o.type == "terrain" && o.terrain != "wall");
        });
        return accessibleSouroundings.length;
    },
    getEnergyPickupLocations: function(roomName) {
        var room = Game.rooms[roomName];
        var structures = room.find(FIND_STRUCTURES);
        var energyStorage = _.filter(structures, function (structure) {
            return ( structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER);
        });
        if ( energyStorage.length > 0 ) {
            return energyStorage;
        }
        else {
            return room.find(FIND_SOURCES);
        }
    },
};
module.exports = common;