// 在主进程中.

class IpcMainServer {
    static ipcs = [
        'show_inactive',
        'chrome_new_url',
        'open_dev_tools',
        'close_dev_tools',
        'focus',
        'zip_image',
    ]

    /**
     * 开启监听.
     */
    static on() {
        const {ipcMain} = require('electron')
        for (let i = 0; i < this.ipcs.length; i++) {
            ipcMain.on(this.ipcs[i], this[this.ipcs[i]])
        }
    }

    /**
     * 展示主页面
     * @param event
     * @param arg
     */
    static show_inactive(event, arg) {
        WindowsManager.getMain().showInactive();
        // WindowsManager.getLoading().webContents.send(RPC.model.load);
    }

    /**
     * 收到chrome的新浏览消息
     * @param event
     * @param arg
     */
    static chrome_new_url(event, arg) {
        // Chrome.initDB()
        // Chrome.sqlite_sql
        //     .tables
        //     .urls
        //     .table
        //     .sql_format({page: 0, limit: 10})
        //     .sql_query(Chrome.db)
        //     .then(function (data) {
        //         for (let i = 0; i < data.length; i++) {
        //             data[i]['last_visit_time'] = (data[i]['last_visit_time'])
        //                 .db_time_to_unix()
        //                 .db_time_format("Y-m-d H:i:s")
        //         }
        //         console.debug(data)
        //         event.returnValue = data;
        //     })
    }

    /**
     * 打开调试
     * @param event
     * @param arg
     */
    static open_dev_tools(event, arg) {
        WindowsManager.getMain().webContents.openDevTools()
    }

    /**
     * 关闭调试
     * @param event
     * @param arg
     */
    static close_dev_tools(event, arg) {
        WindowsManager.getMain().webContents.closeDevTools()
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
}
module.exports ={
    IpcMainServer
}