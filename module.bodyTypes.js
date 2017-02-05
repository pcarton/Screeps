//Constants for the different creeps' Bodies that auto spawn
//Tier 1
var hBody = [WORK, CARRY, CARRY, MOVE, MOVE];
var uBody = [WORK, CARRY, CARRY, CARRY, MOVE];
var bBody = [WORK, CARRY, WORK, MOVE];
var rBody = [WORK, WORK, CARRY, MOVE];

//Tier 2
var h2Body = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
var u2Body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
var b2Body = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
var r2Body = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];

//Tier 3
var h3Body = [WORK, WORK, CARRY, CARRY, CARRY, CARRY,CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
var u3Body = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
var b3Body = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
var r3Body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];

//Tier4
var haulerBody = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, CARRY, MOVE, MOVE, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK];
var feederBody = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK];
var minerBody = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE];
var u4Body = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
var soldierBody = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK]; //800 energy so that two can spawn at rc5 without refil
var geoMinerBody = minerBody;
var geoHaulerBody = haulerBody;

//Object that holds a getter for these body types
var bodyObj = {
  //getter that useses a lot of switch statement to return the appropriate body array for the given role and tier
  getBody:function(role,tier){
      if(role==='harvester'){
        switch(tier){
          default:
            return hBody;
          case 2:
            return h2Body;
          case 3:
          case 4:
            return h3Body;
        }
      }else if(role === 'upgrader'){
        switch(tier){
          default:
            return uBody;
          case 2:
            return u2Body;
          case 3:
            return u3Body;
          case 4:
            return u4Body;
        }
      }else if(role === 'builder'){
        switch(tier){
          default:
            return bBody;
          case 2:
            return b2Body;
          case 3:
          case 4:
            return b3Body;
        }
      }else if(role === 'repair'){
        switch(tier){
          default:
            return rBody;
          case 2:
            return r2Body;
          case 3:
          case 4:
            return r3Body;
        }
      }else if(role === 'hauler'){
        return haulerBody;
      }else if(role === 'miner'){
        return minerBody;
      }else if(role === 'architect'){
        return bBody;
      }else if(role === 'feeder'){
        return feederBody;
      }else if(role === 'soldier'){
        return soliderBody;
      }else if(role === 'geoMiner'){
        return geoMinerBody;
      }else if(role === 'geoHauler'){
        return geoHaulerBody;
      }
  }

};

module.exports = bodyObj;
