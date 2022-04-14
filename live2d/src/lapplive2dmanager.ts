/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import {Live2DCubismFramework as cubismmatrix44} from '@framework/math/cubismmatrix44';
import {Live2DCubismFramework as csmvector} from '@framework/type/csmvector';
import {Live2DCubismFramework as acubismmotion} from '@framework/motion/acubismmotion';
import {Live2DCubismFramework as cubismid} from "@framework/id/cubismid";
import { Live2DCubismFramework as live2dcubismframework } from '@framework/live2dcubismframework';
import CubismFramework = live2dcubismframework.CubismFramework;

import Csm_csmVector = csmvector.csmVector;
import Csm_CubismMatrix44 = cubismmatrix44.CubismMatrix44;
import ACubismMotion = acubismmotion.ACubismMotion;
import CubismIdHandle = cubismid.CubismIdHandle;

import {LAppModel} from './lappmodel';
import {LAppPal} from './lapppal';
import {canvas, LAppDelegate} from './lappdelegate';
import * as LAppDefine from './lappdefine';

import {LStore} from "./lstore";

export let s_instance: LAppLive2DManager = null;

/**
 * 在样本应用中管理CubismModel的类
 * 进行模型生成和丢弃、轻敲事件的处理、模型切换。
 */
export class LAppLive2DManager {
    public click_hit:Function = null;
    public move_hit:Function = null;

    /**
     * 获取管理对象ID
     */
    public getIdManager(){
        return CubismFramework.getIdManager();
    }

    /**
     * 获取代理
     */
    public getLAppDelegate(){
        return LAppDelegate.getInstance();
    }
    /**
     * 返回类的实例(singleton)。
     * 如果没有生成实例，则在内部生成实例。
     *
     * @return 类的实例
     */
    public static getInstance(): LAppLive2DManager {
        if (s_instance == null) {
            s_instance = new LAppLive2DManager();
        }

        return s_instance;
    }

    /**
     * 释放类的实例(singleton)。
     */
    public static releaseInstance(): void {
        if (s_instance != null) {
            s_instance = void 0;
        }

        s_instance = null;
    }

    /**
     * 返回保持在当前场景中的模型。
     *
     * @param no 模型列表的索引值
     * @return {LAppModel} 模型的实例。如果索引值不在范围内，则返回空。
     */
    public getModel(no: number): LAppModel {
        if (no < this._models.getSize()) {
            return this._models.at(no);
        }

        return null;
    }

    /**
     * 释放当前场景中保存的所有模型
     */
    public releaseAllModel(): void {
        for (let i = 0; i < this._models.getSize(); i++) {
            this._models.at(i).release();
            this._models.set(i, null);
        }

        this._models.clear();
    }

    /**
     * 拖动画面时的处理
     *
     * @param x 画面的x坐标
     * @param y 画面的y坐标
     */
    public onDrag(x: number, y: number): void {
        for (let i = 0; i < this._models.getSize(); i++) {
            const model: LAppModel = this.getModel(i);

            if (model) {
                model.setDragging(x, y);
            }
        }
    }

    /**
     * 点击画面时的处理
     *
     * @param x 画面的x坐标
     * @param y 画面的y坐标
     */
    public onTap(x: number, y: number): void {
        if (LAppDefine.DebugLogEnable) {
            LAppPal.printMessage(
                `[APP]tap point: {x: ${x.toFixed(2)} y: ${y.toFixed(2)}}`
            );
        }

        for (let i = 0; i < this._models.getSize(); i++) {
            if (this._models.at(i).hitTest(LAppDefine.HitAreaNameHead, x, y)) {
                if (LAppDefine.DebugLogEnable) {
                    LAppPal.printMessage(
                        `[APP]hit area: [${LAppDefine.HitAreaNameHead}]`
                    );
                }
                this._models.at(i).setRandomExpression();
            } else if (this._models.at(i).hitTest(LAppDefine.HitAreaNameBody, x, y)) {
                if (LAppDefine.DebugLogEnable) {
                    LAppPal.printMessage(
                        `[APP]hit area: [${LAppDefine.HitAreaNameBody}]`
                    );
                }
                this._models
                    .at(i)
                    .startRandomMotion(
                        LAppDefine.MotionGroupTapBody,
                        LAppDefine.PriorityNormal,
                        this._finishedMotion
                    );
            }
        }
    }

