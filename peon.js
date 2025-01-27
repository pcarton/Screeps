// Basic creep profile. Runs its task to completion or grabs a new one from the queue
// When no task exists, defaults to harvester behavior of mining the nearest accessible source and carrying energy back to the nearest spawn/extension.
// Default behavior checks for new task every drop off

// Has the following memory needs

var task = require('task');
var common = require('common');

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
            creep.say("⛏︎");
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            creep.say("📦");
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
        if (energySource == null) {
            creep.say("❓");
            return null;
        }
        if(creep.store.getUsedCapacity() == 0) { // Moves this logic to a common getEnergy function for non-harvesters
            if(energySource instanceof Source){
                var energyPickupLocations = common.getEnergyPickupLocations(creep.room.name);
                if ((energyPickupLocations && energyPickupLocations.length > 0 && !(energyPickupLocations[0] instanceof Source))){
                    var sources = common.getEnergyPickupLocations(creep.room.name);
                    var newSource = creep.pos.findClosestByPath(sources);
                    task.updateConstructSource(creep.name,newSource.id);
                }
                creep.say("⛏︎");
                if(creep.harvest(energySource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energySource);
                }
            }
            else {
                creep.say("📤");
                var withdrawResult = creep.withdraw(energySource, RESOURCE_ENERGY);
                switch (withdrawResult) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(energySource);
                        break;
                    case ERR_NOT_ENOUGH_RESOURCES:
                        var sources = common.getEnergyPickupLocations(creep.room.name);
                        var newSource = creep.pos.findClosestByPath(sources);
                        task.updateConstructSource(creep.name,newSource.id);
                    case OK:
                        break;
                    default:
                        creep.say("❓");
                        break;
                }
            }
        }
        else if(creep.saying == "⛏︎" && creep.store.getFreeCapacity() > 0) { // Moves this logic to a common getEnergy function for non-harvesters
            creep.say("⛏︎");
            if(creep.harvest(energySource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energySource);
            }
        }
        else {
            creep.say("🛠︎");
            var buildResult = creep.build(targetBuild);
            switch (buildResult){
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(targetBuild);
                    break;
                case ERR_INVALID_TARGET:
                    task.resetCreepTask(creep);
                    creep.say("☑︎");
                    break;
                case OK:
                    break;
                default:
                    creep.say("❓");
                    break;
            }
        }

    },

    haul: function(creep) {
        var creeptask = task.getCreepTask(creep);
        if (creeptask.type !== "haul") {
            creep.say("❓");
            return null;
        }
        var dropOff = Game.getObjectById(creeptask.targetId);
        var pickUp = Game.getObjectById(creeptask.energySourceId);
        if (pickUp == null || dropOff == null) {
            creep.say("❓");
            return null;
        }
        if(creep.store.getUsedCapacity() == 0) {
            creep.say("📤");
            var withdrawResult = creep.withdraw(pickUp, RESOURCE_ENERGY);
            switch (withdrawResult) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(pickUp);
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    var sources = common.getEnergyPickupLocations(creep.room.name);
                    var newSource = creep.pos.findClosestByPath(sources);
                    task.updateConstructSource(creep.name,newSource.id);
                case OK:
                    break;
                default:
                    creep.say("❓");
                    break;
            }
        }
        else {
            creep.say("📦");
            var dropOffResult = creep.transfer(dropOff, RESOURCE_ENERGY);
            switch (dropOffResult){
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(dropOff);
                    break;
                case ERR_FULL:
                    if (creeptask.spawnDuty) {
                        var structures = creep.room.find(FIND_STRUCTURES);
                        var newDropOffList = _.filter(structures, function (structure) {
                            return ( structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && (structure.energy < structure.energyCapacity);
                        });
                        if(newDropOffList.length > 0) {
                            var closestDropOffId = creep.pos.findClosestByPath(newDropOffList).id
                            task.updateHaulTarget(creep.name,closestDropOffId);
                        }
                    }
                    break;
                case ERR_INVALID_TARGET:
                     task.resetCreepTask(creep);
                     break;
                case OK:
                    creep.say("📥");
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
            case "haul":
                this.haul(creep);
                break;
            default:
              this.default(creep);
        }
    }

};

module.exports = peon;