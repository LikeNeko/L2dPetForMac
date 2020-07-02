import "./framework/live2d.min.js"
import "./framework/LAppDefine.js"
import {
    LAppLive2DManager,
    L2DTargetPoint,
    L2DViewMatrix,
    L2DMatrix44,
    MatrixStack,
} from "./framework/core.js"

let scale = window.devicePixelRatio;


let appdelegate_one = null;

function AppDelegate() {
    this.platform = window.navigator.platform.toLowerCase();
    this.live2DMgr = new LAppLive2DManager();
    this.isDrawStart = false;
    this.gl = null;
    this.canvas = null;
    this.dragMgr = null;
    this.viewMatrix = null;
    this.projMatrix = null;
    this.deviceToScreen = null;
    this.drag = false;
    this.oldLen = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.isModelShown = false;
    this.initL2dCanvas(LAppDefine.CANVAS_ID);
    this.init();
    this.viewMatrix.adjustScale(0, 0, LAppDefine.SCALE)
}

AppDelegate.getInstance = function () {
    if (appdelegate_one) return appdelegate_one;
    appdelegate_one = new AppDelegate();
    return appdelegate_one;
}


AppDelegate.prototype.initL2dCanvas = function (canvasId) {
    // キャンバスの作成
    let canvas = document.createElement('canvas');

    canvas.id = canvasId;
    canvas.width = LAppDefine.RenderTargetWidth;
    canvas.height = LAppDefine.RenderTargetHeight;

    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.style.position = "absolute";

    canvas.width = canvas.width * scale;
    canvas.height = canvas.height * scale;
    log(scale,'缩放倍数')
    // キャンバスを DOM に追加
    document.body.appendChild(canvas);
    this.canvas = canvas;
    log(this.canvas)
    if (this.canvas.addEventListener) {
        if (LAppDefine.IS_SCROLL_SCALE) {
            this.canvas.addEventListener("mousewheel", mouseEvent, false)
        }
        this.canvas.addEventListener("click", mouseEvent, false);
        this.canvas.addEventListener("mousedown", mouseEvent, false);
        this.canvas.addEventListener("mousemove", mouseEvent, false);
        this.canvas.addEventListener("mouseup", mouseEvent, false);
        this.canvas.addEventListener("mouseout", mouseEvent, false);
        this.canvas.addEventListener("contextmenu", mouseEvent, false);
        this.canvas.addEventListener("touchstart", touchEvent, false);
        this.canvas.addEventListener("touchend", touchEvent, false);
        this.canvas.addEventListener("touchmove", touchEvent, false)
    }
    if (LAppDefine.IS_BIND_BUTTON) {
        let btnChangeModel = document.getElementById(LAppDefine.BUTTON_ID);
        btnChangeModel.addEventListener("click", function (e) {
            this.changeModel()
        })
    }
    if (LAppDefine.IS_START_TEXURE_CHANGE) {
        let btnChangeExure = document.getElementById(LAppDefine.TEXURE_BUTTON_ID);
        btnChangeExure.addEventListener('click', function (e) {
            this.changeTextures()
        })
    }
}

AppDelegate.prototype.init = function () {

    var width = this.canvas.width;
    var height = this.canvas.height;
    this.dragMgr = new L2DTargetPoint();
    var ratio = height / width;
    var left = LAppDefine.VIEW_LOGICAL_LEFT;
    var right = LAppDefine.VIEW_LOGICAL_RIGHT;
    var bottom = -ratio;
    var top = ratio;
    this.viewMatrix = new L2DViewMatrix();
    this.viewMatrix.setScreenRect(left, right, bottom, top);
    this.viewMatrix.setMaxScreenRect(LAppDefine.VIEW_LOGICAL_MAX_LEFT, LAppDefine.VIEW_LOGICAL_MAX_RIGHT, LAppDefine.VIEW_LOGICAL_MAX_BOTTOM, LAppDefine.VIEW_LOGICAL_MAX_TOP);
    this.viewMatrix.setMaxScale(LAppDefine.VIEW_MAX_SCALE);
    this.viewMatrix.setMinScale(LAppDefine.VIEW_MIN_SCALE);
    this.projMatrix = new L2DMatrix44();
    this.projMatrix.multScale(1, (width / height));
    this.deviceToScreen = new L2DMatrix44();
    this.deviceToScreen.multTranslate(-width / 2.0, -height / 2.0);
    this.deviceToScreen.multScale(2 / width, -2 / width);
    this.gl = this.getWebGLContext();
    if (!this.gl) {
        console.log("Failed to create WebGL context.");
        return
    }
    Live2D.setGL(this.gl);
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.changeModel();
}

