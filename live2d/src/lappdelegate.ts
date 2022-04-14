/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import {
    Live2DCubismFramework as live2dcubismframework,
    Option as Csm_Option
} from '@framework/live2dcubismframework';
import Csm_CubismFramework = live2dcubismframework.CubismFramework;
import {LAppView} from './lappview';
import {LAppPal} from './lapppal';
import {LAppTextureManager} from './lapptexturemanager';
import {LAppLive2DManager} from './lapplive2dmanager';
import * as LAppDefine from './lappdefine';
import {DebugLogEnable} from './lappdefine';
import {LStore} from './lstore';
import {twgl} from "./lcanvas";

export let canvas: HTMLCanvasElement = null;
export let s_instance: LAppDelegate = null;
export let gl: WebGLRenderingContext = null;
export let frameBuffer: WebGLFramebuffer = null;
export let scale: number = window.devicePixelRatio;
export let lAppDelegateEvent: LAppDelegateEvent = null;


interface LAppDelegateEvent {
    modelCompleteSetup();
}


/**
 *  应用程序类
 *  管理Cubism SDK。
 */
export class LAppDelegate {
    /**
     *  Live2d renders with view classes
     */
    _canvas: HTMLCanvasElement;

    /**
     *  返回类的实例(singleton)。
     *  如果没有生成实例，则在内部生成实例。
     *
     *  @return {LAppDelegate}
     */
    public static getInstance(): LAppDelegate {
        if (s_instance == null) {
            s_instance = new LAppDelegate();
        }

        return s_instance;
    }

    /**
     *  释放类的实例(singleton)。
     */
    public static releaseInstance(): void {
        if (s_instance != null) {
            s_instance.release();
        }

        s_instance = null;
    }

    /**
     *  Initial Configuration
     */
    public initDefine() {
        LStore.set('ModelDir', LAppDefine.ModelDir)
        LStore.set("ResourcesPath", LAppDefine.ResourcesPath)
    }

    /**
     *  初始化APP所需的物品。
     */
    public initialize(): boolean {
        this.initDefine();
        // 帆布制作
        canvas = document.createElement('canvas');
        this._canvas = canvas;
        canvas.id = 'live2d';
        canvas.width = LAppDefine.RenderTargetWidth;
        canvas.height = LAppDefine.RenderTargetHeight;

        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';

        canvas.width = canvas.width * scale;
        canvas.height = canvas.height * scale;

        // Gl环境初始化
        // @ts-ignore
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');


        if (!gl) {
            alert('Cannot initialize WebGL. This browser does not support.');
            gl = null;

            document.body.innerHTML =
                'This browser does not support the <code>&lt;canvas&gt;</code> element.';

            // gl初期化失敗
            return false;
        }

        document.body.appendChild(canvas);

        if (!frameBuffer) {
            frameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        }

        // 透過設定
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const supportTouch: boolean = 'ontouchend' in canvas;

        if (supportTouch) {
            // 点击关联回调函数注册
            canvas.ontouchstart = onTouchBegan;
            canvas.ontouchmove = onTouchMoved;
            canvas.ontouchend = onTouchEnded;
            canvas.ontouchcancel = onTouchCancel;
        } else {
            // 鼠标关联回调函数注册
            canvas.onmousedown = onClickBegan;
            canvas.onmousemove = onMouseMoved;
            canvas.onmouseup = onClickEnded;
            canvas.onmouseenter = onMouseEnter;
            canvas.onmouseleave = onMouseLeave;
        }

        // 初始化AppView
        this._view.initialize();

        // 立体主义SDK初始化
        this.initializeCubism();

        return true;
    }

    /**
     *  解放
     */
    public release(): void {
        this._textureManager.release();
        this._textureManager = null;

        this._view.release();
        this._view = null;

        // Free resources
        LAppLive2DManager.releaseInstance();

        // Liberation of the Cubism SDK
        Csm_CubismFramework.dispose();
    }

