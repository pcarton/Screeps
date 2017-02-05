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
  getOrder:function(){
    var orders =Game.market.getAllOrders({
      filter: (order) => order.type === "buy" //TODO && close && priceDecent && resourceHave
    });
    //TODO sort array by best price
    if(orders){
      var order = orders[0];
      creep.memory.currentOrder = order.id;
    }else{
      creep.memory.currentOrder = "";
    }

  },

  run:function(creep){

  }

};

module.exports = roleMerchant;
