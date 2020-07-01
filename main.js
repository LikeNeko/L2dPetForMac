// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const {PanelWindow} = require('./panel/');
const {IpcMainServer} = require("./js/IpcMainServer")
const {Notification} = require("electron")
const path = require('path')
const {log} = require('./js/log');
const {Nlib} = require('./js/nlib');
// 给nodejs提供log方法
global.log = log;
const isMac = process.platform === 'darwin'

function createWindow() {
    const mainWindow = new PanelWindow({
        // center: true,
        width: 300,
        height: 300,
        x: 1300,
        y: 800,
        show: false,
        // maximizable: false,
        // minimizable: false,
        // resizable: false,
        // fullscreenable: false,
        frame: false,
        transparent: true,
        hasShadow: false,

        webPreferences: {
            nodeIntegration: true,// 主线程的node
            enableRemoteModule: true,
            // webSecurity:false,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    // mainWindow.maximize();
    // 所有工作空间中显示
    mainWindow.setVisibleOnAllWorkspaces(true);

    mainWindow.loadFile(path.join(__dirname, '/index.html'))
        .finally(function () {
            mainWindow.show()
            mainWindow.webContents.openDevTools()
        })

    setTimeout(function () {
        let obj = new Notification({
            title:"123",
            body:"body"
        })
        obj.show();
        mainWindow.webContents.send('show_tips', {"A":1});
    },4000)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // 关闭安全警告
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
    IpcMainServer.initConsoleLog();

    createWindow()

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


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
