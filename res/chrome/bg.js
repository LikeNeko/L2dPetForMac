console.log('后台js开始运行')
// chrome.history.search({text: '', maxResults: 10}, function(data) {
//     data.forEach(function(page) {
//         console.log(page);
//     });
// });
chrome.history.onVisited.addListener(function(result) {
    console.log(result)
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://127.0.0.1:8005", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // JSON解析器不会执行攻击者设计的脚本.
            // var resp = JSON.parse(xhr.responseText);
        }
    }
    xhr.send();
});
chrome.extension.onConnect.addListener(function(port) {
    console.assert(port.name == "knockknock");
    port.onMessage.addListener(function(msg) {
        if (msg.joke == "Knock knock")
            port.postMessage({question: "Who's there?"});
        else if (msg.answer == "Madame")
            port.postMessage({question: "Madame who?"});
        else if (msg.answer == "Madame... Bovary")
            port.postMessage({question: "I don't get it."});
    });
});