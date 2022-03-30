const {WindowsManager} = require("./WindowsManager");

class Menus {
    static create_menu() {
        app.dock.hide()
        let icon_path = 'app/res/image/icon_16x16@2x.png'
        const {Tray, Menu} = require('electron')
        global.tray = new Tray(icon_path)

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Quit',
                type: 'normal',
                click:()=>{
                    app.exit()
                }
            },
            {
                label: 'Debug',
                type: 'normal',
                click:()=>{
                    global.WindowsManager.getMain().webContents.openDevTools();
                }
            },
            // {
            //     label: 'Drag(拖入压缩图片)',
            //     type: 'normal',
            //     click:()=>{
            //         global.drag = main_window.create('drag');
            //         drag.setContentSize(500,350);
            //         drag.show()
            //     }
            // },
            {
                label: 'ChromeHistory(谷歌历史记录)',
                type: 'normal',
                click:()=>{
                    // global.chrome_history_window = global.WindowsManager.create('chrome_history');
                    // chrome_history_window.show()
                }
            },
            {
                label: 'manager',
                type: 'normal',
                click:()=>{
                    // global.manager = main_window.create('model_manager');
                    // manager.show()
                }
            },

        ])
        // tray.setToolTip('This is my application.')
        // tray.setTitle("\u001b[34m")
        tray.setContextMenu(contextMenu)
    }
}

module.exports  = {
    Menus
}