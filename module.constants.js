var modConstants = {

  //Function to determine a modifier for the room used to calculate numbers of creeps
  //returns a number between 0 and 3 inclusive
  getConLvlMod:function(room){
    var controllerLvl = room.controller.level;
    return Math.ceil((controllerLvl-1)/3);
  },
  roomEnergyBuffer: 300000,
  structBuffer:1000,
  tier1EnergyMin: 0,
  tier2EnergyMin: 550,
  tier3EnergyMin: 800,
  tier4EnergyMin: 1300,
  tier5EnergyMin: 1800,
  tier6EnergyMin: 2300,
  tier7EnergyMin: 5600,
  spawnFrequency: 30, //in ticks
  maxCreeps: Memory.maxCreeps,
  maxPathCPU: 0.5 ,
  nearDeath:50, //ticks until death
  tier3To4Buffer:5000,
  maxRoomTradeDist: 30,
  searchCooldown: 100,
  minMineralSellType: 0.5,
};

module.exports = modConstants;
