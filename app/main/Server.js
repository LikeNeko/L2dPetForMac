const http = require("http");
const url = require("url");

class Server{
    /**
     * 映射路由
     * @type {[{handler: function(http.IncomingMessage,http.ServerResponse), url: string}]}
     */
    mapping = [
    ];
    constructor() {
        let that = this;

        this.ser = http.createServer(function (req,res){
           that.on_request(req,res)
        });
    }

    /**
     * 开启监听
     */
    on(){
        this.ser.listen(store.get('server.port','5201'),store.get('server.host','127.0.0.1'),()=>{
            console.log("server 服务启动成功")
        })
    }

    /**
     * 接到请求
     * @param req
     * @param res
     */
    on_request(req, res) {
        let that = this;
        // 解析请求路径
        let pathName = url.parse(req.url).pathname;
        // 执行相应请求路径的回调函数
        let mapping = that.mapping;
        for(let i = 0, len = mapping.length;i < len;i++) {
            if(mapping[i].url === pathName) {
                mapping[i].handler(req, res);
                return;
            }
        }
        res.end('path error');
    }
}
module.exports = {
    Server
}