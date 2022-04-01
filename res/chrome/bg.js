console.log('后台js开始运行')
// chrome.history.search({text: '', maxResults: 10}, function(data) {
//     data.forEach(function(page) {
//         console.log(page);
//     });
// });

/**
 * 序列化query
 */
function query_serialize(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

/**
 * get请求
 * @param url
 * @param param
 * @param func
 */
function req_get(url,param,func){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://127.0.0.1:5201/look_chrome"+"?"+query_serialize(param), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // JSON解析器不会执行攻击者设计的脚本.
            // var resp = JSON.parse(xhr.responseText);
            func ? func(xhr.responseText):"";
        }
    }
    xhr.send();
}
chrome.history.onVisited.addListener(function(result) {
    console.log(result)
    //id: "64640"
    // lastVisitTime: 1648692908869.168
    // title: "协程风格服务"
    // typedCount: 0
    // url: "https://hyperf.wiki/2.2/#/zh-cn/coroutine-server"
    // visitCount: 4
    req_get('http://127.0.0.1:5201/look_chrome',{
        'title':result.title
    })
});
// 创建标签触发
chrome.tabs.onCreated.addListener(function(tab) {
    console.log('tabs.onCreated --'
        + ' window: ' + tab.windowId
        + ' tab: '    + tab.id
        + ' index: '  + tab.index
        + ' url: '    + tab.url);

});
// 选中触发
chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo){
    console.log('select:',tabId,selectInfo)
    chrome.tabs.executeScript(tabId, {"code":"console.log('show~');"}, function (){
        console.log('ok')
    })

    chrome.tabs.get(tabId, function (tab){
        req_get('http://127.0.0.1:5201/look_chrome',{
            'title':'切换到了:'+tab.title
        })
    })
});
// 向指定页面发送js

