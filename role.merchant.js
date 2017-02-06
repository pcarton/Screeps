var modCommon = require('module.common');
var roleMerchant = {

  assignTerminal:function(creep){
    var terminal = creep.pos.findClosestByRange(FIND_STRUCTURES,{
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_STORAGE);
      }
    });
    creep.memory.terminal = terminal.id;
  },

  assignStorage:function(creep){
    var storage = creep.pos.findClosestByRange(FIND_STRUCTURES,{
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_STORAGE);
      }
    });
    creep.memory.storage = storage.id;
  },

  getResourceType:function(storageID){
    var storage = Game.getObjectById(storageID);
    return whatStore(storage);
  },

  getOrder:function(creep){
    if(creep.memory.storage === ""){
      this.assignStorage(creep);
    }
    var storageID = creep.memory.storage;
    var resourceType = this.getResourceType(storageID);
    var orders =Game.market.getAllOrders({
      filter: (order) => order.type === "buy" && order.resourceType === resourceType
      //TODO && close && priceDecent
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

  }

};

module.exports = roleMerchant;
