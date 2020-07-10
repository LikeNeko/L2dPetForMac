// 在主进程中.
const { ipcMain } = require('electron')
const {Config} = require('../Config.js')

ipcMain.on('console_log', (event, arg) => {
    console.log(arg) // prints "ping"
})
ipcMain.on('config', (event, arg) => {
    console.log(arg) // prints "ping"
    event.returnValue = Config
})


