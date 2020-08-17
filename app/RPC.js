let RPC = {
    config:'config',
    console_log:"console_log",
    open_dev_tools:"open_dev_tools",
    close_dev_tools:"close_dev_tools",
    show_mtn:'show_mtn',
    mail:'mail',
    chrome_history:"chrome_history",
    focus:"focus",// 获得焦点
    is_debug:"is_debugs",
    // 文件拖拽
    ondragstart:'ondragstart',
    // 压缩图片
    zip_image:"zip_image",
    // 上传图片到oss
    upload_oss_image:"upload_oss_image",
    web:{
        // 查询谷歌浏览器历史
        chrome_history_list:'chrome_history_list'
    },
    model:{
        load:"load"
    },
    // 展示主窗口
    show_main_window:"show_main_window",
}
module.exports = {
    RPC
}