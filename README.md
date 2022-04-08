# L2dPetForMac/Live2d桌宠

## 前言

希望有生之年整合完善所有功能点，成为可配置，可扩展，可自定义的多功能应用。

持续维护中 - 20200831 - 20220330 - 时隔2年重构一次

## 作者的逼逼叨

* 因为本是程序员，想要在Mac上运行一个可爱的小萝莉很久了。苦于Mac市场目前我找了很久都没找到符合心意的项目。
* 于是自己写了一套并且开源！
* 然后目前项目初期,现阶段可能类似demo版本，整个项目需要的所有技术点对我而言都是直接上手，代码可能不会很优雅。
* 如果你会js，node，你将很容易玩转这个项目！因为我已经给你搭好架子了。（踩了超多坑！！！
* 最后:如果你喜欢live2d，喜欢这个项目,欢迎fork,反馈,一定第一时间解答!

## 环境 
### 小于2.0.0
1. chrome 83.0.4103.64
2. node 12.14.1
3. electron 9.1.0
4. Live2D Cubism Core version: 04.00.0000 (67108864)

### 2.0.0
1. chrome 83.0.4103.64
2. node 12.14.1
3. electron 12.2.3
4. Live2D Cubism Core version: 4.1.0


## 主要功能

1. 窗口置顶 
2. 窗口透明 [透明无边框](https://github.com/LikeNeko/L2dPetForMac/blob/remould/app/main/WindowsManager.js#L22)
3. `live2d`的透明区域点击穿透
4. 窗口在dock层显示 [源码在这里](https://github.com/LikeNeko/L2dPetForMac/blob/remould/panel/functions_mac.cc#L78)
9. `js` 与 `ts` 打包后的 `js` 代码通信问题 [主要通过window通信](https://github.com/LikeNeko/L2dPetForMac/blob/remould/live2d/src/main.ts#L17)
10. `node-imap` `mail-listener5` 邮件监听，随时获取最新邮件信息
13. `Volume.js` 声音控制
14. 谷歌浏览器历史记录实时获取-重构为插件模式
15. `sqlite3`加入为了读取Chrome的sqlite
16. 引入`openBES`弹幕系统
18. 拖动移动位置

待重构:
1. sqlite 封装
2. mail-listener5 会报Buffer 
4. chrome 通过插件注入 live2d模型
5. `opencv-node` 准备接入人脸扫描，期望达到类似`faceicg` 的效果,`face-api`可以研究还是有些问题需要解决[x]
## 项目开始

### 本项目食用方法

> 开发版

为了方便后面 `electronjs`

0. 分别进入 `panel` | `live2d` | 还有根目录 `/` 运行 `yarn` 初始化构建一下，3个缺一不可

1. 启动 `electronjs` 命令：`yarn ; yarn run start` 正常的话这时桌面应该有模型被显示了
2. 启动 `live2d` 热更新 命令：`cd live2d ; yarn ; yarn run start` 这一步是为了开启热更新，方便修改
3. 不想开启热更新的话可以在 `cd live2d` 目录下面使用`yarn run build` 此时会更新 `live2d` 目录下的 `dict` 文件夹
4. 默认为`debug`模式，可手动修改`app/libs/Config.js`中的`debug`为`false`

5. `cmd + p` 打开界面里的debug视图

6. `yarn run download_vue_element_ui` vue相关的需要执行这个命令

7. `yarn global add imagezip` 全局安装压缩图片的命令或者项目安装`yarn add imagezip`

> tips

主进程的处理逻辑都在 `app/main/` 目录下
渲染进程的逻辑 `app/renderer/` 目录下


## 运行
> 正常显示

![](https://raw.githubusercontent.com/LikeNeko/L2dPetForMac/master/images/Snipaste_2020-07-10_10-34-04.jpg)

> Dock栏级别的显示

![](https://raw.githubusercontent.com/LikeNeko/L2dPetForMac/master/images/2020-07-07-020929.jpeg)

> 邮件获取截图

![图片](https://raw.githubusercontent.com/LikeNeko/L2dPetForMac/master/images/2020-07-09-132033.jpeg)

> 监听Chrome浏览截图

![](https://raw.githubusercontent.com/LikeNeko/L2dPetForMac/master/images/2020-07-20-030601.png)


> 弹幕功能

![](https://raw.githubusercontent.com/LikeNeko/L2dPetForMac/master/images/2020-07-23-114246.png)

> 左边是model模型，右边是model3模型 ps:实验性测试,结论是ok的，就是支持live2d可以加载不同版本的模型

![图片](https://raw.githubusercontent.com/LikeNeko/L2dPetForMac/master/images/2020-07-02-094546.jpeg)

## fork前需要技术栈

1. js `live2d` 4.0打包之后是这个
2. ts `live2d` 4.0的sdk需要这个
3. nodejs electron需要这个
4. oc 需要了解程度，窗口顶端化需要这个语言
5. c++ 需要了解程度，涉及到nodejs和oc通信
6. webgl 需要有了解，`live2d`展示核心是这个
7. 需要看一遍 electron 的官网那些文档最起码的概念要知道 [官网文档](https://www.electronjs.org/docs)
8. live2d 官网的sdk文档，建议每个字都去看一下，建议选日语或者英语用`chrome浏览器`自带的翻译看，官网的机翻更渣 [live2d官网文档4.0](https://docs.live2d.com/cubism-sdk-manual/top/?locale=ja) 

## 已知bug

1. loop方法更新动画时会出现警告-[已解决]原因是为了实现透明区域点击穿透导致的性能问题。


## 需要优化

1. cpu占用率过高-因为live2dsdk4的渲染是使用的cpu，导致`drawImage`方法太费cpu资源了。后续可以优化一下

## 依赖

由此项目扩展出的让窗口置顶的方法

[electron-panel-window 魔改](https://github.com/goabstract/electron-panel-window)