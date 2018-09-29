var jobManager = require('./module.jobManager.js');
var utilityModule = {

  runCreep: function(creep){
    var job = creep.memory.job;
    if(job){
      jobManager.doJob(creep,job);
    }
  },

};

module.exports = utilityModule;
