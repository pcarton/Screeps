//Constants for the different creeps' Bodies that auto spawn
//Tier 1
var hBody = [WORK, CARRY, CARRY, MOVE, MOVE];
var uBody = [WORK, CARRY, CARRY, CARRY, MOVE];
var bBody = [WORK, CARRY, WORK, MOVE];
var rBody = [WORK, WORK, CARRY, MOVE];
var miniHaul = [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];

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
var haulerBody = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, CARRY, MOVE, MOVE, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
var feederBody = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK];
var minerBody = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
var u4Body = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
var soldierBody = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK];
//800 energy so that two can spawn at rc5 without refil
var geoMinerBody = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE];
var merchantBody = [MOVE,CARRY];

//TODO Higher tier(s) for lvl 6,7,8

//Tier 5
var u5Body = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
var b5Body = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
var soldierBody = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK];

//Tier 6
var hauler6Body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE];
var feeder6Body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,WORK,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,MOVE];

//Tier 7
var hauler7Body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE];
var feeder7Body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,WORK,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE];
var geoMiner7Body = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE];
var u7Body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];

//NonTiered
var settlerBody = [CLAIM,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];

var costMap = {
  MOVE:50,
  WORK:100,
  CARRY:50,
  ATTACK:80,
  RANGED_ATTACK:150,
  HEAL:250,
  CLAIM:600,
  TOUGH:10
};

//Object that holds a getter for these body types
var bodyObj = {

  calcCost:function(bodyObj){
    var total = 0;
    for(var part in bodyObj){
      switch(part){
        case MOVE, CARRY:
          total = total + 50;
          break;
        case WORK:
          total = total + 100;
          break;
        case ATTACK:
          total = total + 80;
          break;
        case RANGED_ATTACK:
          total = total + 150;
          break;
        case HEAL:
          total = total + 250;
          break;
        case CLAIM:
          total = total + 600;
          break;
        case TOUGH:
          total = total + 10;
          break;
      }
    }
    return total;
  },
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
          case 5:
          case 6:
          case 7:
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
          case 5:
          case 6:
            return u5Body;
          case 7:
            return u7Body;
        }
      }else if(role === 'builder' || role === 'architect'){
        switch(tier){
          default:
            return bBody;
          case 2:
            return b2Body;
          case 3:
          case 4:
            return b3Body;
          case 5:
          case 6:
          case 7:
            return b5Body;
        }
      }else if(role === 'repair'){
        switch(tier){
          default:
            return rBody;
          case 2:
            return r2Body;
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            return r3Body;
        }
      }else if(role === 'hauler'){
        switch(tier){
          default:
            return miniHaul;
          case 4:
          case 5:
            return haulerBody;
          case 6:
          case 7:
            return hauler6Body;
        }
      }else if(role === 'miner'){
        return minerBody;
      }else if(role === 'feeder'){
        switch(tier){
          default:
            return miniHaul;
          case 4:
          case 5:
            return feederBody;
          case 6:
            return feeder6Body;
          case 7:
            return feeder7Body;
        }
      }else if(role === 'soldier'){
        return soliderBody;
      }else if(role === 'geo'){
        switch(tier){
          default:
          case 5:
          case 6:
            return geoMinerBody;
          case 7:
            return geoMiner7Body;
        }
      }else if(role === 'merchant'){
        return merchantBody;
      }else if(role === 'settler'){
        return settlerBody;
      }
  }

};

module.exports = bodyObj;
