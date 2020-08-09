// 在主进程中.
const { ipcMain } = require('electron')
const { Config } = require('../libs/Config.js')

ipcMain.on(RPC.console_log, (event, arg) => {
    console.log(arg) // prints "ping"
})
ipcMain.on(RPC.show_main_window, (event, arg) => {
    main.showInactive();
    loading_window.webContents.send(RPC.model.load);
})

ipcMain.on(RPC.web.chrome_history_list, (event, arg) => {
    Chrome.initDB();
    let ret = [];
    Chrome.sqlite_sql
        .tables
        .downloads
        .table
        .sql_format({page:1,limit:10})
        .sql_query(Chrome.db)
        .then(function(data) {
            for (let i = 0; i < data.length; i++) {
                data[i]['start_time'] = (data[i]['start_time'])
                    .db_time_to_unix()
                    .db_time_format("Y-m-d H:i:s")


            }
            event.returnValue = data;
        })

})
ipcMain.on(RPC.config, (event, arg) => {
    event.returnValue = Config
})
ipcMain.on(RPC.ondragstart, (event, filePath) => {
    console.log(filePath)
    event.sender.startDrag({
        file: filePath,
        icon: '/path/to/icon.png'
    })
})
ipcMain.on(RPC.open_dev_tools, (event, arg) => {
    main.webContents.openDevTools()
})
ipcMain.on(RPC.close_dev_tools, (event, arg) => {
    main.webContents.closeDevTools()
})
ipcMain.on(RPC.focus,(event, args) => {
    main.focus()
    event.returnValue = 0;
})