    /**
     *  执行处理
     */
    public run(): void {
        if (DebugLogEnable) {
            // @ts-ignore
            var stats = new Stats();
            stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(stats.dom);
        }


        // 主循环
        const loop = (): void => {
            if (DebugLogEnable) {
                stats.begin();
            }
            // インスタンスの有無の確認
            if (s_instance == null) {
                return;
            }

            // 時間更新
            LAppPal.updateTime();

            // 画面の初期化
            gl.clearColor(0.0, 0.0, 0.0, 0.0);

            // 深度テストを有効化
            gl.enable(gl.DEPTH_TEST);

            // 近处的物体会使远处的物体变得模糊
            gl.depthFunc(gl.LEQUAL);

            // 清除颜色缓冲和深度缓冲
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.clearDepth(1.0);

            // 透过设置
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            // 地图更新
            this._view.render();

            if (DebugLogEnable) {
                stats.end();
            }
            // Recursive call loop
            requestAnimationFrame(loop);
        };
        loop();
    }

    /**
     * 注册着色器。
     */
    public createShader(): WebGLProgram {
        let vertexShader: string = '' +
            'precision mediump float;' +
            'attribute vec2 a_position;\n' +
            'attribute vec2 uv;' +
            'uniform mat3 u_matrix;\n' +
            'varying vec2 vuv;' +
            'void main() {\n' +
            '  // 使位置和矩阵相乘\n' +
            '  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);' +
            '  vuv = uv;' +
            '}'
        const fragmentShader: string =
            'precision mediump float;' +
            'varying vec2 vuv;' +
            'uniform sampler2D texture;' +
            'void main(void)' +
            '{' +
            '   gl_FragColor = texture2D(texture, vuv);' +
            '}';
        let program = twgl.createProgram(gl, [vertexShader, fragmentShader])

        gl.useProgram(program);
        return program;
    }


    /**
     *  获取View信息。
     */
    public getView(): LAppView {
        return this._view;
    }

    public setLappModelEvent(call: LAppDelegateEvent) {
        lAppDelegateEvent = call;
    }

    public getTextureManager(): LAppTextureManager {
        return this._textureManager;
    }

    /**
     *  构造函数
     */
    constructor() {
        this._captured = false;
        this._mouseX = 0.0;
        this._mouseY = 0.0;
        this._isEnd = false;

        this._cubismOption = new Csm_Option();
        this._view = new LAppView();
        this._textureManager = new LAppTextureManager();
    }

    /**
     *  Cubism SDK的初始化
     */
    public initializeCubism(): void {
        // Setting cubism
        this._cubismOption.logFunction = LAppPal.printMessage;
        this._cubismOption.loggingLevel = LAppDefine.CubismLoggingLevel;
        Csm_CubismFramework.startUp(this._cubismOption);

        // Initializing cubism
        Csm_CubismFramework.initialize();

        // Load model
        LAppLive2DManager.getInstance();

        LAppPal.updateTime();

        this._view.initializeSprite();
    }

    _cubismOption: Csm_Option; // Cubism SDK option
    _view: LAppView; // View情报
    _captured: boolean; // 你点击了吗?
    _mouseX: number; // X坐标
    _mouseY: number; // 鼠标坐标
    _isEnd: boolean; // APP是否关闭
    _textureManager: LAppTextureManager; // Texture management
}

function onMouseLeave() {
    LAppPal.log("划出去")

    const live2DManager: LAppLive2DManager = LAppLive2DManager.getInstance();
    live2DManager.onDrag(0.0, 0.0);

}

function onMouseEnter(e: MouseEvent) {
    e.preventDefault()
    LAppPal.log("划进来")

}

/**
 *  点击的时候被叫到。
 */
function onClickBegan(e: MouseEvent): void {
    if (!LAppDelegate.getInstance()._view) {
        LAppPal.printMessage('view notfound');
        return;
    }
    LAppDelegate.getInstance()._captured = true;

    let posX: number = e.pageX;
    let posY: number = e.pageY;
    posX *= scale;
    posY *= scale;

    LAppDelegate.getInstance()._view.onTouchesBegan(posX, posY);

}

