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
};
module.exports = common;