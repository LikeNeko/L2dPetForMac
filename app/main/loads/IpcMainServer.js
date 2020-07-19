// 在主进程中.
const { ipcMain } = require('electron')
const { Config } = require('../libs/Config.js')

ipcMain.on(RPC.console_log, (event, arg) => {
    console.log(arg) // prints "ping"
})
ipcMain.on(RPC.config, (event, arg) => {
    event.returnValue = Config
})

ipcMain.on(RPC.open_dev_tools, (event, arg) => {
    main.webContents.openDevTools()
})
ipcMain.on(RPC.close_dev_tools, (event, arg) => {
    main.webContents.openDevTools()
})


