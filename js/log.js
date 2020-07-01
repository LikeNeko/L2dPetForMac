function log(any, tag = "debug") {
    let get_time = function () {
        let now = new Date();
        let nowTime = now.toLocaleString();
        let date = nowTime.substring(0, 10);//截取日期
        let time = nowTime.substring(10, 20); //截取时间
        let week = now.getDay(); //星期
        let hour = now.getHours(); //小时
        return date + time;
    }
    let obj2string = function (o) {
        var r = [];
        if (typeof o == "string") {
            return "" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "";
        }
        if (typeof o == "object") {
            if (!o.sort) {
                for (var i in o) {
                    r.push(i + ":" + obj2string(o[i]));
                }
                if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                    r.push("toString:" + o.toString.toString());
                }
                r = "{" + r.join() + "}";
            } else {
                for (var i = 0; i < o.length; i++) {
                    r.push(obj2string(o[i]))
                }
                r = "[" + r.join() + "]";
            }
            return r;
        }
        return o.toString();
    }

    let time = get_time()
    console.log(`[${time}][${tag}]` + obj2string(any));
}
module.exports = {
    log
}
