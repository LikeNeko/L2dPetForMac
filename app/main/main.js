const {
    BrowserWindow,
    Notification,
    globalShortcut,
    webContents
} = require('electron')

global.app = require("electron").app
global.path = require('path')
global.glob = require('glob')
require("./libs/path.js");

global.Config = require('./libs/Config.js')


global.log = require("./libs/log.js")

const {main_window} = require("./main_window.js")
const {menu} = require("./menu.js")

// 这个方法将在完成时被调用
// 初始化，并准备创建浏览器窗口。
// 有些api只能在此事件发生后使用。
app.whenReady().then(() => {
    // 关闭安全警告
    // process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
    loadServers()
    // testNetwork();

    global.main = main_window.createWindow()
    menu.create_menu()

    // 注册快捷键
    globalShortcut.register('CommandOrControl+X', () => {
        webContents.fromId(main.id).openDevTools()
    })
    // 展示一个notify
    // showNotification();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
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


