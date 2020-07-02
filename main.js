// Modules to control application life and create native browser window
const {app, BrowserWindow, Notification} = require('electron')
const {PanelWindow} = require('./panel/');
const path = require('path')
const {Nlib} = require('./js/nlib');
const glob = require('glob')
const isMac = process.platform === 'darwin'

// 初始化一些node全局要用的参数

// 所有窗口列表
global["windows"] = [];
// 日志模块
global["log"] = null;

function createWindow() {
    const mainWindow = new PanelWindow({
        // center: true,
        width: 300,
        height: 300,
        x: 1300,
        y: 800,
        show: false,
        // minimizable: false,
        // resizable: false,
        // fullscreenable: false,
        frame: false,
        transparent: true,
        hasShadow: false,

        webPreferences: {
            nodeIntegration: true,// 主线程的node
            enableRemoteModule: true,
            // webSecurity:false,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    // mainWindow.maximize();
    // 所有工作空间中显示
    mainWindow.setVisibleOnAllWorkspaces(true);

    mainWindow.loadFile(path.join(__dirname, '/index.html'))
        .finally(function () {
            mainWindow.show()
            mainWindow.webContents.openDevTools()
        })
    windows[0] = mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // 关闭安全警告
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
    loadIpcServers()
    testNetwork();

    createWindow()

    // 展示一个notify
    showNotification();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})


// 循环引入js
function loadIpcServers() {
    const files = glob.sync(path.join(__dirname, 'src/**/*.js'))
    files.forEach((file) => {
        require(file)
    })
}

// 测试弹出通知
function showNotification() {
    setTimeout(function () {
        let obj = new Notification({
            title: "喵喵喵~",
            body: "body"
        })
        obj.show();
        windows[0].webContents.send('show_tips', {"A": 1});
    }, 4000)
}



class nnw {
    static get(key) {
        return this[key];
    }
    static f(url) {
        // 返回一个 Promise
        return new Promise(
            /**
             * @param resolve 成功时的回调
             * @param reject 失败时的回调
             */
            function (resolve, reject) {
                // 获取一个网络请求对象
                const {net} = require('electron')
                const request = net.request(url)
                request.on('response', (response) => {
                    // console.log(`STATUS: ${response.statusCode}`)
                    // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
                    response.on('data', (chunk) => {
                        let json = JSON.parse(`${chunk}`);
                        json.get = nnw.get
                        resolve(json);
                    })
                    response.on('end', () => {
                        // console.log('No more data in response.')
                    })
                    response.on("error", function (b) {
                        reject("error");
                    })
                })
                request.end()
            }
        )
    }
}
function testNetwork() {
    let url = 'https://test.litemob.com/yanlidaren_ios/login/uid?uid=1';
    let req = nnw.f(url);
    // 事实上走到这，请求已经发出去了
    req.then((data) => {
        log(data.get('code'));
    }).catch(function (da) {
        log(da);
    });
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
