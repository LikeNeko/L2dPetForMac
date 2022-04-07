// 在主进程中.

const {ipcMain} = require("electron");
const {MainWindow} = require("./job/MainWindow");
const {Store} = require("./job/Store");
const {DevTools} = require("./job/DevTools");

class IpcMainServer {

    /**
     * 开启监听.
     */
    static on() {
        this.bind(MainWindow.name, MainWindow.show_inactive)
        this.bind(MainWindow.name, MainWindow.focus)
        this.bind(MainWindow.name, MainWindow.open_ignore_mouse_events)
        this.bind(MainWindow.name, MainWindow.close_ignore_mouse_events)
        this.bind(MainWindow.name, MainWindow.get_position)

        this.bind(Store.name, Store.set)
        this.bind(Store.name, Store.get)

        this.bind(DevTools.name, DevTools.open_main)
        this.bind(DevTools.name, DevTools.close_main)
    }

    /**
     * @private
     */
    static bind(name, func) {
        console.log('on ipc listen', name + "-" + func.name)
        ipcMain.on(name + "-" + func.name, func)
    }
}

module.exports = {
    IpcMainServer
}