AppDelegate.prototype.startDraw = function () {
    if (!this.isDrawStart) {
        this.isDrawStart = true;
        let tick = function () {
            AppDelegate.getInstance().draw();
            var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            requestAnimationFrame(tick, AppDelegate.getInstance().canvas)
        }
        tick()
    }
}

AppDelegate.prototype.draw = function () {
    MatrixStack.reset();
    MatrixStack.loadIdentity();
    this.dragMgr.update();
    this.live2DMgr.setDrag(this.dragMgr.getX(), this.dragMgr.getY());
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    MatrixStack.multMatrix(this.projMatrix.getArray());
    MatrixStack.multMatrix(this.viewMatrix.getArray());
    MatrixStack.push();
    for (var i = 0; i < this.live2DMgr.numModels(); i++) {
        var model = this.live2DMgr.getModel(i);
        if (model == null) return;
        if (model.initialized && !model.updating) {
            model.update();
            model.draw(this.gl);
            if (!this.isModelShown && i == this.live2DMgr.numModels() - 1) {
                this.isModelShown = !this.isModelShown;
                if (!LAppDefine.IS_BIND_BUTTON || !LAppDefine.IS_BAN_BUTTON) return;
                var btnChange = document.getElementById(LAppDefine.BUTTON_ID);
                btnChange.removeAttribute("disabled");
                btnChange.setAttribute("class", LAppDefine.NORMAL_BUTTON_CLASS)
            }
        }
    }
    MatrixStack.pop()
}
// 切换贴图
AppDelegate.prototype.changeTextures = function () {
    this.isModelShown = false;
    this.live2DMgr.reloadFlg = true;
    this.live2DMgr.changeTexure(this.gl)
}

/**
 * 切换模型
 */
AppDelegate.prototype.changeModel = function () {
    var btnChange = document.getElementById(LAppDefine.BUTTON_ID);
    if (LAppDefine.IS_BIND_BUTTON && LAppDefine.IS_BAN_BUTTON) {
        btnChange.setAttribute("disabled", "disabled");
        btnChange.setAttribute("class", LAppDefine.BAN_BUTTON_CLASS)
    }
    this.isModelShown = false;
    this.live2DMgr.reloadFlg = true;
    this.live2DMgr.count++;
    this.live2DMgr.changeModel(this.gl)
}

AppDelegate.modelScaling = function (scale) {
    var isMaxScale = this.viewMatrix.isMaxScale();
    var isMinScale = this.viewMatrix.isMinScale();
    this.viewMatrix.adjustScale(0, 0, scale);
    if (!isMaxScale) {
        if (this.viewMatrix.isMaxScale()) {
            this.live2DMgr.maxScaleEvent()
        }
    }
    if (!isMinScale) {
        if (this.viewMatrix.isMinScale()) {
            this.live2DMgr.minScaleEvent()
        }
    }
}

AppDelegate.prototype.modelTurnHead = function (event) {
    this.drag = true;
    var rect = event.target.getBoundingClientRect();
    var sx = this.transformScreenX(event.clientX - rect.left);
    var sy = this.transformScreenY(event.clientY - rect.top);
    var vx = this.transformViewX(event.clientX - rect.left);
    var vy = this.transformViewY(event.clientY - rect.top);
    if (LAppDefine.DEBUG_MOUSE_LOG) l2dLog("onMouseDown device( x:" + event.clientX + " y:" + event.clientY + " ) view( x:" + vx + " y:" + vy + ")");
    this.lastMouseX = sx;
    this.lastMouseY = sy;
    this.dragMgr.setPoint(vx, vy);
    this.live2DMgr.tapEvent(vx, vy)
}

