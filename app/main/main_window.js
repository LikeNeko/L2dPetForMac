const {PanelWindow} = require('../../panel/index.js');

class main_window {
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
        log(preload_path,'preload');
        log(mainWindow.id, '窗口id')
        // mainWindow.maximize();
        // 所有工作空间中显示
        mainWindow.setVisibleOnAllWorkspaces(true);
        let file = path.join(path.renderer_views, 'index.html');
        log(file)
        mainWindow.loadFile(file).finally(function () {
            mainWindow.showInactive()
        })


        return mainWindow;
    }

}
module.exports = {
    main_window
}