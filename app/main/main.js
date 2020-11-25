console.log('~~~开始加载程序~~~')
const {
    app,
    Notification,
    globalShortcut,
} = require('electron')
global.path = require('path')
global.glob = require('glob')

// 初始化 ele 的app
global.app = app

// 引入path地址
require("./libs/path.js");

// 页面与服务交互RPC接口定义
global.RPC = require(path.app + '/app/RPC.js').RPC;

// 全局默认配置
global.Config = require('./libs/Config.js')

// 引入窗口创建类
const {main_window} = require("./main_window.js")
const {menu} = require("./menu.js")
global.log = console.log

// 全局hook
global.HookCore = require("./libs/HookCore.js");
global.LowDB = require("./libs/db/LowDB.js").LowDB;

global.db = new LowDB();

require("./request.js");

class AppDelegate {
    constructor() {
    }

    loading() {
        global.loading_window = main_window.createLoadingWindow()
    }

    loadServers() {
        // ipc接口服务
        require(path.join(path.main_loads, 'IpcMainServer.js'))
        // websocket服务
        require(path.join(path.main_loads, 'WebSocket.js'))
    }

    mainWindow() {
        global.curr_window =  global.main = main_window.createWindow()
    }

    mainMenu() {
        menu.create_menu();
    }

    appShortcuts() {
        globalShortcut.register('CommandOrControl+P', () => {
            main.webContents.send(RPC.is_debug, {state: 1})
            main_window.showAllDevTools({})
        })
    }
}

// 这个方法将在完成时被调用
// 初始化，并准备创建浏览器窗口。
// 有些api只能在此事件发生后使用。
app.whenReady().then(() => {
    let delegate = new AppDelegate();

    // 关闭安全警告
    // process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
    delegate.loading()

    // 加载一些服务
    delegate.loadServers()

    // 创建主视图
    delegate.mainWindow()
    // 创建menu
    delegate.mainMenu()

    // 注册快捷键
    delegate.appShortcuts()
    // 展示一个notify
    let obj = new Notification({
        title: "喵喵喵~",
        body: "专属live2d系统启动成功~~"
    })
    obj.show();

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


// 在这个文件中，你可以包含应用程序的主进程的其他部分代码
// 您还可以将它们放在单独的文件中，并在这里使用它们。


