const ws = require('nodejs-websocket');
const {Notice} = require("../Notice");
let port = 8233;
let server = ws.createServer(function(conn){
    //受到连接触发//
    //在服务端cmd安装npm install nodejs-websocket//
    log('new conn ','connection');
    conn.on("text",function(str){
        // 收到信息触发     接收 //
        log(str,'received')
        if (str == '1'){
            if (windows.length){
                windows[0].webContents.send('show_mtn', {"A": 2});
            }
        }else{
            Notice.show();
        }
        boardcast(str) // 广播消息 //
        // conn.sendText(str) // 发送 数据 //
    })
    conn.on("close",function(code,reason){
        // 断开连接触发 //
        log("closed",'connection')
    })
    conn.on("error",function(err){
        // 出错触发 //
        log(err,"error")
    })
    function boardcast(str){  // 广播 //
        // server.connections  保存每个连接进来的用户 //
        server.connections.forEach(function(conn){
            conn.sendText(str)
        })
    }

})
    // .listen(port)
log("websocket server listen port is " + port,'ws')
