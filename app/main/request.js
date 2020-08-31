const {net} = require('electron')
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
app.nnw = nnw
