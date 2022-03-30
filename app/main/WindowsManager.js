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
            show: false,
            // minimizable: false,
            // resizable: false,
            // fullscreenable: false,
            frame: false,
            transparent: true,
            hasShadow: false,

            webPreferences: {
                nodeIntegration: true,// 主线程的node
                enableRemoteModule: true,
                nodeIntegrationInWorker: true,// worker内使用node
                // webSecurity:false,
                preload: './preload.js'
            }
        })
        mainWindow.webContents.openDevTools({mode: 'detach', activate: false});

        console.log(mainWindow.id, '窗口id')
        // mainWindow.maximize();
        // 所有工作空间中显示
        mainWindow.setVisibleOnAllWorkspaces(true);
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


    static loading_window() {
        const mainWindow = new PanelWindow({
            center: true,
            width: 300,
            height: 300,
            show: true,
            frame: false,
            transparent: true,
            hasShadow: false,

            webPreferences: {
                nodeIntegration: true,// 主线程的node
                enableRemoteModule: true,
                nodeIntegrationInWorker: true,// worker内使用node
                // webSecurity:false,
                // preload: preload_path
            }
        })
        mainWindow.webContents.openDevTools({mode: 'detach', activate: false});

        // 所有工作空间中显示
        mainWindow.setVisibleOnAllWorkspaces(true);
        let file = 'app/renderer/views/loading.html';
        mainWindow
            .loadFile(file)
            .finally(function () {
                mainWindow.showInactive()
            })
        mainWindow.setIgnoreMouseEvents(true)
        // mainWindow.webContents.openDevTools()
        WindowsManager.#windows['loading_window'] = mainWindow
    }

    static create(name) {
        const BrowserWindow = require('electron')
        const window = new BrowserWindow({
            center: true,
            width: 500,
            height: 500,
            show: false,
            // frame: false,
            // transparent: true,
            // hasShadow: false,

            webPreferences: {
                nodeIntegration: true,// 主线程的node
                enableRemoteModule: true,
                nodeIntegrationInWorker: true,// worker内使用node
                // webSecurity:false,
                // preload: preload_path
            }
        })
        // 所有工作空间中显示
        window.setVisibleOnAllWorkspaces(true);
        let file = path.join(path.renderer_views, name + '.html');
        window.loadFile(file)
            .finally(function () {
                window.show()
            })
        // window.setAlwaysOnTop(true,'screen-saver')
        // window.setIgnoreMouseEvents(true)
        // mainWindow.webContents.openDevTools()
        WindowsManager.#windows[name] = window
        return window
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