    public hitModel(x: number, y: number): boolean {
        for (let i = 0; i < this._models.getSize(); i++) {
            if (this._models.at(i).hitTest(LAppDefine.HitAreaNameHead, x, y)) {
                return true;
            } else if (this._models
                .at(i)
                .hitTest(LAppDefine.HitAreaNameBody, x, y)
            ) {
                return true;
            }
        }
        return false;
    }

    public isHit( posX: number, posY: number): string {
        let view = LAppDelegate.getInstance().getView()
        const viewX: number = view.transformViewX(posX);
        const viewY: number = view.transformViewY(posY);

        let model = this._models.at(0).getModel();

        for (let i = 0; i < model.getDrawableCount(); i++) {
            //todo 可以过滤一部分这里
            if (this._models.at(0).isHit(model.getDrawableId(i),viewX,viewY)) {
                return model.getDrawableId(i).getString().s;
            }
        }
        return '';
    }
    /**
     * 更新画面时的处理
     * 进行模型的更新处理和绘制处理
     */
    public onUpdate(): void {
        let projection: Csm_CubismMatrix44 = new Csm_CubismMatrix44();

        const {width, height} = canvas;
        projection.scale(1.0, width / height);

        if (this._viewMatrix != null) {
            projection.multiplyByMatrix(this._viewMatrix);
        }

        const saveProjection: Csm_CubismMatrix44 = projection.clone();
        const modelCount: number = this._models.getSize();

        for (let i = 0; i < modelCount; ++i) {
            const model: LAppModel = this.getModel(i);
            projection = saveProjection.clone();

            model.update();
            model.draw(projection); // 因为是参照交付，所以projection会变质。
        }
    }

    /**
     * 切换到下一个场景
     * 在样本应用中切换模型集。
     */
    public nextScene(): void {
        let ModelDir:[] = LStore.get('ModelDir')??LAppDefine.ModelDir;
        if (ModelDir == []){
            return;
        }
        const no: number = (this._sceneIndex + 1) % ModelDir.length;
        this.changeScene(no);
    }

    /**
     * 切换场景
     * 在样本应用中切换模型集。
     */
    public changeScene(index: number): void {
        this._sceneIndex = index;
        if (LAppDefine.DebugLogEnable) {
            LAppPal.printMessage(`[APP]model index: ${this._sceneIndex}`);
        }
        let ModelDir:[] = LStore.get('ModelDir')??LAppDefine.ModelDir;
        let ResourcesPath:[] = LStore.get('ResourcesPath')??LAppDefine.ResourcesPath;

        // ModelDir[]中保存的目录名称
        // model3.确定json的路径。
        // 目录名和model3.json的名字要一致。
        const model: string = ModelDir[index];
        const modelPath: string = ResourcesPath + model + '/';
        let modelJsonName: string = ModelDir[index];
        modelJsonName += '.model3.json';

        this.releaseAllModel();
        this._models.pushBack(new LAppModel());
        this._models.at(0).loadAssets(modelPath, modelJsonName);
    }

    /**
     * 构造函数
     */
    constructor() {
        this._viewMatrix = new Csm_CubismMatrix44();
        this._models = new Csm_csmVector<LAppModel>();
        this._sceneIndex = 0;
        this.changeScene(this._sceneIndex);
    }

    _viewMatrix: Csm_CubismMatrix44; // 用于模型绘制的view矩阵
    _models: Csm_csmVector<LAppModel>; // 模型实例的容器
    _sceneIndex: number; // 要显示的场景的索引值
    // 运动回放结束的回调函数
    _finishedMotion = (self: ACubismMotion): void => {
        LAppPal.printMessage('Motion Finished:');
    };
}
