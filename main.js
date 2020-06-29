// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const { PanelWindow } = require('./panel/');

const path = require('path')

function createWindow () {
  const mainWindow = new PanelWindow({
    // center: true,
    width: 300,
    height: 300,
    x:1300,
    y:800,
    show: false,
    // maximizable: false,
    // minimizable: false,
    // resizable: false,
    // fullscreenable: false,
    frame: false,
    transparent: true,
    hasShadow: false,
    // titleBarStyle: 'customButtonsOnHover',
    
    webPreferences: {
      nodeIntegration: true,// 主线程的node
      enableRemoteModule: true,
      // webSecurity:false,
      // clickThrough: 'pointer-events',// 透明点击穿透
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.setVisibleOnAllWorkspaces(true);
  // mainWindow.setIgnoreMouseEvents(true, { forward: true })
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '/index.html')).finally(function () {
     mainWindow.show()
     mainWindow.webContents.openDevTools()

// 在主进程中.
    const { ipcMain } = require('electron')
    ipcMain.on('console_log', (event, arg) => {
      console.log(arg) // prints "ping"
    })
  })


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // 关闭安全警告
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
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
