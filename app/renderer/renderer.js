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
require(Config.path.renderer_js + 'Utils.js')

function html(){
    Utils.drag_move('#move');
    Utils.unScroll()
    Utils.system_info();
    const {remote} = require("electron")
    let curr_window = remote.getCurrentWindow();

    // console.log($("#red"))
    $("#buttons").on("mousemove", function () {
        // 设置为false 表示不可穿透
        curr_window.setIgnoreMouseEvents(false, {forward: true})
    });

    $("#mtn_run").click(function () {
        // 播放完成后弹出提示
        Utils.msg('准备随机播放动作')
        live2d.getModel(0).startRandomMotion("TapBody", 3, function (e) {
            Utils.msg('动作播放完成')
        })
    });
    $("#next_sence").click(function () {
        log("btn1")
        live2d.nextScene()
    })
    let num = 0.1;
    $("#model_scalc").click(function (e) {
        num += 0.1;
        if (num > 3) {
            num = 1;
        }
        live2d._viewMatrix.scale(num, num)
    })
    $("#text_copy").click((e) => {
        const {clipboard} = require('electron')
        clipboard.writeText('喵喵喵~', 'selection')
        console.log(clipboard.readText('selection'))
        Utils.msg('复制成功')
    })
    $("#danmu").click(function (e) {
        let bulletScreenEngine = new openBSE.BulletScreenEngine(document.getElementById('danmu_div'));
        let _startTime = 1;
        for (var i = 0; i < 10; i++) {
            bulletScreenEngine.addBulletScreen({
                text: "喵喵喵",
                startTime: _startTime
            });
            _startTime += parseInt(Math.random() * 300);
        }

        bulletScreenEngine.play();
    })
}
function loadModel(){
    log('执行成功', 'load');
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
        window.Utils.msg("主人在Chrome访问了:"+arg.title)
    });
    ipcRenderer.on('show_tips', (event, arg) => {

    });
    ipcRenderer.send(RPC.show_main_window);

    live2d.move_hit = function (str) {
        if (str.indexOf('tail')===0){
            window.Utils.msg('摸尾巴')
        }
    }
    live2d.click_hit = function (str) {
        ipcRenderer.sendSync(RPC.focus)
    }
    // live2d.getModel(0).startMotion('TapBody', 1, 3, function () {
    //     log('初始动画执行完成', 'nload')
    // });
}

Promise.all([
    $.getScript(Config.path.app + "/live2d/Core/live2dcubismcore.min.js"),
    $.getScript(Config.path.app + '/live2d/dist/bundle.js'),
    $.getScript(Config.path.renderer_js + 'tip.js')
]).then(() => {
    live2d_onload({
        loadModelComplete() {
            loadModel();
            html();
        },
    })

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
    log('renderer load 100%');
}).catch((e) => {
    log(e)
})