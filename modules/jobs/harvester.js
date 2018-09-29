    
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
            partsRequired: [WORK,MOVE],
            action: harvestAction,
            type: "harvest"
        };
        return this.createJob(input);
    }

};

module.exports = harvester;