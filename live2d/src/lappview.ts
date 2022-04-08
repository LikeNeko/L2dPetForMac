/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import {Live2DCubismFramework as cubismMatrix44} from '@framework/math/cubismmatrix44';
import {Live2DCubismFramework as cubismviewmatrix} from '@framework/math/cubismviewmatrix';
import Csm_CubismViewMatrix = cubismviewmatrix.CubismViewMatrix;
import Csm_CubismMatrix44 = cubismMatrix44.CubismMatrix44;
import {TouchManager} from './touchmanager';
import {LAppLive2DManager} from './lapplive2dmanager';
import {LAppDelegate, canvas, gl} from './lappdelegate';
import {LAppSprite, Rect} from './lappsprite';
import {TextureInfo} from './lapptexturemanager';
import {LAppPal} from './lapppal';
import * as LAppDefine from './lappdefine';
import {b2World} from "./box2d/dynamics/b2_world";
import {b2Body, b2BodyDef, b2BodyType} from "./box2d/dynamics/b2_body";
import {b2PolygonShape} from "./box2d/collision/b2_polygon_shape";
import {b2FixtureDef} from "./box2d/dynamics/b2_fixture";
import {twgl} from "./lcanvas";

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
    _next_random_motion: LAppSprite; // 随机一个动作
    _num = 0.8;
    _world: b2World;
    _ground: LAppSprite;
    _apple: LAppSprite;

    /**
     * コンストラクタ
     */
    constructor() {
        this._programId = null;
        this._back = null;
        this._gear = null;
        this._next_random_motion = null;

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
        gl.useProgram(this._programId);

        if (this._back) {
            this._back.render(this._programId);
        }
        if (this._gear) {
            this._gear.render(this._programId);
        }
        if (this._next_random_motion) {
            this._next_random_motion.render(this._programId);
        }


        gl.flush();

        const live2DManager: LAppLive2DManager = LAppLive2DManager.getInstance();

        live2DManager.onUpdate();

        // gl.useProgram(this._programId);
        // if (this._ground) {
        //     this._ground.render(this._programId)
        //     this._apple.render(this._programId);
        // }
        //
        // // 物理世界是否处理完成
        // if (this._world) {
        //     this._world.Step(1 / 60, 6, 2);
        //     for (let bodyIndex: b2Body = this._world.GetBodyList(); bodyIndex; bodyIndex = bodyIndex.GetNext()) {
        //         let x = bodyIndex.GetPosition().x * 30;
        //         let y = bodyIndex.GetPosition().y * 30;
        //         let r = bodyIndex.GetAngle() * 180 / Math.PI;
        //         if (bodyIndex.m_userData.type == 'apple' && this._apple) {
        //             this._apple.setX(x);
        //             this._apple.setY(y);
        //             this._apple.render(this._programId);
        //         }
        //     }
        // }
        // gl.flush();

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

        // 非同期なのでコールバック関数を作成
        const initBackGroundTexture = (textureInfo: TextureInfo): void => {
            const x: number = width * 0.5;
            const y: number = height * 0.5;

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

        // 初始化box2d 逻辑
        this._world = new b2World({x: 0, y: -10});
        let groundBodyDef = new b2BodyDef();
        groundBodyDef.userData = {type: "ground"}
        groundBodyDef.position.Set(0, 200 / 30);//此处就是把300像素转换成10米
        groundBodyDef.type = b2BodyType.b2_staticBody;//地面是不会动的，所以设置为静态
        // 地面
        let groundBox = new b2PolygonShape();//这是个矩形
        groundBox.SetAsBox(500 / 2 / 30, 30 / 2 / 30);
        this._world.CreateBody(groundBodyDef).CreateFixture(groundBox);

        // 礼物
        let appleDef = new b2BodyDef();
        appleDef.userData = {type: 'apple'}
        appleDef.type = b2BodyType.b2_dynamicBody;//动态的
        appleDef.position.Set(30 / 30, 0 / 30);
        // 刚体
        let appleShape = new b2PolygonShape();
        appleShape.SetAsBox(50 / 2 / 30, 50 / 2 / 30);
        // 材质
        let fixDef = new b2FixtureDef();//这个就是材质

        fixDef.shape = appleShape;
        fixDef.density = 1.0;//这个就是之前提到过的密度
        fixDef.friction = 0.3;//这个是摩擦
        fixDef.restitution = 0.2;//掉在地上弹起来的效果
        this._world.CreateBody(appleDef).CreateFixture(fixDef);//添加到世界中

        //歯車画像初期化
        imageName = LAppDefine.GearImageName;
        const initGearTexture = (textureInfo: TextureInfo): void => {
            const x = width - textureInfo.width * 0.5;
            const y = height - textureInfo.height * 0.5;
            const fwidth = textureInfo.width;
            const fheight = textureInfo.height;
            this._gear = new LAppSprite(x, y, fwidth, fheight, textureInfo.id);
        };

        textureManager.createTextureFromPngFile(
            resourcesPath + imageName,
            false,
            initGearTexture
        );
        // 创建着色器
        if (this._programId == null) {
            this._programId = LAppDelegate.getInstance().createShader();
        }
    }

    /**
     * 被触摸的时候被叫。
     *
     * @param pointX 屏幕X坐标
     * @param pointY 屏幕Y坐标
     */
    public onTouchesBegan(pointX: number, pointY: number): void {
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