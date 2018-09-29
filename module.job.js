//Module to define job types and end condition functions
var modJob = {

    createJob(input){
        return {
            target: input.target ? input.target : undefined,
            partsRequired: input.partsRequired ? input.partsRequired : [],
            endCondition: input.endConditon && typeof input.endCondition === "function" ? input.endCondition : defaultEndCondition,
            action:  input.action && typeof input.acion === "function" ? input.action : defaultAction,
            range: input.range ? input.range : 1,
            type: input.type ? input.type : "default"
        }
    },

    defaultAction(creep, target){
        creep.say("Default ▶️")
    },

    harvestAction(creep, target){
        if(creep && target){
            creep.harvest(target)
        }
    },

    defaultEndCondition(creep){
        return false //Never ends
    },

    getHarvestJob(source){
        input = {
            target: source,
            partsRequired: [WORK,MOVE],
            action: harvestAction,
            type: "harvest"
        }
        return this.createJob(input)
    }

};

module.exports = modJob;