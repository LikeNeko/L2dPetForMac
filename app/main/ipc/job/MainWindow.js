class MainWindow{
    static name = 'main_window';

    /**
     * 显示主窗口但不聚焦
     */
    static show_inactive(){
        WindowsManager.getMain().showInactive();
    }

    /**
     * 返回当前窗口位置
     * @param event
     * @param arg
     */
    static get_position(event, arg){
        event.returnValue = WindowsManager.getMain().getPosition();
    }
    /**
     * 焦点
     * @param event
     * @param arg
     */
    static focus(event, arg) {
        WindowsManager.getMain().focus()
        event.returnValue = 0;
    }


    /**
     * 压缩
     * @param event
     * @param arg
     */
    static zip_image(event, arg) {
        const exec = require('child_process').exec
        const fs = require("fs")

        function check(file) {
            return new Promise(function (resolve, reject) {
                fs.stat(file, function (err, stats) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(stats);
                    }
                })
            })
        }

        check(args.path).then(function (stats) {
            if (stats.isFile() || stats.isDirectory()) {
                // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
                let workerProcess = exec("imagezip " + args.path, {cwd: "./"})
                // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

                // 打印正常的后台可执行程序输出
                workerProcess.stdout.on('data', function (data) {
                    console.log('stdout: ' + data);
                });

                // 打印错误的后台可执行程序输出
                workerProcess.stderr.on('data', function (data) {
                    console.log('stderr: ' + data);
                });

                // 退出之后的输出
                workerProcess.on('close', function (code) {
                    console.log('out code：' + code);
                    if (code == 0) {
                        event.returnValue = '成功'
                    }
                })
            }
        })

    }

    /**
     * 忽略操作事件
     * @param event
     * @param arg
     */
    static open_ignore_mouse_events(event, arg){
        // WindowsManager.getMain().setIgnoreMouseEvents(true,{forward:true})
    }

    /**
     * 不忽略操作事件
     * @param event
     * @param arg
     */
    static close_ignore_mouse_events(event, arg){
        WindowsManager.getMain().setIgnoreMouseEvents(false,{forward:true})
    }
}
module.exports = {
    MainWindow
}