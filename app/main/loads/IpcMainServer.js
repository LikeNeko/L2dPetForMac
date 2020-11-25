// 在主进程中.
const {ipcMain} = require('electron')
const {Config} = require('../libs/Config.js')
const exec = require('child_process').exec
const fs = require("fs")
const OSS = require("ali-oss")

ipcMain.on(RPC.console_log, (event, arg) => {
    console.log(arg) // prints "ping"
})
// 展示主窗口
ipcMain.on(RPC.show_main_window, (event, arg) => {
    main.showInactive();
    loading_window.webContents.send(RPC.model.load);
})
// 上传oss img
ipcMain.on(RPC.upload_oss_image, (event, arg) => {
    let obj = new LowDB();
    let client = new OSS({
        accessKeyId: obj.get('ali_oss.accessKeyId', true),
        accessKeySecret: obj.get('ali_oss.accessKeySecret', true),
        bucket: obj.get('ali_oss.bucket', true),
        region: obj.get('ali_oss.region', true),
    });
    log(arg);
    var timestamp = Date.parse(new Date());
    // 'object'表示从OSS下载的object名称，'localfile'表示本地文件或者文件路径。
    client.put(arg.name + "/" + timestamp + '.png', arg.path).then(function (r1) {
        console.log('put success: %j', r1);
        event.returnValue = r1.url;
    })
})
// 获取谷歌浏览历史
ipcMain.on(RPC.web.chrome_history_list, (event, arg) => {
    log('chrome_history_list', 'sqlite')
    Chrome.initDB()
    Chrome.sqlite_sql
        .tables
        .urls
        .table
        .sql_format({page: 0, limit: 10})
        .sql_query(Chrome.db)
        .then(function (data) {
            for (let i = 0; i < data.length; i++) {
                data[i]['last_visit_time'] = (data[i]['last_visit_time'])
                    .db_time_to_unix()
                    .db_time_format("Y-m-d H:i:s")
            }
            console.debug(data)
            event.returnValue = data;
        })

})
// 获得配置
ipcMain.on(RPC.config, (event, arg) => {
    event.returnValue = Config
})

// 打开dev_tools
ipcMain.on(RPC.open_dev_tools, (event, arg) => {
    main.webContents.openDevTools()
})
ipcMain.on(RPC.close_dev_tools, (event, arg) => {
    main.webContents.closeDevTools()
})

ipcMain.on(RPC.focus, (event, args) => {
    main.focus()
    event.returnValue = 0;
})

ipcMain.on(RPC.zip_image, ((event, args) => {
    log(args, "zip")

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


}))
