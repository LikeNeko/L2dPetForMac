const {
    Menu,
    Tray,
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

        ])
        // tray.setToolTip('This is my application.')
        // tray.setTitle("\u001b[34m")
        tray.setContextMenu(contextMenu)
    }
}

module.exports  = {
    menu
}