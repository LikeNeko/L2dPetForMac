## 环境
1. chrome 83.0.4103.64
2. node 12.14.1
3. electron 9.0.0
4. Live2D Cubism Core version: 04.00.0000 (67108864)

## 需要技术栈

1. js `live2d` 4.0打包之后是这个
2. ts `live2d` 4.0的sdk需要这个
3. nodejs electron需要这个
4. oc 需要了解程度，窗口顶端化需要这个语言
5. c++ 需要了解程度，涉及到nodejs和oc通信
6. webgl 需要有了解，`live2d`展示核心是这个
7. 需要看一遍 electron 的官网那些文档最起码的概念要知道 [官网文档](https://www.electronjs.org/docs)
8. live2d 官网的sdk文档，建议每个字都去看一下，建议选日语或者英语用`chrome浏览器`自带的翻译看，官网的机翻更渣 [live2d官网文档4.0](https://docs.live2d.com/cubism-sdk-manual/top/?locale=ja) 

## 主要功能

1. 窗口置顶
2. 窗口透明
3. `live2d`的透明区域点击穿透
4. 窗口在dock层显示
5. `live2d`的sdk与`electron`关联-`electron`的`node`提供应用后端支持，`live2d`提供前端展示。
6. electron与osx端关联-osx端提供应用的应用级底层支持

## 项目开始

### 开始构建项目

为了方便后面 `electronjs` 统称`ejs`

0. 分别进入 `panel` | `live2d` | 还有根目录 `/` 运行 `yarn` 初始化构建一下，3个缺一不可

1. 启动 `ejs` 命令：`yarn ; yarn run start` 正常的话这时桌面应该有模型被显示了
2. 启动 `live2d` 热更新 命令：`cd live2d ; yarn ; yarn run start` 这一步是为了开启热更新，方便修改
3. 不想开启热更新的话可以在 `cd live2d` 目录下面使用`yarn run build` 此时会更新 `live2d` 目录下的 `dict` 文件夹

## 已知bug

1. loop方法更新动画时会出现警告
