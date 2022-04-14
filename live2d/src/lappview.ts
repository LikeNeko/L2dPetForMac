/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import {Live2DCubismFramework as cubismMatrix44} from '@framework/math/cubismmatrix44';
import {Live2DCubismFramework as cubismviewmatrix} from '@framework/math/cubismviewmatrix';
import {TouchManager} from './touchmanager';
import {LAppLive2DManager} from './lapplive2dmanager';
import {canvas, gl, LAppDelegate, scale} from './lappdelegate';
import {LAppSprite} from './lappsprite';
import {TextureInfo} from './lapptexturemanager';
import {LAppPal} from './lapppal';
import * as LAppDefine from './lappdefine';
import Csm_CubismViewMatrix = cubismviewmatrix.CubismViewMatrix;
import Csm_CubismMatrix44 = cubismMatrix44.CubismMatrix44;

import Matter, {
    Bodies,
    Body,
    Composite,
    Engine,
    Render,
    Runner,
    Vector,
    World,
    Constraint,
    MouseConstraint,
    Mouse,
    Composites
} from 'matter-js';
import {m3} from './lcanvas';
import {CubismIdHandle, Live2DCubismFramework} from "@framework/id/cubismid";
import CubismId = Live2DCubismFramework.CubismId;

/**
 * 描画クラス。
 */
export class LAppView {
    _touchManager: TouchManager; // タッチマネージャー
    _deviceToScreen: Csm_CubismMatrix44; // デバイスからスクリーンへの行列
    _viewMatrix: Csm_CubismViewMatrix; // viewMatrix
    _programId: WebGLProgram; // 着色器ID
    _back: LAppSprite; // 背景画像
    _gear: LAppSprite; // ギア画像
    _changeModel: boolean; // モデル切り替えフラグ
    _isClick: boolean; // クリック中
    _num = 0.8;
    _ground: LAppSprite;
    _frontProgramId: WebGLProgram;
    _apples: Matter.Body[] = [];
    _matter_engine: Engine;
    _back_zhuozi: LAppSprite;
    _hands: LAppSprite;
    _zuai: any;

    /**
     * コンストラクタ
     */
    constructor() {
        this._programId = null;
        this._back = null;
        this._gear = null;

        // タッチ関係のイベント管理
        this._touchManager = new TouchManager();

        // デバイス座標からスクリーン座標に変換するための
        this._deviceToScreen = new Csm_CubismMatrix44();

        // 画面の表示の拡大縮小や移動の変換を行う行列
        this._viewMatrix = new Csm_CubismViewMatrix();
    }

    /**
     * 初期化する。
     */
    public initialize(): void {
        const {width, height} = canvas;

        const ratio: number = height / width;
        const left: number = LAppDefine.ViewLogicalLeft;
        const right: number = LAppDefine.ViewLogicalRight;
        const bottom: number = -ratio;
        const top: number = ratio;

        this._viewMatrix.setScreenRect(left, right, bottom, top); // 对应于设备的画面范围。X的左端、X的右端、Y的下端、Y的上端

        const screenW: number = Math.abs(left - right);
        this._deviceToScreen.scaleRelative(screenW / width, -screenW / width);
        this._deviceToScreen.translateRelative(-width * 0.5, -height * 0.5);

        // 显示范围的设定
        this._viewMatrix.setMaxScale(LAppDefine.ViewMaxScale); // 极限扩展率
        this._viewMatrix.setMinScale(LAppDefine.ViewMinScale); // 极限缩小率

        // 能显示的最大范围
        this._viewMatrix.setMaxScreenRect(
            LAppDefine.ViewLogicalMaxLeft,
            LAppDefine.ViewLogicalMaxRight,
            LAppDefine.ViewLogicalMaxBottom,
            LAppDefine.ViewLogicalMaxTop
        );

    }

    /**
     * 解放する
     */
    public release(): void {
        this._viewMatrix = null;
        this._touchManager = null;
        this._deviceToScreen = null;

        this._gear.release();
        this._gear = null;

        this._back.release();
        this._back = null;

        gl.deleteProgram(this._programId);
        this._programId = null;
    }

    /**
     * 描画する。
     */
    public render(): void {
        // gl.useProgram(this._programId);
        // // 后置ui
        //
        // gl.flush();
        const live2DManager: LAppLive2DManager = LAppLive2DManager.getInstance();

        live2DManager.onUpdate();
        // 前置ui
        // gl.useProgram(this._programId);
        //
        // // 透过设置
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        //
        // // if (this._back) {
        // //     this._back.render(this._programId);
        // // }
        // //
        // // if (this._gear) {
        // //     this._gear.render(this._programId);
        // // }
        //
        // // 前置
        // gl.flush()

    }

    public addApple(x, y) {
        let tmp = [];
        for (let i = 0; i < 3; i++) {
            let boxC:Matter.Body;
            if(parseInt((Math.random() * 10).toString()) <5){
                boxC = Bodies.rectangle(x/scale, y/scale, 20, 20);
            }else{
                boxC = Bodies.circle(x/scale, y/scale, 20,{
                    render:{
                        sprite:{
                            texture:LAppDefine.ResourcesPath+LAppDefine.GearImageName,
                            xScale:1,
                            yScale:1
                        }
                    }
                });
            }
            this._apples.push(boxC)
            tmp.push(boxC)
        }


        Composite.add(this._matter_engine.world, tmp);
    }

