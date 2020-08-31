const {
    app,
    Notification,
    globalShortcut,
} = require('electron')

global.Chrome = new (require('./libs/ChromeRealTimeSync.js').ChromeHistory)();
let path = require("path")
let fs = require("fs")

global.app = require("electron").app
global.path = require('path')
global.glob = require('glob')
require("./libs/path.js");
global.RPC = require(path.app + '/app/RPC.js').RPC;

global.Config = require('./libs/Config.js')

global.log = require("./libs/log.js")

const {main_window} = require("./main_window.js")
const {menu} = require("./menu.js")

global.HookCore = require("./libs/HookCore.js");

require("./request.js");

// 这个方法将在完成时被调用
// 初始化，并准备创建浏览器窗口。
// 有些api只能在此事件发生后使用。
app.whenReady().then(() => {
    // 关闭安全警告
    // process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
    global.loading_window = main_window.createLoadingWindow()

    loadServers()
    // testNetwork();
    Chrome.begin();

    global.main = main_window.createWindow()
    menu.create_menu();


    // 注册快捷键
    let is_debug = Config.debug;
    globalShortcut.register('CommandOrControl+P', () => {
        if (is_debug){
            is_debug = false;
            main.webContents.send(RPC.is_debug,{state:0})
            main_window.closeAllDevTools()
        }else {
            is_debug = true;
            main.webContents.send(RPC.is_debug,{state:1})
            main_window.showAllDevTools()
        }
    })
    // 展示一个notify
    // showNotification();

    app.on('activate', function () {
        // 在macOS上，重新创建一个窗口是很常见的
        // 点击dock图标，没有其他窗口打开。
        // if (BrowserWindow.getAllWindows().length === 0) main_window.createWindow()
    })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})


// 循环引入js
function loadServers() {
    const files = glob.sync(path.join(path.main_loads, '*.js'))
    files.forEach((file) => {
        require(file)
    })
}

// 测试弹出通知
function showNotification() {
    setTimeout(function () {
        let obj = new Notification({
            title: "喵喵喵~",
            body: "body"
        })
        obj.show();
    }, 4000)
}


// 在这个文件中，你可以包含应用程序的主进程的其他部分代码
// 您还可以将它们放在单独的文件中，并在这里使用它们。


