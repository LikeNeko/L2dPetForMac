/**
 * 管理应用生命周期类
 */
class Main {
    constructor() {
        // 启动应用加载越少越好
        const {app, Notification, globalShortcut} = require('electron')
        global.app = app;
        global.Notification = Notification;
        global.globalShortcut = globalShortcut;
        // 可以异步初始化的东西
        this.init_async()
        // 启动应用
        app.whenReady()
            .then(this.init)
            .then(this.start);

        app.on('activate', this.on_activate)
        // Quit when all windows are closed.
        app.on('window-all-closed', this.on_window_all_closed)
        app.on('exit', this.on_exit)
        app.on('will-quit', this.on_will_quit)
        app.on('before-quit', this.on_before_quit)
    }

    init_async() {
        setTimeout(function () {
            const Store = require('electron-store');
            global.store = new Store()

            // 加载初始化配置
            store.set({
                listen_mail: {
                    on: false,
                    username: "shibao@litemob.com",
                    password: "Neko123",
                    host: "imap.exmail.qq.com",
                    port: 993,
                }
            })
            if (store.get('listen_mail.on')){
                const {EmailListen} = require("./loads/EmailListen");
                EmailListen.init();
                EmailListen.on();
            }

            const {IpcMainServer} = require("./ipc/IpcMainServer");
            IpcMainServer.on()
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
    }

    /// --- 监听事件 ---

    /**
     * 激活
     */
    on_activate(e, v) {
        console.log('active', e, v)
        // 在macOS上，重新创建一个窗口是很常见的
        // 点击dock图标，没有其他窗口打开。
        // if (BrowserWindow.getAllWindows().length === 0) main_window.createWindow()
    }

    /**
     * 窗口关闭
     */
    on_window_all_closed() {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    }

    on_exit() {
        console.log('exit')
    }

    on_will_quit() {
        console.log('will-quit')
    }

    on_before_quit() {
        console.log('before-quit')
    }
}

module.exports = {
    Main
}

