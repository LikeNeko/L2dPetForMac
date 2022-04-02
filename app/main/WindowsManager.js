/**
 * 窗口管理类
 */
class WindowsManager {
    static #windows = {}

    /**
     * 初始化主窗口
     */
    static init() {
        const {PanelWindow} = require('../../panel')
        const mainWindow = new PanelWindow({
            // center: true,
            width: 300,
            height: 300,
            x: 1300,
            y: 800,
            show: true,
            // minimizable: false,
            // resizable: false,
            // fullscreenable: false,
            frame: false,
            transparent: true,
            hasShadow: false,

            webPreferences: {
                nodeIntegration: true,// 主线程的node
                enableRemoteModule: true,
                contextIsolation:false,
                nodeIntegrationInWorker: true,// worker内使用node
                // webSecurity:false,
                // preload: 'app/preload.js'//18版本必须是绝对路径
            }
        })

        console.log(mainWindow.id, '窗口id')
        // mainWindow.maximize();
        // 所有工作空间中显示
        // mainWindow.setVisibleOnAllWorkspaces(true);
        mainWindow.setAlwaysOnTop(false)

        let file = 'app/renderer/views/index.html';
        mainWindow.loadFile(file).finally(function () {
            // mainWindow.showInactive()
        })
        this.#windows['main'] = mainWindow
    }

    /**
     * 获取window主窗口
     * @returns {PanelWindow}
     */
    static getMain(){
        return this.#windows['main'];
    }

    static showAllDevTools() {
        for (const windowsKey in this.#windows) {
            /**
             * @type BrowserWindow
             */
            let value = this.#windows[windowsKey];
            if (value) {
                value.webContents.openDevTools({mode: 'detach', activate: false});
            }
        }
    }

    static closeAllDevTools() {
        for (const windowsKey in this.#windows) {
            /**
             * @type BrowserWindow
             */
            let value = this.#windows[windowsKey];
            if (value) {
                value.webContents.closeDevTools();
            }
        }
    }
}

module.exports = {
    WindowsManager
}