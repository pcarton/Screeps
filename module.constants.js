//TODO put all of the constants that apply globally here

var modConstants = {

  //Function to determine a modifier for the room used to calculate numbers of creeps
  //returns a number between 0 and 3 inclusive
  getConLvlMod:function(room){
    var controllerLvl = room.controller.level;
    return Math.ceil((controllerLvl-1)/3);
  },
  roomEnergyBuffer: 300000,
  structBuffer:1000



};

module.exports = modConstants;