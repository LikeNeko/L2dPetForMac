// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
// 这个文件是渲染进程里最最开始执行的代码，如果有比它还前的，那一定是preload.js,否则什么情况下不论引入顺序都是这个文件最先执行
// 引入jquery
window.$ = window.jQuery = require("./js/jq");
const {ipcRenderer} = require('electron')
// 获取app的配置项
window.Config = ipcRenderer.sendSync('config');

// 引入log方法
window.log = function (any, tag = "debug") {
    let gettime = function () {
        let now = new Date();
        let nowTime = now.toLocaleString();
        let date = nowTime.substring(0, 10);//截取日期
        let time = nowTime.substring(10, 20); //截取时间
        let week = now.getDay(); //星期
        let hour = now.getHours(); //小时
        return date + time;
    }
    function getCallerFileNameAndLine(){
        function getException() {
            try {
                throw Error('');
            } catch (err) {
                return err;
            }
        }


        const err = getException();

        const stack = err.stack;
        const stackArr = stack.split('\n');
        let callerLogIndex = 0;
        for (let i = 0; i < stackArr.length; i++) {
            if (stackArr[i].indexOf('window.log') > 0 && i + 1 < stackArr.length) {
                callerLogIndex = i + 1;
                break;
            }
        }

        if (callerLogIndex !== 0) {
            const callerStackLine = stackArr[callerLogIndex];
            return `[${callerStackLine.substring(callerStackLine.lastIndexOf("/") + 1, callerStackLine.lastIndexOf(':'))}]`;
        } else {
            return '[-]';
        }
    }
    let time = gettime()
    console.log(`%c[${time}][${tag}]${getCallerFileNameAndLine()}`, "text-shadow: 0px 0px 1px red", any);
}

ipcRenderer.on('show_tips', (event, arg) => {

});

// 加载
window.nload = function () {
    log('执行成功', 'nload');
    live2d._viewMatrix.scale(0.8,0.8)

    ipcRenderer.on('show_mtn', (event, arg) => {
        live2d.getModel(0).startRandomMotion("TapBody",3);
        log("播放特效",'特效')
    });
    ipcRenderer.on('mail', (event, arg) => {
        if (live2d){
            live2d.getModel(0).startMotion("TapBody",0,3);
        }
        $("#debug_info").append(`<li>mail:${arg.title}</li>`)
        console.log(arg.title)
    });
    // live2d.getModel(0).startMotion('TapBody', 1, 3, function () {
    //     log('初始动画执行完成', 'nload')
    // });
}
log('renderer load 100%');