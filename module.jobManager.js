var JobManager = {
    doJob(creep, job){
        if(!job.partsRequired.every(val => creep.body.includes(val))){
            creep.memory.job = null
          }else{
            if(creep.pos.inRangeTo(job.target,job.range)){
              job.action(creep, target)
            }else{
              creep.moveTo(target)
            }
            if(job.endCondition(creep)){
              creep.memory.job = null
            }
          }
    },

    findNeededJobs(roomName){
      const jobQueue = memoryModule.getJobQueue(roomName);
      const creeps = Game.rooms[roomName].find(FIND_MY_CREEPS);
      const creepJobs = this.getAllJobs(creeps);

      var allJobs = jobQueue.concat(creepJobs);
    },

    getAllJobs(creepList){
      var jobs = [];
      for(var creep in creepList){
        job = creep.memory.job;
        if(job){
          jobs.push(job);
        }
      }
      return jobs;
    }
  
};
  
module.exports = JobManager;
  