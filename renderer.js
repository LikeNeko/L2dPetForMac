// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
// 这个文件是渲染进程里最最开始执行的代码，如果有比它还前的，那一定是preload.js,否则什么情况下不论引入顺序都是这个文件最先执行
// 引入jquery
window.$ = window.jQuery = require("./js/jq");
// 引入log方法
window.log = function(any, tag){
    console.log("%c["+tag+"]", "text-shadow: 0px 0px 1px red",any);
    const { ipcRenderer } = require('electron')

    ipcRenderer.send('console_log',`[${tag}]`+any.toString())
}

// 加载
function nload(){
    console.log('nload 执行成功');
    live2d.getModel(0).startMotion('TapBody',1,3);
}

console.log('renderer load 100%');