## 环境
1. chrome 83.0.4103.64
2. node 12.14.1
3. electron 9.0.0
4. Live2D Cubism Core version: 04.00.0000 (67108864)

## 主要功能

1. 窗口置顶
2. 窗口透明
3. `live2d`的透明区域点击穿透
4. 窗口在dock层显示
5. `live2d`的sdk与`electron`关联-`electron`的`node`提供应用后端支持，`live2d`提供前端展示。
6. electron与osx端关联-osx端提供应用的应用级底层支持
7. `ejs`端的网络请求模块,对`Promise`做的一些理解性的注释
8. 实现了`websocket`服务
9. `js` 与 `ts` 打包后的 `js` 代码通信问题
10. `node-imap` `mail-listener5` 邮件监听，随时获取最新邮件信息
11. `opencv-node` 准备接入人脸扫描，期望达到类似`faceicg` 的效果,`face-api`可以研究
12. `cron` 定时任务库引入
13. `Volume.js` 声音控制

## 项目开始

### 本项目食用方法

为了方便后面 `electronjs`

0. 分别进入 `panel` | `live2d` | 还有根目录 `/` 运行 `yarn` 初始化构建一下，3个缺一不可

1. 启动 `electronjs` 命令：`yarn ; yarn run start` 正常的话这时桌面应该有模型被显示了
2. 启动 `live2d` 热更新 命令：`cd live2d ; yarn ; yarn run start` 这一步是为了开启热更新，方便修改
3. 不想开启热更新的话可以在 `cd live2d` 目录下面使用`yarn run build` 此时会更新 `live2d` 目录下的 `dict` 文件夹
4. 默认为`debug`模式，可手动修改`src/Config.js`中的`debug`为`false`

> 上面的流程走完，出现Buffer警告解决方案，其实不管也没什么关系，强迫症看着不舒服可以用下面的方法

使用项目`./patches`目录下的补丁文件

```git
# 项目根目录运行
git apply --ignore-whitespace patches/imap+0.8.19.patch
```

> tips

主进程的处理逻辑都在 `app/main/` 目录下
渲染进程的逻辑 `app/renderer/` 目录下

> 重要文件

1. `app/main/libs/Config.js` 应用配置整个app都可以拿到的配置属性
2. `live2d/src/lappdefine.ts` live2d的配置，像更换模型，和live2d有关的都在这里
3. `app/main/loads/EmailListen.js` 可以配置一些邮件方面的东西
4. `app/main/loads/WebSocket.js` websocket相关的代码在这个文件里面
5. `app/main/loads/log.js` 应用的node层全局有`log(any,tag)`方法,打印log
6. `app/main/renderer/renderer.js` renderer（渲染）层也定义了一个`log(any,tag)` 方法，输出与node层的一样，同样在渲染层可用


## 运行
> 正常显示

![](https://raw.githubusercontent.com/LikeNeko/L2dPetForMac/master/images/Snipaste_2020-07-10_10-34-04.jpg)

> Dock栏级别的显示

![](https://raw.githubusercontent.com/LikeNeko/L2dPetForMac/master/images/2020-07-07-020929.jpeg)

> 邮件获取截图

![图片](https://raw.githubusercontent.com/LikeNeko/L2dPetForMac/master/images/2020-07-09-132033.jpeg)

> 左边是model模型，右边是model3模型 ps:实验性测试,结论是ok的

![图片](https://raw.githubusercontent.com/LikeNeko/L2dPetForMac/master/images/2020-07-02-094546.jpeg)

## 开发需要技术栈

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
2. cpu占用率过高-因为live2dsdk4的渲染是使用的cpu，导致`drawImage`方法太费cpu资源了。后续可以优化一下
