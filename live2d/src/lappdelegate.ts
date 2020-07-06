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
import {LAppModel} from "./lappmodel";

export let canvas: HTMLCanvasElement = null;
export let s_instance: LAppDelegate = null;
export let gl: WebGLRenderingContext = null;
export let frameBuffer: WebGLFramebuffer = null;
export let scale: number = window.devicePixelRatio;
export let lAppDelegateEvent:LAppDelegateEvent = null;

let lastCalledTime;
let fps;
const { remote } = require('electron')
let curr_window = remote.getCurrentWindow();

interface LAppDelegateEvent {
    modelCompleteSetup();
}


/**
 * アプリケーションクラス。
 * Cubism SDKの管理を行う。
 */
export class LAppDelegate {
    /**
     * クラスのインスタンス（シングルトン）を返す。
     * インスタンスが生成されていない場合は内部でインスタンスを生成する。
     *
     * @return クラスのインスタンス
     */
    public static getInstance(): LAppDelegate {
        if (s_instance == null) {
            s_instance = new LAppDelegate();
        }

        return s_instance;
    }

    /**
     * クラスのインスタンス（シングルトン）を解放する。
     */
    public static releaseInstance(): void {
        if (s_instance != null) {
            s_instance.release();
        }

        s_instance = null;
    }

    /**
     * APPに必要な物を初期化する。
     */
    public initialize(): boolean {
        // キャンバスの作成
        canvas = document.createElement('canvas');

        canvas.width = LAppDefine.RenderTargetWidth;
        canvas.height = LAppDefine.RenderTargetHeight;

        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';

        canvas.width = canvas.width * scale;
        canvas.height = canvas.height * scale;

        // canvas.setAttribute('style','width:'+LAppDefine.RenderTargetWidth+'px;height:'+LAppDefine.RenderTargetHeight+'px');

        // glコンテキストを初期化
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

        // キャンバスを DOM に追加
        document.body.appendChild(canvas);

        if (!frameBuffer) {
            frameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        }

        // 透過設定
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const supportTouch: boolean = 'ontouchend' in canvas;

        // document.getElementsByName('body')[0].on
        if (supportTouch) {
            // タッチ関連コールバック関数登録
            canvas.ontouchstart = onTouchBegan;
            canvas.ontouchmove = onTouchMoved;
            canvas.ontouchend = onTouchEnded;
            canvas.ontouchcancel = onTouchCancel;
        } else {
            // マウス関連コールバック関数登録
            canvas.onmousedown = onClickBegan;
            canvas.onmousemove = onMouseMoved;
            canvas.onmouseup = onClickEnded;
            canvas.onmouseenter = onMouseEnter;
            canvas.onmouseleave = onMouseLeave;
        }

        // AppViewの初期化
        this._view.initialize();

        // Cubism SDKの初期化
        this.initializeCubism();

        return true;
    }

    /**
     * 解放する。
     */
    public release(): void {
        this._textureManager.release();
        this._textureManager = null;

        this._view.release();
        this._view = null;

        // リソースを解放
        LAppLive2DManager.releaseInstance();

        // Cubism SDKの解放
        Csm_CubismFramework.dispose();
    }

    /**
     * 実行処理。
     */
    public run(): void {
        let fps_element = document.createElement('div');
        fps_element.style.position = 'absolute';
        fps_element.style.right = '0';
        fps_element.style.top =  '0';
        fps_element.style.color = 'rebeccapurple';

        document.body.appendChild(fps_element)
        setInterval(function () {
            fps_element.innerText = 'fps:'+fps.toFixed(2);
        },1000)

        // メインループ
        const loop = (): void => {
            // インスタンスの有無の確認
            if (s_instance == null) {
                return;
            }
            // if(!lastCalledTime) {
            //     lastCalledTime = Date.now();
            //     fps = 0;
            //     return;
            // }
            let delta = (Date.now() - lastCalledTime)/1000;
            lastCalledTime = Date.now();
            fps = 1/delta;

            // 時間更新
            LAppPal.updateTime();

            // 画面の初期化
            gl.clearColor(0.0, 0.0, 0.0, 0.0);

            // 深度テストを有効化
            gl.enable(gl.DEPTH_TEST);

            // 近くにある物体は、遠くにある物体を覆い隠す
            gl.depthFunc(gl.LEQUAL);

            // カラーバッファや深度バッファをクリアする
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.clearDepth(1.0);

            // 透過設定
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            // 描画更新
            this._view.render();

            // 建立像素集合 这种方式性能canvas缓冲区越大越差
            // pixels  = new Uint8Array( canvas.width*canvas.height*4);
            // //从缓冲区读取像素数据，然后将其装到事先建立好的像素集合里
            // gl.readPixels(0, 0,gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

            // ループのために再帰呼び出し
            requestAnimationFrame(loop);
        };
        loop();
    }

