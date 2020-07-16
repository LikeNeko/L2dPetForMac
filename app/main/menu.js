const {
    Menu,
    Tray,
} = require('electron')

class menu {
    static create_menu() {
        let icon_path = path.join(path.res,'/image/icon_16x16@2x.png')
        let tray = new Tray(icon_path)

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Quit',
                type: 'normal',
                click:()=>{
                    log("click")
                    app.quit()
                }
            },

        ])
        tray.setToolTip('This is my application.')
        tray.setTitle("\u001b[34m")
        tray.setContextMenu(contextMenu)
    }
}

module.exports  = {
    menu
}