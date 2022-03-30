const { Notification } = require('electron')


// 测试弹出通知
class Notice {
    constructor() {
    }
    static show(title,desc = ''){
        let obj = new Notification({
            title: title,
            body: desc,
        })
        obj.show();
    }

}
module.exports = {
    Notice
}