AppDelegate.prototype.followPointer = function (event) {
    var rect = event.target.getBoundingClientRect();
    var sx = this.transformScreenX(event.clientX - rect.left);
    var sy = this.transformScreenY(event.clientY - rect.top);
    var vx = this.transformViewX(event.clientX - rect.left);
    var vy = this.transformViewY(event.clientY - rect.top);
    if (LAppDefine.DEBUG_MOUSE_LOG) l2dLog("onMouseMove device( x:" + event.clientX + " y:" + event.clientY + " ) view( x:" + vx + " y:" + vy + ")");
    if (this.drag) {
        this.lastMouseX = sx;
        this.lastMouseY = sy;
        this.dragMgr.setPoint(vx, vy)
    }
}

AppDelegate.prototype.lookFront = function () {
    if (this.drag) {
        this.drag = false
    }
    this.dragMgr.setPoint(0, 0)
}

function mouseEvent(e) {
    e.preventDefault();
    let app = AppDelegate.getInstance();
    if (e.type == "mousewheel") {
        if (e.wheelDelta > 0) app.modelScaling(1.1);
        else app.modelScaling(0.9)
    } else if (e.type == "mousedown") { //按键被按下触发
        if ("button" in e && e.button != 0) {
            return;
        }
        app.modelTurnHead(e)
    } else if (e.type == "mousemove") {
        app.modelTurnHead(e)
    } else if (e.type == "mouseup") {
        if ("button" in e && e.button != 0) return;
        app.lookFront()
    } else if (e.type == "mouseout") {
        app.lookFront()
    } else if (e.type == "contextmenu") {
        if (!LAppDefine.IS_BIND_BUTTON) {
            return;
        }
        app.changeModel()
    }
}

function touchEvent(e) {
    e.preventDefault();
    let app = AppDelegate.getInstance();
    var touch = e.touches[0];
    if (e.type == "touchstart") {
        if (e.touches.length == 1) app.modelTurnHead(touch)
    } else if (e.type == "touchmove") {
        app.followPointer(touch);
        if (e.touches.length == 2) {
            var touch1 = e.touches[0];
            var touch2 = e.touches[1];
            var len = Math.pow(touch1.pageX - touch2.pageX, 2) + Math.pow(touch1.pageY - touch2.pageY, 2);
            if (app.oldLen - len < 0) app.modelScaling(1.025);
            else app.modelScaling(0.975);
            app.oldLen = len
        }
    } else if (e.type == "touchend") {
        app.lookFront()
    }
}

AppDelegate.prototype.transformViewX = function (deviceX) {
    var screenX = this.deviceToScreen.transformX(deviceX);
    return this.viewMatrix.invertTransformX(screenX)
}

AppDelegate.prototype.transformViewY = function (deviceY) {
    var screenY = this.deviceToScreen.transformY(deviceY);
    return this.viewMatrix.invertTransformY(screenY)
}


AppDelegate.prototype.transformScreenX = function (deviceX) {
    return this.deviceToScreen.transformX(deviceX)
}

AppDelegate.prototype.transformScreenY = function (deviceY) {
    return this.deviceToScreen.transformY(deviceY)
}

AppDelegate.prototype.getWebGLContext = function () {
    var NAMES = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    for (var i = 0; i < NAMES.length; i++) {
        try {
            var ctx = this.canvas.getContext(NAMES[i], {
                premultipliedAlpha: true
            });
            if (ctx) return ctx
        } catch (e) {
            log(e)
        }
    }
    return null
};

function l2dLog(msg) {
    if (!LAppDefine.DEBUG_LOG) return;
    console.log(msg)
}

function autoPlayMusic() {
    // if(navigator.platform.indexOf('Win32') != -1
    // 	|| navigator.platform.indexOf('MacIntel') != -1){
    // 	return;
    //  }
    function musicInBrowserHandler() {
        musicPlay(true);
        document.body.removeEventListener('touchstart', musicInBrowserHandler)
    }

    document.body.addEventListener('touchstart', musicInBrowserHandler);

    function musicInWeixinHandler() {
        musicPlay(true);
        document.addEventListener("WeixinJSBridgeReady", function () {
            musicPlay(true)
        }, false);
        document.removeEventListener('DOMContentLoaded', musicInWeixinHandler)
    }

    document.addEventListener('DOMContentLoaded', musicInWeixinHandler)
}

function musicPlay(isPlay) {
    var audio = document.getElementById(LAppDefine.AUDIO_ID);
    audio.play();
}

autoPlayMusic();
AppDelegate.getInstance().startDraw();
