//Module to define job types and end condition functions
var modJob = {

    createJob(target,partsRequired,endCondition,action,range,type){
        return {
            target: target ? target : undefined,
            partsRequired: partsRequired ? partsRequired : [],
            endCondition: endConditon && typeof endCondition === "function" ? endCondition : defaultEndCondition,
            action:  action && typeof acion === "function" ? action : defaultAction,
            range: range ? range : 1,
            type: type ? type : "default"
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
        return this.createJob(source,[WORK,MOVE],null,harvestAction,"harvest")
    }

};

module.exports = modJob;