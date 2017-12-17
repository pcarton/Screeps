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
    var rawMinerals = [RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_LEMERGIUM, RESOURCE_KEANIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST, RESOURCE_GHODIUM];
    if (creep.memory.searchCooldown > 0 ){
      return;
    }
    var thisRoom = creep.room.name;
    var resourceType = Game.rooms[thisRoom].find(FIND_MINERALS)[0].mineralType;
    if(rawMinerals.indexOf(resourceType)<0){
      resourceType = modCommon.whatStore(creep.room.terminal);
    }
    if(rawMinerals.indexOf(resourceType)<0){
      creep.memory.orderID = "";
      creep.memory.searchCooldown = modConstants.searchCooldown;
      return;
    }
    var ordersAll = Game.market.getAllOrders();
    var orders = _.filter(ordersAll, (order) => (order.type === ORDER_BUY) && (order.resourceType === resourceType) && (Game.map.getRoomLinearDistance(order.roomName, thisRoom, true) <= modConstants.maxRoomTradeDist) && (order.remainingAmount >=100) && (order.price >= modConstants.minMineralSellType));
    var sortedOrders = _.sortBy(orders,['price','id','resourceType']);
    if(sortedOrders && sortedOrders.length >0 ){
      var order = sortedOrders[0];
      creep.memory.orderID = order.id;
      creep.memory.toLoad.resourceType = order.resourceType;
      if(creep.room.terminal.store[order.resourceType]){
        creep.memory.toLoad.amount = order.remainingAmount - creep.room.terminal.store[order.resourceType];
      }else{
        creep.memory.toLoad.amount = order.remainingAmount;
      }
    }else{
      creep.memory.orderID = "";
      creep.memory.searchCooldown = modConstants.searchCooldown;
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

    if (creep.memory.searchCooldown > 0 ){
      creep.memory.searchCooldown = creep.memory.searchCooldown - 1;
    }

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

    var amountInTerm = 0;
    if(order){
        amountInTerm =  terminal.store[order.resourceType];
    }
    if(amountInTerm === undefined || amountInTerm === null){
      amountInTerm = 0;
    }

    var amountInCreep = creep.carry[creep.memory.toLoad.resourceType];
    if(amountInCreep === undefined || amountInCreep === null){
      amountInCreep = 0;
    }
    var enInTerm = terminal.store.energy;
    if(trade && trade.amount && trade.orderId && trade.roomName){
      //If there is a trade in memory, execute it
      if(terminal.cooldown === 0){
        var tradeResult = Game.market.deal(trade.orderId, trade.amount, trade.roomName);
        if(tradeResult != OK){
          //find new order that fits current requirements
        }else{
          trade = {};
        }
        creep.memory.toLoad = {};
        creep.memory.orderID = "";
      }
    }else if(order){
      //If we are not ready to trade, fill the terminal with the curent order
      if(_.sum(terminal.store)<terminal.storeCapacity){
        if(creep.memory.toLoad.amount > 0){
          if(amountInCreep === 0){
            var getResult = creep.withdraw(storage,creep.memory.toLoad.resourceType);
            if(getResult === ERR_NOT_IN_RANGE){
              modCommon.move(creep,storage);
            }if(getResult === ERR_NOT_ENOUGH_RESOURCES){
              creep.memory.toLoad.amount = 0;
            }
          }else{
            var putResult = creep.transfer(terminal,creep.memory.toLoad.resourceType, amountInCreep);
            if(putResult === ERR_NOT_IN_RANGE){
              modCommon.move(creep,terminal);
            }else if(putResult === OK){
              creep.memory.toLoad.amount = creep.memory.toLoad.amount - amountInCreep;
              creep.say(creep.memory.toLoad.amount+":"+creep.memory.toLoad.resourceType);
            }
          }
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
        }else if(amountInTerm > 0){
          var cost2 = Game.market.calcTransactionCost(amountInTerm, order.roomName,creep.room.name);
          if(cost2 <= enInTerm){
            trade = {};
            trade.orderId = orderID;
            trade.amount = amountInTerm;
            trade.roomName = creep.room.name;
          }else{
            creep.memory.toLoad.amount = cost2 - enInTerm;
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
