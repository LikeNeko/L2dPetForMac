const {
    Menu,
    Tray
} = require('electron')
const {main_window} = require("./main_window.js")

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
                label: 'Debug',
                type: 'normal',
                click:()=>{
                    main.webContents.openDevTools();
                }
            },
            {
                label: 'Drag(拖入压缩图片)',
                type: 'normal',
                click:()=>{
                    global.drag = main_window.create('drag');
                    drag.setContentSize(500,350);
                    drag.show()
                }
            }, {
                label: 'ChromeHistory(谷歌历史记录)',
                type: 'normal',
                click:()=>{
                    global.chrome_history_window = main_window.create('chrome_history');
                    chrome_history_window.show()
                }
            },
            {
                label: 'nkpush',
                type: 'normal',
                click:()=>{
                    global.nkpush_window = main_window.create('nkpush');
                    nkpush_window.show()
                }
            },{
                label: 'manager',
                type: 'normal',
                click:()=>{
                    global.manager = main_window.create('model_manager');
                    manager.show()
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