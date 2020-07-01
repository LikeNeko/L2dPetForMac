class IpcMainServer {
    static initConsoleLog(){
        // 在主进程中.
        const { ipcMain } = require('electron')
        ipcMain.on('console_log', (event, arg) => {
            console.log(arg) // prints "ping"
        })
    }
}
module.exports = {
    IpcMainServer
}