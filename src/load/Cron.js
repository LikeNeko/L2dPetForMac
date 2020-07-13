const {Volume}=require("../Volume")

const {CronJob} = require('cron');
require("../Volume.js")
let job = new CronJob('0 9,23 * * 1-6', function() {
    // 每天9点和23点 周1至周六
    Volume.setOutput(0);
}, null, true, 'Asia/Shanghai');
job.start();
