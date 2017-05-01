var modCommon = require('module.common');
//TODO only check for a new order every so ofter, preferably on low CPU ticks
var roleMerchant = {

  init:function(creep){
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
    var orders = _.filter(ordersAll, (order) => (order.type === ORDER_BUY) && (order.resourceType === resourceType) && (Game.map.getRoomLinearDistance(order.roomName, thisRoom, true) <= 30) );
    var sortedOrders = _.sortBy(orders,['price','id','resourceType']);
    if(sortedOrders && sortedOrders.length){
      var order = sortedOrders[0];
      creep.memory.orderID = order.id;
      creep.memory.toLoad.resourceType = order.resourceType;
    }else{
      creep.memory.orderID = "";
    }

  },

  run:function(creep){
    if(!creep.memory.initialized){
      this.init(creep);
    }
    //Make sure the creep has all necessary ids
    var terminal;
    var storage;
    var orderID;
    var order;
    var toLoad = creep.memory.toLoad.amount;

    //Get the objects from their IDs
    if(!creep.memory.terminal || creep.memory.terminal === ""){
      this.assignTerminal(creep);
    }
    try{
      terminal = Game.getObjectById(creep.memory.terminal);
    }catch(err){
      console.log(err.name + "\n" + err.message);
    }

    if(!creep.memory.storage || creep.memory.storage === ""){
      this.assignStorage(creep);
    }
    try{
      storage = Game.getObjectById(creep.memory.storage);
    }catch(err){
      console.log(err.name + "\n" + err.message);
    }

    if(!creep.memory.orderID || creep.memory.orderID === ""){
      this.getOrder(creep);
    }
    try{
      orderID = creep.memory.orderID;
      order = Game.market.getOrderById(orderID);
    }catch(err){
      console.log(err.name + "\n" + err.message);
    }


    //If the order exists
    //TODO trace this code to find infinite fill bug
    if(order){

      //Check that we do not overfill the terminal
      if(order.remainingAmount<toLoad){
        toLoad = order.remainingAmount;
      }


      //Get the type of resource we need to handle
      if(toLoad === 0 && modCommon.getResourceCount(terminal.store, resourceType) <= 1000){
        toLoad = 1000;
      }
      
      var resourceType = creep.memory.toLoad.resourceType;

      //If there are still resources to load
      if(toLoad>0 || modCommon.getResourceCount(storage.store, resourceType) === 0){
        if(_.sum(creep.carry) > 0 && modCommon.whatCarry(creep) == resourceType){
          //put the resource in the terminal and decrease toLoad
          var tryTransfer = creep.transfer(terminal, resourceType);
          if( tryTransfer == ERR_NOT_IN_RANGE) {
            modCommon.move(creep,terminal.pos);
          }
          else if( tryTransfer === OK){
            toLoad = toLoad - creep.carryCapacity;
          }
        }else if(_.sum(creep.carry) > 0 && modCommon.whatCarry(creep) !== resourceType){
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
      //If the resources have been loaded
      }else{
        var amountToTrade = Math.min(modCommon.getResourceCount(terminal.store, resourceType), order.remainingAmount); //the amount of resource to trade
        var energyInTerminal = modCommon.getResourceCount(terminal.store, RESOURCE_ENERGY); //amount of energy in the terminal
        var energyCost = Game.market.calcTransactionCost(amountToTrade, creep.room.name, order.roomName);

        if(energyCost<=energyInTerminal){
          //if enough energy to do transaction, do it
          var dealSuccess = Game.market.deal(orderID,amountToTrade,creep.room.name);
          if(dealSuccess == OK){
            if(order.remainingAmount === 0){
              this.getOrder(creep);
            }
            toLoad = 1000;
          }else{
            console.log("Error "+ dealSuccess +" on deal.");
          }
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

    }else{
      this.getOrder(creep);
    }
    creep.memory.toLoad.amount = toLoad;
  }

};

module.exports = roleMerchant;