    /**
     * 画像の初期化を行う。
     */
    public initializeSprite(): void {


        const width: number = canvas.width;
        const height: number = canvas.height;

        const textureManager = LAppDelegate.getInstance().getTextureManager();
        const resourcesPath = LAppDefine.ResourcesPath;

        let imageName = '';

        // 背景画像初期化
        imageName = LAppDefine.BackImageName;

        // 背景图
        const initBackGroundTexture = (textureInfo: TextureInfo): void => {
            const x: number = 0;
            const y: number = 0;

            const fwidth = width;
            const fheight = height;
            this._back = new LAppSprite(x, y, fwidth, fheight, textureInfo.id);
        };
        // 背景
        textureManager.createTextureFromPngFile(
            resourcesPath + imageName,
            false,
            initBackGroundTexture
        );

        textureManager.createTextureFromPngFile(
            resourcesPath + 'cat_model_miao_pro/mousebg.png',
            false,
            (textureInfo: TextureInfo): void => {
                const x: number = 0;
                const y: number = 0;

                const fwidth = 1200;
                const fheight = 1200;
                //配置纹理图像
                this._back_zhuozi = new LAppSprite(x, y, fwidth, fheight, textureInfo.id);
                this._back_zhuozi._scale.y = -0.92;
                this._back_zhuozi._scale.x = 0.92;
                this._back_zhuozi.position(74, 16);

            }
        );
        textureManager.createTextureFromPngFile(
            resourcesPath + 'cat_model_miao_pro/hand/1.png',
            false,
            (textureInfo: TextureInfo): void => {
                const x: number = 0;
                const y: number = 0;

                const fwidth = 1200;
                const fheight = 1200;
                //配置纹理图像
                this._hands = new LAppSprite(x, y, fwidth, fheight, textureInfo.id);
                this._hands._scale.y = -1;
                this._hands._scale.x = 1;
                this._hands.position(0, 0);
                this.initBindDebugContr(this._hands)

            }
        );

        //歯車画像初期化
        imageName = LAppDefine.GearImageName;
        const initGearTexture = (textureInfo: TextureInfo): void => {
            const x = 0;
            const y = 0;
            const fwidth = textureInfo.width;
            const fheight = textureInfo.height;

            this._gear = new LAppSprite(x, y, fwidth, fheight, textureInfo.id);

        };

        textureManager.createTextureFromPngFile(
            resourcesPath + imageName,
            true,
            initGearTexture
        );
        // 创建着色器
        if (this._programId == null) {
            this._programId = LAppDelegate.getInstance().createShader();
        }
        this.initMatter()
    }

    /**
     * 绑定调试面板到精灵上
     * @param sprite
     */
    public initBindDebugContr(sprite: LAppSprite) {
        let gear = sprite;
        // 初始化ui
        webglLessonsUI.setupSlider("#x", {
            value: gear._x, slide: function (event, ui) {
                gear._translation.x = ui.value;
                gear.reload();
            }, max: gl.canvas.width
        });
        webglLessonsUI.setupSlider("#y", {
            value: gear._y, slide: function (event, ui) {
                gear._translation.y = ui.value;
                gear.reload();
            }, max: gl.canvas.height
        });
        webglLessonsUI.setupSlider("#angle", {
            slide: function (event, ui) {
                let angleInDegrees = 360 - ui.value;
                gear._angleInRadians = angleInDegrees * Math.PI / 180;
                gear.reload();
            }, max: 360
        });
        webglLessonsUI.setupSlider("#scaleX", {
            value: gear._scale.x,
            slide: function (event, ui) {
                gear._scale.x = ui.value;
                gear.reload();
            },
            min: -5,
            max: 5,
            step: 0.01,
            precision: 2
        });
        webglLessonsUI.setupSlider("#scaleY", {
            value: gear._scale.y,
            slide: function (event, ui) {
                gear._scale.y = ui.value;
                gear.reload();
            },
            min: -5,
            max: 5,
            step: 0.01,
            precision: 2
        });
        webglLessonsUI.setupSlider("#origin_x", {
            value: gear._origin.x, slide: function (event, ui) {
                gear._origin.x = ui.value;
                gear.reload();
            }, max: gear._width
        });
        webglLessonsUI.setupSlider("#origin_y", {
            value: gear._origin.y, slide: function (event, ui) {
                gear._origin.y = ui.value;
                gear.reload();
            }, max: gear._height
        });
    }

