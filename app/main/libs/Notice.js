const { Notification } = require('electron')


// 测试弹出通知
class Notice {
    constructor() {
        log("初始化",'Notif')
    }
    static show(title,desc = ''){
        let obj = new Notification({
            title: title,
            body: title,
        })
        obj.show();
    }

}
module.exports = {
    Notice
}