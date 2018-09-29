var modUtil = {

  runCreep: function(creep){
    var job = creep.memory.job;
    if(job){
      if(creep.pos - job.target.pos <= 1){
        job.action(creep, target)
      }else{
        creep.moveTo(target)
      }
      if(job.endCondition(creep)){
        creep.memory.job = null
      }
    }
   
  },

};

module.exports = modUtil;
