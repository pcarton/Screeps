var modCommon = require('module.common');
var roleMerchant = {

  assignTerminal:function(creep){
    var terminal = creep.room.terminal;
    creep.memory.terminal = terminal.id;
  },

  assignStorage:function(creep){
    var storage = creep.room.storage;
    creep.memory.storage = storage.id;
  },

  getResourceType:function(storageID){
    var storage = Game.getObjectById(storageID);
    return whatStore(storage);
  },

  getOrder:function(creep){
    var thisRoom = creep.room.name;
    if(creep.memory.storage === ""){
      this.assignStorage(creep);
    }
    var storageID = creep.memory.storage;
    var resourceType = this.getResourceType(storageID);
    var orders =Game.market.getAllOrders({
      filter: (order) => order.type === "buy" && order.resourceType === resourceType && Game.getRoomLinearDistance(order.roomName, thisRoom, true) <= 30
      //TODO && priceDecent
    });
    var sortedOrders = _.sortBy(orders,['price','id']);
    if(sortedOrders){
      var order = sortedOrders[0];
      creep.memory.currentOrder = order[1];
    }else{
      creep.memory.currentOrder = "";
    }

  },

  run:function(creep){
    //Make sure the creep has all necessary ids
    var terminal;
    var storage;
    var orderID;
    var order;
    var toLoad = Memory.toTrade.amount;

    if(creep.memory.terminal === ""){
      this.assignTerminal(creep);
    }
    try{
      terminal = Game.getObjectById(creep.memory.terminal);
    }catch(err){
      console.log(err.name + "\n" + err.message);
    }


    if(creep.memory.storage === ""){
      this.assignStorage(creep);
    }
    try{
      storage = Game.getObjectById(creep.memory.storage);
    }catch(err){
      console.log(err.name + "\n" + err.message);
    }

    if(creep.memory.currentOrder === ""){
      this.getOrder(creep);
    }
    try{
      orderID = creep.memory.currentOrder;
      order = Game.market.getOrderById(orderID);
    }catch(err){
      console.log(err.name + "\n" + err.message);
    }

    if(order){
      if(order.remainingAmount<toLoad){
        toLoad = order.remainingAmount;
      }

      var resourceType = order.resourceType;
      if(toLoad>0){
        if(_.sum(creep.carry) > 0 && modCommon.whatCarry(creep) === resourceType){
          //put the resource in the terminal and decrease toLoad
          if(creep.transfer(terminal, resourceType) == ERR_NOT_IN_RANGE) {
            modCommon.move(creep,terminal.pos);
          }
        }else if(modCommon.whatCarry(creep) !== resourceType){
          //Store what it is carrying in storage
          if(creep.transfer(storage, modCommon.whatCarry(creep)) == ERR_NOT_IN_RANGE) {
            modCommon.move(creep,storage.pos);
          }
        }else{
          //get resource from storage
          if(creep.withdraw(storage, resourceType) == ERR_NOT_IN_RANGE) {
            modCommon.move(creep,storage.pos);
          }
        }
      }else{
        var amountToTrade = modCommon.getResourceCount(terminal.store, resourceType); //the amount of resource to trade, get the amount in the terminal
        var energyInTerminal = modCommon.getResourceCount(terminal.store, RESOURCE_ENERGY); //amount of energy in the terminal
        var energyCost = Game.market.calcTransactionCost(amountToTrade, creep.room.name, order.roomName);

        if(energyCost<=energyInTerminal){
          //if enough energy to do transaction, do it
          Game.market.deal(orderID,amountToTrade,creep.room.name);
          if(order.remainingAmount===0){
            this.getOrder(creep);
          }
          creep.memory.toLoad = 1000;
        }else{
          //else fill with energy
          if(creep.carry.energy>0){
            if(creep.transfer(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              modCommon.move(creep,terminal.pos);
            }
          }else{
            if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              modCommon.move(creep,storage.pos);
            }
          }
        }
      }

    //TODO keep track of toLoad and put that much in the terminal
    //If toTrade.amount == 0, calculate energy needed from terminal and fill with that
    }
  }

};

module.exports = roleMerchant;