    public initMatter() {
        // create an engine
        var engine = Engine.create();
        this._matter_engine = engine;

        // // create a renderer
        var render = Render.create({
            element: document.getElementById('wuli'),
            engine: engine,
            options: {
                width: parseInt(canvas.style.width),
                height: parseInt(canvas.style.height),
                pixelRatio: scale,
                background: 'rgba(250,250,250,0)',
                wireframeBackground: 'rgba(34,34,34,0)',
                hasBounds: true,
                wireframes: false,
                showSleeping: false,
                showDebug: false,
                showBroadphase: false,
                showBounds: false,
                showVelocity: false,
                showCollisions: false,
                showSeparations: false,
                showAxes: false,
                showPositions: false,
                showAngleIndicator: false,
                showIds: true,
                showVertexNumbers: false,
                showConvexHulls: false,
                showInternalEdges: false,
                showMousePosition: false
            }
        });
        Matter.Events.on(engine, 'collisionStart', function (event) {
            var pairs = event.pairs;
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                // 所有已碰撞的物体
                if (pair.bodyA.id == 3) {
                    // Body.setVelocity(pair.bodyB, Vector.create(2, -10))
                    Composite.remove(engine.world,pair.bodyB)
                }
                if (pair.bodyA.id == 5){
                    console.log(123)
                    LAppLive2DManager.getInstance()._viewMatrix.translateRelative(0,-LAppPal.getDeltaTime())
                }
            }
        })
        // create two boxes and a ground
        var boxA = Bodies.rectangle(300, 300, 20, 20);
        var boxB = Bodies.rectangle(20, 50, 20, 20);
        var ground = Bodies.rectangle(300, 550, 600, 50, {isStatic: true});

        // 钉子固定用
        var dingzi = Bodies.rectangle(100, 100, 20, 20,{
            isStatic:true,
            collisionFilter:{
                category:null,
                group:-1,
                mask:null
            }
        })
        if (!this._zuai) {
            let box = Bodies.circle(100, 100, 40, {
            })
            Composite.add(this._matter_engine.world, box);
            this._zuai = box;

        }
        let line = Constraint.create({
            pointA:{x:300,y:200},
            bodyB:this._zuai,
            stiffness:0.1,
            length:0,
        })

        Composite.add(engine.world, [boxA, boxB, ground,dingzi,line]);


        Render.run(render);
        var runner = Runner.create();

        Runner.run(runner, engine);

    }

    /**
     * 被触摸的时候被叫。
     *
     * @param pointX 屏幕X坐标
     * @param pointY 屏幕Y坐标
     */
    public onTouchesBegan(pointX: number, pointY: number): void {
        this.addApple(pointX, pointY)

        this._touchManager.touchesBegan(pointX, pointY);
    }

    /**
     * 触摸的时候如果指针移动的话就会被叫。
     *
     * @param pointX スクリーンX座標
     * @param pointY スクリーンY座標
     */
    public onTouchesMoved(pointX: number, pointY: number): void {
        const viewX: number = this.transformViewX(this._touchManager.getX());
        const viewY: number = this.transformViewY(this._touchManager.getY());

        this._touchManager.touchesMoved(pointX, pointY);
        const live2DManager: LAppLive2DManager = LAppLive2DManager.getInstance();
        live2DManager.onDrag(viewX, viewY);
    }

    /**
     * タッチが終了したら呼ばれる。
     *
     * @param pointX スクリーンX座標
     * @param pointY スクリーンY座標
     */
    public onTouchesEnded(pointX: number, pointY: number): void {

        // 触摸结束
        const live2DManager: LAppLive2DManager = LAppLive2DManager.getInstance();
        live2DManager.onDrag(0.0, 0.0);

        {
            // シングルタップ
            const x: number = this._deviceToScreen.transformX(
                this._touchManager.getX()
            ); // 論理座標変換した座標を取得。
            const y: number = this._deviceToScreen.transformY(
                this._touchManager.getY()
            ); // 論理座標変化した座標を取得。

            if (LAppDefine.DebugTouchLogEnable) {
                LAppPal.printMessage(`[APP]touchesEnded x: ${x} y: ${y} pointX:${pointX} pointY:${pointY}`);
            }
            live2DManager.onTap(x, y);
        }
    }

    /**
     * 将X坐标转换为View坐标。
     *
     * @param deviceX デバイスX座標
     */
    public transformViewX(deviceX: number): number {
        const screenX: number = this._deviceToScreen.transformX(deviceX); // 論理座標変換した座標を取得。
        return this._viewMatrix.invertTransformX(screenX); // 拡大、縮小、移動後の値。
    }

    /**
     * Y座標をView座標に変換する。
     *
     * @param deviceY デバイスY座標
     */
    public transformViewY(deviceY: number): number {
        const screenY: number = this._deviceToScreen.transformY(deviceY); // 論理座標変換した座標を取得。
        return this._viewMatrix.invertTransformY(screenY);
    }

    /**
     * 将X坐标变换为Screen坐标。
     * @param deviceX デバイスX座標
     */
    public transformScreenX(deviceX: number): number {
        return this._deviceToScreen.transformX(deviceX);
    }

    /**
     * Y座標をScreen座標に変換する。
     *
     * @param deviceY デバイスY座標
     */
    public transformScreenY(deviceY: number): number {
        return this._deviceToScreen.transformY(deviceY);
    }


};