    /**
     * シェーダーを登録する。
     */
    public createShader(): WebGLProgram {
        // バーテックスシェーダーのコンパイル
        const vertexShaderId = gl.createShader(gl.VERTEX_SHADER);

        if (vertexShaderId == null) {
            LAppPal.printMessage('failed to create vertexShader');
            return null;
        }

        const vertexShader: string =
            'precision mediump float;' +
            'attribute vec3 position;' +
            'attribute vec2 uv;' +
            'varying vec2 vuv;' +
            'void main(void)' +
            '{' +
            '   gl_Position = vec4(position, 1.0);' +
            '   vuv = uv;' +
            '}';

        gl.shaderSource(vertexShaderId, vertexShader);
        gl.compileShader(vertexShaderId);

        // フラグメントシェーダのコンパイル
        const fragmentShaderId = gl.createShader(gl.FRAGMENT_SHADER);

        if (fragmentShaderId == null) {
            LAppPal.printMessage('failed to create fragmentShader');
            return null;
        }

        const fragmentShader: string =
            'precision mediump float;' +
            'varying vec2 vuv;' +
            'uniform sampler2D texture;' +
            'void main(void)' +
            '{' +
            '   gl_FragColor = texture2D(texture, vuv);' +
            '}';

        gl.shaderSource(fragmentShaderId, fragmentShader);
        gl.compileShader(fragmentShaderId);

        // プログラムオブジェクトの作成
        const programId = gl.createProgram();
        gl.attachShader(programId, vertexShaderId);
        gl.attachShader(programId, fragmentShaderId);

        gl.deleteShader(vertexShaderId);
        gl.deleteShader(fragmentShaderId);

        // リンク
        gl.linkProgram(programId);

        gl.useProgram(programId);

        return programId;
    }

    /**
     * View情報を取得する。
     */
    public getView(): LAppView {
        return this._view;
    }

    public setLappModelEvent(call:LAppDelegateEvent){
        lAppDelegateEvent = call;
    }

    public getTextureManager(): LAppTextureManager {
        return this._textureManager;
    }

    /**
     * コンストラクタ
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
     * Cubism SDKの初期化
     */
    public initializeCubism(): void {
        // setup cubism
        this._cubismOption.logFunction = LAppPal.printMessage;
        this._cubismOption.loggingLevel = LAppDefine.CubismLoggingLevel;
        Csm_CubismFramework.startUp(this._cubismOption);

        // initialize cubism
        Csm_CubismFramework.initialize();

        // load model
        LAppLive2DManager.getInstance();

        LAppPal.updateTime();

        this._view.initializeSprite();
    }

    _cubismOption: Csm_Option; // Cubism SDK Option
    _view: LAppView; // View情報
    _captured: boolean; // 点击了吗?
    _mouseX: number; // X坐标
    _mouseY: number; // 鼠标Y坐标
    _isEnd: boolean; // APP終了しているか
    _textureManager: LAppTextureManager; // テクスチャマネージャー
}

function onMouseLeave() {
    console.log("划出去")


}

function onMouseEnter(e: MouseEvent) {
    e.preventDefault()
    console.log("划进来")

}

/**
 * クリックしたときに呼ばれる。
 */
function onClickBegan(e: MouseEvent): void {
    LAppPal.log('click_began')
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
export function hitModel(posX,posY) {
    let view = LAppDelegate.getInstance().getView()
    const viewX: number = view.transformViewX(posX);
    const viewY: number = view.transformViewY(posY);
    return LAppLive2DManager.getInstance().hitModel(viewX,viewY)
    // console.log(pixels) 配合loop里的readPixels 虽然性能较差，但可以控制的点很多，比如像素颜色
    // return pixels[((posY * (canvas.width * 4)) + (posX * 4)) + 3] > 0;
}

/**
 * マウスポインタが動いたら呼ばれる。
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
    if (!hitModel(posX,posY)){
        //整个app 忽略所有点击事件
        curr_window.setIgnoreMouseEvents(true, { forward: true })
        LAppPal.log(true,'move')
    }else{
        curr_window.setIgnoreMouseEvents(false,{ forward: true })
        LAppPal.log(false,'move')
    }
    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);


}

/**
 * クリックが終了したら呼ばれる。
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
    LAppPal.log('点击')
    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}

/**
 * タッチしたときに呼ばれる。
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
 * スワイプすると呼ばれる。
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
 * タッチが終了したら呼ばれる。
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
 * タッチがキャンセルされると呼ばれる。
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
