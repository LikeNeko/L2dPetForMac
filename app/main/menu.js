const {
    Menu,
    Tray,
    BrowserWindow
} = require('electron')
let tray;
class menu {
    static create_menu() {
        app.dock.hide()
        let icon_path = path.join(path.res,'/image/icon_16x16@2x.png')
        tray = new Tray(icon_path)

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Quit',
                type: 'normal',
                click:()=>{
                    log("click")
                    app.quit()
                }
            },
            {
                label: 'debug',
                type: 'normal',
                click:()=>{
                    main.webContents.openDevTools();
                }
            },
            {
                label: 'drag',
                type: 'normal',
                click:()=>{
                    drag = new BrowserWindow({
                        width:400,
                        height:400,
                        webPreferences: {
                            nodeIntegration: true,// 主线程的node
                            enableRemoteModule: true,
                            nodeIntegrationInWorker: true,// worker内使用node
                            // webSecurity:false,
                        }
                    })
                    drag.loadFile(path.renderer_views + 'drag.html');
                    drag.show()
                    drag.webContents.openDevTools();
                }
            },

        ])
        // tray.setToolTip('This is my application.')
        // tray.setTitle("\u001b[34m")
        tray.setContextMenu(contextMenu)
    }
}

module.exports  = {
    menu
}