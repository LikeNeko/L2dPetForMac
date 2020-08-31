const {PanelWindow} = require('../../panel/index.js');
const {
    BrowserWindow
} = require('electron')

class main_window {
    /**
     *
     * @type {BrowserWindow[]}
     */
    static all_windows=[];
    /**
     * 创建主视图
     * @returns {PanelWindow}
     */
    static createWindow() {
        let preload_path = path.join(__dirname, './preload.js');
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
                preload: preload_path
            }
        })
        log(preload_path, 'preload');
        log(mainWindow.id, '窗口id')
        // mainWindow.maximize();
        // 所有工作空间中显示
        mainWindow.setVisibleOnAllWorkspaces(true);
        let file = path.join(path.renderer_views, 'index.html');
        mainWindow.loadFile(file).finally(function () {
            // mainWindow.showInactive()
        })
        this.all_windows.push(mainWindow)

        return mainWindow;
    }

    static createLoadingWindow() {
        const mainWindow = new PanelWindow({
            center: true,
            width: 300,
            height: 300,
            show: false,
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
        // 所有工作空间中显示
        mainWindow.setVisibleOnAllWorkspaces(true);
        let file = path.join(path.renderer_views, 'loading.html');
        mainWindow
            .loadFile(file)
            .finally(function () {
                mainWindow.showInactive()
            })
        mainWindow.setIgnoreMouseEvents(true)
        // mainWindow.webContents.openDevTools()
        return mainWindow;
    }

    static create(name){
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
        let file = path.join(path.renderer_views, name+'.html');
        window.loadFile(file)
            .finally(function () {
                window.show()
            })
        // window.setAlwaysOnTop(true,'screen-saver')
        // window.setIgnoreMouseEvents(true)
        // mainWindow.webContents.openDevTools()
        this.all_windows.push(window);
        return window
    }

    static showAllDevTools(){
        console.log(this.all_windows)

        this.all_windows.forEach(function (value, index, array) {
            if (value){
                value.webContents.openDevTools({mode:'detach',activate:false});
            }

        })
    }
    static closeAllDevTools(){
        this.all_windows.forEach(function (value, index, array) {
            if (value){
                value.webContents.closeDevTools();
            }
        })
    }
}

module.exports = {
    main_window
}