// Basic creep profile. Runs its task to completion or grabs a new one from the queue
// When no task exists, defaults to harvester behavior of mining the nearest accessible source and carrying energy back to the nearest spawn/extension.
// Default behavior checks for new task every drop off

// Has the following memory needs

var task = require('task');

var peon = {
    default: function(creep) {
        creep.say("🫤");
    },

    harvest: function(creep){
        var creeptask = task.getCreepTask(creep);
        if (creeptask.type !== "harvest") {
            creep.say("❓");
            return null;
        }
        var source = Game.getObjectById(creeptask.targetId);
        var dropOff = Game.getObjectById(creeptask.dropOffId);
        if (source == null) {
            creep.say("❓");
            return null;
        }
        if(creep.store.getFreeCapacity() > 0) {
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            if(creep.transfer(dropOff, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropOff);
            }
        }
    },

    upgrade: function(creep) {
        var creeptask = task.getCreepTask(creep);
        if (creeptask.type !== "upgrade") {
            creep.say("❓");
            return null;
        }
        var controller = Game.getObjectById(creeptask.targetId);
        var energySource = Game.getObjectById(creeptask.energySourceId);
        if (energySource == null) {
            creep.say("❓");
            return null;
        }
        if(creep.store.getUsedCapacity() == 0) {
            if(energySource instanceof Source){
                creep.say("⛏︎");
                if(creep.harvest(energySource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energySource);
                }
            }
            else {
                creep.say("📤");
                if(creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energySource);
                }
            }
        }
        else if(creep.saying == "⛏︎" && creep.store.getFreeCapacity() > 0) {
            creep.say("⛏︎");
            if(creep.harvest(energySource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energySource);
            }
        }
        else {
            creep.say("⬆");
            if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
        }
    },

    construct: function(creep) {
        var creeptask = task.getCreepTask(creep);
        if (creeptask.type !== "construct") {
            creep.say("❓");
            return null;
        }
        var targetBuild = Game.getObjectById(creeptask.targetId);
        var energySource = Game.getObjectById(creeptask.energySourceId);
        if (energySource == null || targetBuild == null) {
            creep.say("❓");
            return null;
        }
        if(creep.store.getUsedCapacity() == 0) {
            if(energySource instanceof Source){
                creep.say("⛏︎");
                if(creep.harvest(energySource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energySource);
                }
            }
            else {
                creep.say("📤");
                if(creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energySource);
                }
            }
        }
        else if(creep.saying == "⛏︎" && creep.store.getFreeCapacity() > 0) {
            creep.say("⛏︎");
            if(creep.harvest(energySource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energySource);
            }
        }
        else {
            creep.say("🔧");
            var buildResult = creep.build(targetBuild);
            switch (buildResult){
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(targetBuild);
                    break;
                case ERR_INVALID_TARGET:
                    task.resetCreepTask(creep);
                    creep.say("❓");
                    break;
                case OK:
                    break;
                default:
                    creep.say("❓");
                    break;
            }
        }

    },

    run: function(creep){
        if(!task.getCreepTask(creep)) {
            return this.default(creep);
        }
        switch(task.getCreepTask(creep).type) {
            case "harvest":
                this.harvest(creep);
                break;
            case "upgrade":
                this.upgrade(creep);
                break;
            case "construct":
                this.construct(creep);
                break;
            default:
              this.default(creep);
        }
    }

};

module.exports = peon;