var bodyObj = require('module.bodyTypes');
var modManual ={
  spawn:function(type, tier, room){
    var body = bodyObj.getBody(type, tier);
    //TODO spawn it in the room with an inactive spawner
  }
};
module.exports = modManual;
