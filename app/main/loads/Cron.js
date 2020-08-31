const {CronJob} = require('cron');

let other_cron = require(path.app+"/plugins/cron/system.js");

function cron_job(time, call) {
    let job = new CronJob(time, call, null, true, 'Asia/Shanghai');
    job.start()
}
console.log(other_cron)
for (let i = 0; i < other_cron.length; i++) {
    cron_job(other_cron[i].time,other_cron[i].call)
}

