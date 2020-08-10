let DB = require("./AppConfigDB.js");
// 全局初始化的一些配置
let Config = {
    debug: true,
    isMac: process.platform === 'darwin',
    model_path:"",
    path:path.toDict()
}
obj = new DB();

module.exports = {
    Config
}