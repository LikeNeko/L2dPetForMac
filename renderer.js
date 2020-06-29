// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
window.$ = window.jQuery = require("./js/jq");

// 加载
function nload(){
    console.log('动画播放')
    live2d.getModel(0).startMotion('TapBody',1,3);
}

console.log('renderer load 100%');