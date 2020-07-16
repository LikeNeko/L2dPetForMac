// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  // for (const type of ['chrome', 'node', 'electron']) {
  //     console.log( type,process.versions[type])
  // }
})
// document.addEventListener('DOMNodeInserted', function(event){
//   页面内容加载之前需要引入的一些代码
//   if (document.head && !document.getElementById('module')) {
//     var script = document.createElement('script');
//     script.setAttribute('id', 'module');
//     script.innerHTML = "if (typeof module === 'object') {window.module = module; module = undefined;}"
//     document.head.appendChild(script);
//   }
//
// });
