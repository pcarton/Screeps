//variables for the different creeps that auto spawn
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
var haulerBody = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
var minerBody = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE];

var bodyObj = {
  getBody:function(type,tier){
      if(type==='harvester'){
        switch(tier){
          default:
            return hBody;
          case 2:
            return h2Body;
          case 3:
            return h3Body;
        }
      }else if(type === 'upgrader'){
        switch(tier){
          default:
            return uBody;
          case 2:
            return u2Body;
          case 3:
            return u3Body;
        }
      }else if(type === 'builder'){
        switch(tier){
          default:
            return bBody;
          case 2:
            return b2Body;
          case 3:
            return b3Body;
        }
      }else if(type === 'repair'){
        switch(tier){
          default:
            return rBody;
          case 2:
            return r2Body;
          case 3:
            return r3Body;
        }
      }else if(type === 'hauler'){
        return haulerBody;
      }else if(type === 'miner'){
        return minerBody;
      }else if(type === 'architect'){
        return bBody;
      }
  }

};

module.export = bodyObj;
