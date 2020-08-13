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
                    drag.show()
                    drag.webContents.openDevTools();
                }
            }, {
                label: 'ChromeHistory(谷歌历史记录)',
                type: 'normal',
                click:()=>{
                    global.chrome_history_window = main_window.create('chrome_history');
                    chrome_history_window.show()
                    chrome_history_window.webContents.openDevTools();
                }
            },
            {
                label: 'nkpush',
                type: 'normal',
                click:()=>{
                    global.nkpush_window = main_window.create('nkpush');
                    nkpush_window.show()
                    nkpush_window.webContents.openDevTools();
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