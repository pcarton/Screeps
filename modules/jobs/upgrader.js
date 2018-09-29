var jobModule = require('./job.js');

var upgrader = {  
    upgradeAction(creep, target){
        if(creep && target){
            creep.upgradeController(target);
            creep.say("🔨");
        }
    },

    getUpgraderJob(controller){
        input = {
            target: controller,
            partsRequired: [WORK,MOVE,CARRY],
            action: upgradeAction,
            type: "upgrade",
            range: 3
        };
        return jobModule.createJob(input);
    }

};

module.exports = upgrader;