const {Volume}=require("../libs/Volume.js")

const {CronJob} = require('cron');

let job = new CronJob('0 9,23 * * 1-6', function() {
    // 每天9点和23点 周1至周六
    Volume.setOutput(0);
}, null, true, 'Asia/Shanghai');

let job1 = new CronJob('30 11,17 * * 1-6', function() {
    let {dialog}=require('electron');

    dialog.showMessageBox({
        type:'info',
        title: '订饭啦',
        message: '订饭订饭订饭订饭订饭',
        buttons:['ok','cancel']
    },(index) => {
        if ( index == 0 ) {
            console.log('You click ok.');
        } else {
            console.log('You click cancel');
        }
    })
}, null, true, 'Asia/Shanghai');
job.start();
job1.start();
