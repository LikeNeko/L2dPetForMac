const {ipcMain} = require("electron");

/**
 * 管理应用生命周期类
 */
class Main {
    constructor() {
        // 启动应用加载越少越好
        console.log('启动')
        const {app, Notification, globalShortcut} = require('electron')
        global.app = app;
        global.Notification = Notification;
        global.globalShortcut = globalShortcut;
        console.log('当前版本号', app.getVersion())

        // 可以异步初始化的东西
        this.init_async()

        // 启动应用
        app.whenReady()
            .then(this.init)
            .then(this.start);

    }

    /**
     * 异步加载
     */
    init_async() {
        setTimeout(function () {
            // 初始化全局事件监听
            const ev = require("events");
            global.events = new ev();

            // 初始化持久化缓存
            const Store = require('electron-store');
            global.store = new Store()

            // 加载初始化配置
            store.set({
                version: global.app.getVersion(),
                listen_mail: {
                    on: false,
                    username: "shibao@litemob.com",
                    password: "Neko123",
                    host: "imap.exmail.qq.com",
                    port: 993,
                }
            })

            if (store.get('listen_mail.on')) {
                const {EmailListen} = require("./loads/EmailListen");
                EmailListen.init();
                EmailListen.on();
            }
            const {IpcMainServer} = require("./ipc/IpcMainServer");
            IpcMainServer.on()
        })
        setTimeout(function () {
            const {Server} = require("./Server");

            global.server = new Server();
            // 加载一个路由
            server.mapping.push({
                url: "/look_chrome",
                handler: function (req, res) {
                    const urlib = require('url');
                    var myObj = urlib.parse(req.url, true);
                    var title = myObj.query.title;
                    WindowsManager.getMain().webContents.send("show_msg", {'msg': title});
                    res.end('ok')
                }
            })
            server.on();
        })
    }

    /**
     * 这个方法将在完成时被调用
     * 初始化，并准备创建浏览器窗口。
     * 有些api只能在此事件发生后使用。
     */
    init() {
        const {WindowsManager} = require("./WindowsManager");
        global.WindowsManager = WindowsManager;
        WindowsManager.init();
    }

    /**
     * 初始化完成走start
     */
    start() {
        const {Menus} = require("./Menus");
        Menus.create_menu()
        // 展示一个notify
        let obj = new Notification({
            title: "喵喵喵~",
            body: "专属live2d系统启动成功~~"
        })
        // obj.show();

        globalShortcut.register('CommandOrControl+P', () => {
            // WindowsManager.getMain().webContents.send('', {state: 1})
            let win = WindowsManager.getMain();
            if (win.isVisible()) {
                win.hide();
            } else {
                win.show();
            }
        })
        globalShortcut.register('CommandOrControl+O', () => {
            // WindowsManager.getMain().webContents.send('', {state: 1})
            if (WindowsManager.getMain().webContents.isDevToolsOpened() === true) {
                WindowsManager.getMain().webContents.closeDevTools();
            } else {
                WindowsManager.getMain().webContents.openDevTools({mode: 'detach', activate: false});
            }
        })
    }
}

module.exports = {
    Main
}

