//Module to define job types and end condition functions
var modJob = {
    jobTemplate = {
        pos: undefined,
        partsRequired: [],
        endCondition: defaultEndCondition,
        action: defaultAction,
        type: "default"
    },

    defaultAction: function(creep){
        creep.say("Default ▶️")
    },

    defaultEndCondition: function(){
        return false; //Never ends
    },

};

module.exports = modJob;