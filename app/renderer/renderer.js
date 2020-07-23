// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
// 这个文件是渲染进程里最最开始执行的代码，如果有比它还前的，那一定是preload.js,否则什么情况下不论引入顺序都是这个文件最先执行
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

    function getCallerFileNameAndLine() {
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
    console.log(`%c[${time}]${getCallerFileNameAndLine()}[${tag}]`, "text-shadow: 0px 0px 1px red", any);
}

// 获取app的配置项
const {ipcRenderer,remote} = require('electron')
window.RPC = remote.getGlobal('RPC');
window.Config = ipcRenderer.sendSync(RPC.config);

// 引入jquery
window.$ = window.jQuery = require(Config.path.renderer_js + "jq.js");
require(Config.path.renderer_js + "extends/promise.js")
require(Config.path.renderer_js + 'openBSE.all.js');

Promise.all([
    $.getScript(Config.path.app + "/live2d/Core/live2dcubismcore.min.js"),
    $.getScript(Config.path.app + '/live2d/dist/bundle.js'),
    // 低配弹幕
    // var item={
    //    img:'static/heisenberg.png', //图片
    //    info:'弹幕文字信息', //文字
    //    href:'http://www.yaseng.org', //链接
    //    close:true, //显示关闭按钮
    //    speed:8, //延迟,单位秒,默认8
    //    bottom:70, //距离底部高度,单位px,默认随机
    //    color:'#fff', //颜色,默认白色
    //    old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色
    //  }
    // $('body').barrager(item);
    // delete
    //  $.fn.barrager.removeAll();
    // $.getScript(Config.path.renderer_js + 'jquery.barrager.js'),
    // 高配弹幕
    // var bulletScreenEngine = new openBSE.BulletScreenEngine(document.getElementById('BulletScreensDiv'));
    // var _startTime = 5000;
    // for (var i = 0; i < 10000; i++) {
    //     bulletScreenEngine.addBulletScreen({
    //         text: "这是一个长长长长长长长长长长长长长长长长长长长长长长长长的测试(^_^)",
    //         startTime: _startTime
    //     });
    //     _startTime += parseInt(Math.random() * 300);
    // }
    // bulletScreenEngine.play();
    $.getScript(Config.path.renderer_js + 'tip.js')
]).then(() => {
    live2d_onload()

    if (Config.debug){
        ipcRenderer.on(RPC.is_debug,function (event, args) {
            if (args.state){
                $("#buttons")[0].style.display = 'flex';
                $("#debug_info")[0].style.display = 'block';
            }else{
                $("#buttons")[0].style.display = 'none';
                $("#debug_info")[0].style.display = 'none';
            }
        })
    }
}).catch((e) => {
    log(e)
})


ipcRenderer.on('show_tips', (event, arg) => {

});

// 加载
window.nload = function () {
    log('执行成功', 'nload');
    live2d._viewMatrix.scale(0.8, 0.8)

    ipcRenderer.on(RPC.show_mtn, (event, arg) => {
        live2d.getModel(0).startRandomMotion("TapBody", 3);
        log("播放特效", '特效')
    });
    ipcRenderer.on(RPC.mail, (event, arg) => {
        if (live2d) {
            live2d.getModel(0).startMotion("TapBody", 0, 3);
        }
        $("#debug_info").append(`<li>mail:${arg.title}</li>`)
        console.log(arg.title)
    });
    ipcRenderer.on(RPC.chrome_history, (event, arg) => {
        if (live2d) {
            live2d.getModel(0).startMotion("TapBody", 0, 3);
        }
        $("#debug_info").append(`<li>chrome:${arg.title}-visit:${arg.visit_count}</li>`)
        console.log(arg.title)
        Utils.msg("主人在Chrome访问了:"+arg.title)
    });
    live2d.move_hit = function (str) {
        console.log(str,'move');
    }
    live2d.click_hit = function (str) {
        console.log(str,'click');
        ipcRenderer.sendSync(RPC.focus)
    }
    // live2d.getModel(0).startMotion('TapBody', 1, 3, function () {
    //     log('初始动画执行完成', 'nload')
    // });
}
log('renderer load 100%');