export function hitModel(posX, posY) {
    let view = LAppDelegate.getInstance().getView()
    const viewX: number = view.transformViewX(posX);
    const viewY: number = view.transformViewY(posY);
    return LAppLive2DManager.getInstance().hitModel(viewX, viewY)
}

/**
 *  鼠标指针一动就叫。
 */
function onMouseMoved(e: MouseEvent): void {
    // if (!LAppDelegate.getInstance()._captured) {
    //     return;
    // }

    if (!LAppDelegate.getInstance()._view) {
        LAppPal.printMessage('view notfound');
        return;
    }

    const rect = (e.target as Element).getBoundingClientRect();
    let posX: number = e.clientX - rect.left;
    let posY: number = e.clientY - rect.top;
    posX *= scale;
    posY *= scale;
    let hit = LAppLive2DManager.getInstance();
    let hitstr = hit.isHit(posX, posY);
    // 设定了监听就走不管有没有hit
    if (hit.move_hit) {
        hit.move_hit(hitstr)
    }

    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);

}

/**
 *  点击结束后就会叫我。
 */
function onClickEnded(e: MouseEvent): void {
    LAppDelegate.getInstance()._captured = false;
    if (!LAppDelegate.getInstance()._view) {
        LAppPal.printMessage('view notfound');
        return;
    }

    const rect = (e.target as Element).getBoundingClientRect();
    let posX: number = e.clientX - rect.left;
    let posY: number = e.clientY - rect.top;
    // 解决模糊问题
    posX *= scale;
    posY *= scale;
    let hit = LAppLive2DManager.getInstance();
    let hitstr = hit.isHit(posX, posY);
    if (hitstr != "" && hit.click_hit) {
        hit.click_hit(hitstr)
    }
    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}

/**
 *  触摸的时候被叫。
 */
function onTouchBegan(e: TouchEvent): void {
    if (!LAppDelegate.getInstance()._view) {
        LAppPal.printMessage('view notfound');
        return;
    }

    LAppDelegate.getInstance()._captured = true;

    let posX = e.changedTouches[0].pageX;
    let posY = e.changedTouches[0].pageY;
    posX *= scale;
    posY *= scale;
    LAppDelegate.getInstance()._view.onTouchesBegan(posX, posY);
}

/**
 *  被称为滑动。
 */
function onTouchMoved(e: TouchEvent): void {
    if (!LAppDelegate.getInstance()._captured) {
        return;
    }

    if (!LAppDelegate.getInstance()._view) {
        LAppPal.printMessage('view notfound');
        return;
    }

    const rect = (e.target as Element).getBoundingClientRect();

    let posX = e.changedTouches[0].clientX - rect.left;
    let posY = e.changedTouches[0].clientY - rect.top;
    posX *= scale;
    posY *= scale;
    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);
}

/**
 *  触摸结束后被叫。
 */
function onTouchEnded(e: TouchEvent): void {
    LAppDelegate.getInstance()._captured = false;

    if (!LAppDelegate.getInstance()._view) {
        LAppPal.printMessage('view notfound');
        return;
    }

    const rect = (e.target as Element).getBoundingClientRect();

    let posX = e.changedTouches[0].clientX - rect.left;
    let posY = e.changedTouches[0].clientY - rect.top;
    posX *= scale;
    posY *= scale;
    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}

/**
 *  触摸被取消。
 */
function onTouchCancel(e: TouchEvent): void {
    LAppDelegate.getInstance()._captured = false;

    if (!LAppDelegate.getInstance()._view) {
        LAppPal.printMessage('view notfound');
        return;
    }

    const rect = (e.target as Element).getBoundingClientRect();

    const posX = e.changedTouches[0].clientX - rect.left;
    const posY = e.changedTouches[0].clientY - rect.top;

    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}
