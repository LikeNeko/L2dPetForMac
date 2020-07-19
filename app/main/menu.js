const {
    Menu,
    Tray,
} = require('electron')
let tray;
class menu {
    static create_menu() {
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
                label: 'https://raw.githubusercontent.com/LikeNeko/L2dPetForMac/master/images/2020-07-09-132033.jpeg',
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