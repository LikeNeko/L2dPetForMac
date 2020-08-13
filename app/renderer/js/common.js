// 获取app的配置项
const {ipcRenderer,remote} = require('electron')
window.RPC = remote.getGlobal('RPC');
window.Config = ipcRenderer.sendSync(RPC.config);
// 引入jquery
window.$ = window.jQuery = require(Config.path.renderer_js + "jq.js");




