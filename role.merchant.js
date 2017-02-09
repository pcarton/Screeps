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
    var toLoad = Memory.toTrade.amount;

    if(creep.memory.terminal === ""){
      this.assignTerminal(creep);
      terminal = Game.getObjectById(creep.memory.terminal);
    }
    if(creep.memory.storage === ""){
      this.assignStorage(creep);
      storage = Game.getObjectById(creep.memory.storage);
    }
    if(creep.memory.currentOrder === ""){
      this.getOrder(creep);
      orderID = creep.memory.currentOrder;
    }

    var order = Game.market.getOrderById(orderID);
    if(order){
      if(order.remainingAmount<toLoad){
        toLoad = order.remainingAmount;
      }

      var resourceType = order.resourceType;
      if(toLoad>0){
        if(_.sum(creep.carry) > 0 && modCommon.whatCarry(creep) === resourceType){
          //put the resource in the terminal and decrease toLoad
        }else if(modCommon.whatCarry(creep) !== resourceType){
          //Store what it is carrying in storage
        }else{
          //get resource from storage
        }
      }else{
        //if enough energy to do transaction, do it
        //else fill with energy
      }
    }

    //TODO keep track of toLoad and put that much in the terminal
    //If toTrade.amount == 0, calculate energy needed from terminal and fill with that
  }

};

module.exports = roleMerchant;
