class DevTools{
    static name = 'dev_tools';

    /**
     * 打开调试
     * @param event
     * @param arg
     */
    static open_main(event, arg) {
        WindowsManager.getMain().webContents.openDevTools()
    }

    /**
     * 关闭调试
     * @param event
     * @param arg
     */
    static close_main(event, arg) {
        WindowsManager.getMain().webContents.closeDevTools()
    }
}
module.exports = {
    DevTools
}