// noinspection JSCheckFunctionSignatures
let last_time = new Date().getTime();
console.log = (function (logFunc) {
    return function () {
        try {
            let date = new Date();
            let lt = date.getTime();
            let time = lt - last_time;
            last_time = lt;
            let arr = ['['+date.getHours()+'/'+date.getMinutes()+'/'+date.getSeconds()+":"+date.getMilliseconds().toFixed(0) + "]↑"+(time/1000).toFixed(3)+"s:>"]
            arr.push(...arguments)
            arr.forEach((item, index) => {
                if (Object.prototype.toString.call(item) === '[object Object]' ||
                    Object.prototype.toString.call(item) === '[object Array]') {
                    arr[index] = JSON.parse(JSON.stringify(item))
                }
            })
            logFunc.call(console, ...arr)
        } catch (e) {
            console.log(`a log error: ${e}`)
        }
    }
})(console.log)
const {Main}  = require('./Main')
let main = new Main();
