// 在主进程中.
const { ipcMain } = require('electron')
ipcMain.on('console_log', (event, arg) => {
    console.log(arg) // prints "ping"
})

