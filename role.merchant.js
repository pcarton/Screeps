var modCommon = require('module.common');
var modConstants = require('module.constants');
//TODO only check for a new order every so ofter, preferably on low CPU ticks
var roleMerchant = {

  init:function(creep){
    this.assignTerminal(creep);
    this.assignStorage(creep);
    creep.memory.toLoad = {};
    creep.memory.toLoad.amount = 0;
    creep.memory.toLoad.resourceType = RESOURCE_ENERGY;
    creep.memory.orderID = "";
    creep.memory.initialized = true;
  },

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
    return modCommon.whatStore(storage);
  },

  getOrder:function(creep){
    var thisRoom = creep.room.name;
    if(creep.memory.storage === ""){
      this.assignStorage(creep);
    }
    var storageID = creep.memory.storage;
    var resourceType = this.getResourceType(storageID);
    var ordersAll = Game.market.getAllOrders();
    var orders = _.filter(ordersAll, (order) => (order.type === ORDER_BUY) && (order.resourceType === resourceType) && (Game.map.getRoomLinearDistance(order.roomName, thisRoom, true) <= modConstants.maxRoomTradeDist) );
    var sortedOrders = _.sortBy(orders,['price','id','resourceType']);
    if(sortedOrders && sortedOrders.length){
      var order = sortedOrders[0];
      creep.memory.orderID = order.id;
      creep.memory.toLoad.resourceType = order.resourceType;
      creep.memory.toLoad.amount = order.remainingAmount;
    }else{
      creep.memory.orderID = "";
    }

  },

  run:function(creep){
    if(!creep.memory.initialized){
      this.init(creep);
    }
    //Make sure the creep has all necessary ids
    var terminal = creep.room.terminal;
    var storage = creep.room.storage;
    var orderID;
    var order;
    var toLoad = creep.memory.toLoad.amount;

    //Get the objects from their IDs

    if(!creep.memory.orderID || creep.memory.orderID === ""){
      this.getOrder(creep);
    }
    orderID = creep.memory.orderID;
    try{
      order = Game.market.getOrderById(orderID);
    }catch(err){
      console.log(err.name + "\n" + err.message);
      creep.memory.orderID = "";
    }


    //If the order exists
    //TODO trace this code to find infinite fill bug
    var trade = Memory.rooms[creep.room.name].trade;

    var amountInTerm = terminal.store[creep.memory.toLoad.resourceType];
    if(amountInTerm === undefined || amountInTerm === null){
      amountInTerm = 0;
    }

    var amountInCreep = creep.carry[creep.memory.toLoad.resourceType];
    if(amountInCreep === undefined || amountInCreep === null){
      amountInCreep = 0;
    }
    var enInTerm = terminal.store.energy;
    if(trade){
      //If there is a trade in memory, execute it
      if(terminal.cooldown === 0){
        var tradeResult = Game.market.deal(trade.orderId, trade.amount, trade.roomName);
        if(tradeResult != 0){
          //find new order that fits current requirements
        }
      }
    }else if(order){
      //If we are not ready to trade, fill the terminal with the curent order
      if(_.sum(terminal.store)<terminal.storeCapacity){
        if(creep.memory.toLoad.amount > 0){
          if(amountInCreep === 0){
            var getResult = creep.withdraw(storage,creep.memory.toLoad.resourceType);
            if(getResult === ERR_NOT_IN_RANGE){
              modCommon.move(creep,storage);
            }
          }else{
            var putResult = creep.transfer(terminal,creep.memory.toLoad.resourceType, amountInCreep);
            if(putResult === ERR_NOT_IN_RANGE){
              modCommon.move(creep,terminal);
            }else if(putResult === OK){
              creep.memory.toLoad.amount = creep.memory.toLoad.amount - amountInCreep;
            }
          }
          //get the resource / put in terminal
          //decrement amount when inserted into terminal
        }else if(amountInTerm >= order.remainingAmount){
          var cost = Game.market.calcTransactionCost(order.remainingAmount, order.roomName,creep.room.name);
          if(cost <= enInTerm){
            trade = {};
            trade.orderId = orderID;
            trade.amount = order.remainingAmount;
            trade.roomName = creep.room.name;
          }else{
            creep.memory.toLoad.amount = cost - enInTerm;
            creep.memory.toLoad.resourceType = RESOURCE_ENERGY;
          }
        }
      }else{
        trade = {};
        trade.orderId = orderID;
        trade.amount = amountInTerm;
        trade.roomName = creep.room.name;
      }
    }else{
      //if no trade or order, get an order to work on
      this.getOrder(creep);
    }
    Memory.rooms[creep.room.name].trade = trade;

  }

};

module.exports = roleMerchant;
