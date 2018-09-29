var modJob = require('./job.js');

var harvester = {  
    harvestAction(creep, target){
        if(creep && target){
            creep.harvest(target);
            creep.say("⛏️");
        }
    },

    getHarvestJob(source){
        input = {
            target: source,
            partsRequired: [WORK,MOVE,CARRY],
            action: harvestAction,
            type: "harvest"
        };
        return modJob.createJob(input);
    }

};

module.exports = harvester;