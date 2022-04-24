/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import {Constant, Live2DCubismFramework as live2dcubismframework} from '@framework/live2dcubismframework';
import { Live2DCubismFramework as cubismid } from '@framework/id/cubismid';
import { Live2DCubismFramework as cubismusermodel } from '@framework/model/cubismusermodel';
import { Live2DCubismFramework as icubismmodelsetting } from '@framework/icubismmodelsetting';
import { Live2DCubismFramework as cubismmodelsettingjson } from '@framework/cubismmodelsettingjson';
import { Live2DCubismFramework as cubismdefaultparameterid } from '@framework/cubismdefaultparameterid';
import { Live2DCubismFramework as acubismmotion } from '@framework/motion/acubismmotion';
import { Live2DCubismFramework as cubismeyeblink } from '@framework/effect/cubismeyeblink';
import { Live2DCubismFramework as cubismbreath } from '@framework/effect/cubismbreath';
import { Live2DCubismFramework as csmvector } from '@framework/type/csmvector';
import { Live2DCubismFramework as csmmap } from '@framework/type/csmmap';
import { Live2DCubismFramework as cubismmatrix44 } from '@framework/math/cubismmatrix44';
import { Live2DCubismFramework as cubismmotion } from '@framework/motion/cubismmotion';
import { Live2DCubismFramework as cubismmotionqueuemanager } from '@framework/motion/cubismmotionqueuemanager';
import { Live2DCubismFramework as csmstring } from '@framework/type/csmstring';
import { Live2DCubismFramework as csmrect } from '@framework/type/csmrectf';
import { CubismLogInfo } from '@framework/utils/cubismdebug';
import csmRect = csmrect.csmRect;
import csmString = csmstring.csmString;
import InvalidMotionQueueEntryHandleValue = cubismmotionqueuemanager.InvalidMotionQueueEntryHandleValue;
import CubismMotionQueueEntryHandle = cubismmotionqueuemanager.CubismMotionQueueEntryHandle;
import CubismMotion = cubismmotion.CubismMotion;
import CubismMatrix44 = cubismmatrix44.CubismMatrix44;
import csmMap = csmmap.csmMap;
import csmVector = csmvector.csmVector;
import CubismBreath = cubismbreath.CubismBreath;
import BreathParameterData = cubismbreath.BreathParameterData;
import CubismEyeBlink = cubismeyeblink.CubismEyeBlink;
import ACubismMotion = acubismmotion.ACubismMotion;
import FinishedMotionCallback = acubismmotion.FinishedMotionCallback;
import CubismFramework = live2dcubismframework.CubismFramework;
import CubismIdHandle = cubismid.CubismIdHandle;
import CubismUserModel = cubismusermodel.CubismUserModel;
import ICubismModelSetting = icubismmodelsetting.ICubismModelSetting;
import CubismModelSettingJson = cubismmodelsettingjson.CubismModelSettingJson;
import CubismDefaultParameterId = cubismdefaultparameterid;

import { LAppPal } from './lapppal';
import {gl, canvas, frameBuffer, LAppDelegate, lAppDelegateEvent} from './lappdelegate';
import { TextureInfo } from './lapptexturemanager';
import * as LAppDefine from './lappdefine';
import 'whatwg-fetch';
import {DebugModelLogEnable} from "./lappdefine";
import {Vector} from "matter-js";
import {Rect} from "./lappsprite";
import {LAppLive2DManager} from "./lapplive2dmanager";

export enum LoadStep {
  LoadAssets,
  LoadModel,
  WaitLoadModel,
  LoadExpression,
  WaitLoadExpression,
  LoadPhysics,
  WaitLoadPhysics,
  LoadPose,
  WaitLoadPose,
  SetupEyeBlink,
  SetupBreath,
  LoadUserData,
  WaitLoadUserData,
  SetupEyeBlinkIds,
  SetupLipSyncIds,
  SetupLayout,
  LoadMotion,
  WaitLoadMotion,
  CompleteInitialize,
  CompleteSetupModel,
  LoadTexture,
  WaitLoadTexture,
  CompleteSetup
}

/**
 * 用户实际使用的模型的实现类<br>
 * 进行模型生成、功能组件生成、更新处理和渲染的调用。
 */
export class LAppModel extends CubismUserModel {
  /**
   * model3.从json所在的目录和文件路径生成模型
   * @param dir 目录
   * @param fileName 文件名
   */
  public loadAssets(dir: string, fileName: string): void {
    this._modelHomeDir = dir;
    fetch(`${this._modelHomeDir}/${fileName}`)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        const setting: ICubismModelSetting = new CubismModelSettingJson(
          arrayBuffer,
          arrayBuffer.byteLength
        );

        // update状态
        this._state = LoadStep.LoadModel;

        // 保存结果
        this.setupModel(setting);
      });
  }

  /**
   * model3.json生成模型。
   * 根据model3.json的描述进行模型生成、运动、物理运算等组件生成。
   *
   * @param setting ICubismModelSetting的实例
   */
  private setupModel(setting: ICubismModelSetting): void {
    this._updating = true;
    this._initialized = false;

    this._modelSetting = setting;

    // CubismModel
    if (this._modelSetting.getModelFileName() != '') {
      const modelFileName = this._modelSetting.getModelFileName();

      fetch(`${this._modelHomeDir}/${modelFileName}`)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          this.loadModel(arrayBuffer);
          this._state = LoadStep.LoadExpression;

          // 回调
          loadCubismExpression();
        });

      this._state = LoadStep.WaitLoadModel;
    } else {
      LAppPal.printMessage('Model data does not exist.');
    }

    // 表达式
    const loadCubismExpression = (): void => {
      if (this._modelSetting.getExpressionCount() > 0) {
        const count: number = this._modelSetting.getExpressionCount();

        for (let i = 0; i < count; i++) {
          const expressionName = this._modelSetting.getExpressionName(i);
          const expressionFileName = this._modelSetting.getExpressionFileName(
            i
          );

          fetch(`${this._modelHomeDir}/${expressionFileName}`)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
              const motion: ACubismMotion = this.loadExpression(
                arrayBuffer,
                arrayBuffer.byteLength,
                expressionName
              );

              if (this._expressions.getValue(expressionName) != null) {
                ACubismMotion.delete(
                  this._expressions.getValue(expressionName)
                );
                this._expressions.setValue(expressionName, null);
              }

              this._expressions.setValue(expressionName, motion);

              this._expressionCount++;

              if (this._expressionCount >= count) {
                this._state = LoadStep.LoadPhysics;

                // 回调
                loadCubismPhysics();
              }
            });
        }
        this._state = LoadStep.WaitLoadExpression;
      } else {
        this._state = LoadStep.LoadPhysics;

        // 回调
        loadCubismPhysics();
      }
    };

    // 物理
    const loadCubismPhysics = (): void => {
      if (this._modelSetting.getPhysicsFileName() != '') {
        const physicsFileName = this._modelSetting.getPhysicsFileName();

        fetch(`${this._modelHomeDir}/${physicsFileName}`)
          .then(response => response.arrayBuffer())
          .then(arrayBuffer => {
            this.loadPhysics(arrayBuffer, arrayBuffer.byteLength);

            this._state = LoadStep.LoadPose;

            // 回调
            loadCubismPose();
          });
        this._state = LoadStep.WaitLoadPhysics;
      } else {
        this._state = LoadStep.LoadPose;

        // 回调
        loadCubismPose();
      }
    };

    // 构成
    const loadCubismPose = (): void => {
      if (this._modelSetting.getPoseFileName() != '') {
        const poseFileName = this._modelSetting.getPoseFileName();

        fetch(`${this._modelHomeDir}/${poseFileName}`)
          .then(response => response.arrayBuffer())
          .then(arrayBuffer => {
            this.loadPose(arrayBuffer, arrayBuffer.byteLength);

            this._state = LoadStep.SetupEyeBlink;

            // 回调
            setupEyeBlink();
          });
        this._state = LoadStep.WaitLoadPose;
      } else {
        this._state = LoadStep.SetupEyeBlink;

        // 回调
        setupEyeBlink();
      }
    };

    // 眨眼
    const setupEyeBlink = (): void => {
      if (this._modelSetting.getEyeBlinkParameterCount() > 0) {
        this._eyeBlink = CubismEyeBlink.create(this._modelSetting);
        this._state = LoadStep.SetupBreath;
      }

      // 回调
      setupBreath();
    };

    // Breath
    const setupBreath = (): void => {
      this._breath = CubismBreath.create();

      const breathParameters: csmVector<BreathParameterData> = new csmVector();
      breathParameters.pushBack(
        new BreathParameterData(this._idParamAngleX, 0.0, 15.0, 6.5345, 0.5)
      );
      breathParameters.pushBack(
        new BreathParameterData(this._idParamAngleY, 0.0, 8.0, 3.5345, 0.5)
      );
      breathParameters.pushBack(
        new BreathParameterData(this._idParamAngleZ, 0.0, 10.0, 5.5345, 0.5)
      );
      breathParameters.pushBack(
        new BreathParameterData(this._idParamBodyAngleX, 0.0, 4.0, 15.5345, 0.5)
      );
      breathParameters.pushBack(
        new BreathParameterData(
          CubismFramework.getIdManager().getId(
            CubismDefaultParameterId.ParamBreath
          ),
          0.0,
          0.5,
          3.2345,
          0.5
        )
      );

      this._breath.setParameters(breathParameters);
      this._state = LoadStep.LoadUserData;

      // 回调
      loadUserData();
    };

    // 用户数据
    const loadUserData = (): void => {
      if (this._modelSetting.getUserDataFile() != '') {
        const userDataFile = this._modelSetting.getUserDataFile();

        fetch(`${this._modelHomeDir}/${userDataFile}`)
          .then(response => response.arrayBuffer())
          .then(arrayBuffer => {
            this.loadUserData(arrayBuffer, arrayBuffer.byteLength);

            this._state = LoadStep.SetupEyeBlinkIds;

            // 回调
            setupEyeBlinkIds();
          });

        this._state = LoadStep.WaitLoadUserData;
      } else {
        this._state = LoadStep.SetupEyeBlinkIds;

        // 回调
        setupEyeBlinkIds();
      }
    };

    // 眨眼Ids
    const setupEyeBlinkIds = (): void => {
      const eyeBlinkIdCount: number = this._modelSetting.getEyeBlinkParameterCount();

      for (let i = 0; i < eyeBlinkIdCount; ++i) {
        this._eyeBlinkIds.pushBack(
          this._modelSetting.getEyeBlinkParameterId(i)
        );
      }

      this._state = LoadStep.SetupLipSyncIds;

      // 回调
      setupLipSyncIds();
    };

    // LipSyncIds
    const setupLipSyncIds = (): void => {
      const lipSyncIdCount = this._modelSetting.getLipSyncParameterCount();

      for (let i = 0; i < lipSyncIdCount; ++i) {
        this._lipSyncIds.pushBack(this._modelSetting.getLipSyncParameterId(i));
      }
      this._state = LoadStep.SetupLayout;

      // 回调
      setupLayout();
    };

    // 布局
    const setupLayout = (): void => {
      const layout: csmMap<string, number> = new csmMap<string, number>();
      this._modelSetting.getLayoutMap(layout);
      this._modelMatrix.setupFromLayout(layout);
      this._state = LoadStep.LoadMotion;

      // 回调
      loadCubismMotion();
    };

    // 运动
    const loadCubismMotion = (): void => {
      this._state = LoadStep.WaitLoadMotion;
      this._model.saveParameters();
      this._allMotionCount = 0;
      this._motionCount = 0;
      const group: string[] = [];

      const motionGroupCount: number = this._modelSetting.getMotionGroupCount();

      // 求运动的总数
      for (let i = 0; i < motionGroupCount; i++) {
        group[i] = this._modelSetting.getMotionGroupName(i);
        this._allMotionCount += this._modelSetting.getMotionCount(group[i]);
      }

      // 动态的读取
      for (let i = 0; i < motionGroupCount; i++) {
        this.preLoadMotionGroup(group[i]);
      }

      // 没有动作的情况
      if (motionGroupCount == 0) {
        this._state = LoadStep.LoadTexture;

        // 停止所有动作
        this._motionManager.stopAllMotions();

        this._updating = false;
        this._initialized = true;

        this.createRenderer();
        this.setupTextures();
        this.getRenderer().startUp(gl);
      }
    };
  }

  /**
   * 在纹理单元中加载纹理
   */
  private setupTextures(): void {
    // 为了提高iPhone的alpha质量，Typescript采用premultipliedAlpha
    const usePremultiply = true;

    if (this._state == LoadStep.LoadTexture) {
      // 用于读取纹理
      const textureCount: number = this._modelSetting.getTextureCount();

      for (
        let modelTextureNumber = 0;
        modelTextureNumber < textureCount;
        modelTextureNumber++
      ) {
        // 如果纹理名称是空字符，跳过加载绑定处理
        if (this._modelSetting.getTextureFileName(modelTextureNumber) == '') {
          console.log('getTextureFileName null');
          continue;
        }

        // 在WebGL的纹理单元中加载纹理
        let texturePath = this._modelSetting.getTextureFileName(
          modelTextureNumber
        );
        texturePath = this._modelHomeDir + texturePath;

        // 获取缓存数据 todo 改成异步加载 启动应用预加载模型
        LAppLive2DManager.getInstance().cachedFile(texturePath,function (){
          // 负载完成时调用的回叫函数
          const onLoad = (textureInfo: TextureInfo): void => {
            this.getRenderer().bindTexture(modelTextureNumber, textureInfo.id);

            this._textureCount++;

            if (this._textureCount >= textureCount) {
              // 加载完成
              this._state = LoadStep.CompleteSetup;
              lAppDelegateEvent.modelCompleteSetup();
            }
          };

          // 读入
          LAppDelegate.getInstance()
              .getTextureManager()
              .createTextureFromPngFile(texturePath, usePremultiply, onLoad);
          this.getRenderer().setIsPremultipliedAlpha(usePremultiply);
        }.bind(this))
      }

      this._state = LoadStep.WaitLoadTexture;
    }
  }

  /**
   * 重新构建渲染器
   */
  public reloadRenderer(): void {
    this.deleteRenderer();
    this.createRenderer();
    this.setupTextures();
  }

  /**
   * 更新
   */
  public update(): void {
    if (this._state != LoadStep.CompleteSetup) return;

    const deltaTimeSeconds: number = LAppPal.getDeltaTime();
    this._userTimeSeconds += deltaTimeSeconds;

    this._dragManager.update(deltaTimeSeconds);
    this._dragX = this._dragManager.getX();
    this._dragY= this._dragManager.getY();

    // 是否更新运动参数
    let motionUpdated = false;

    //--------------------------------------------------------------------------
    this._model.loadParameters(); // 加载上次被保存的状态
    if (this._motionManager.isFinished()) {
      // 如果没有动作回放，则从等待动作中随机回放
      this.startRandomMotion(
        LAppDefine.MotionGroupIdle,
        LAppDefine.PriorityIdle
      );
    } else {
      motionUpdated = this._motionManager.updateMotion(
        this._model,
        deltaTimeSeconds
      ); // 更新动作
    }
    // 动态修改参数
    this._model.saveParameters(); // Save the state
    //--------------------------------------------------------------------------

    // 眨眼
    if (!motionUpdated) {
      if (this._eyeBlink != null) {
        // 采取主动，不做任何更新
        this._eyeBlink.updateParameters(this._model, deltaTimeSeconds); // Twinkle, twinkle
      }
    }

    if (this._expressionManager != null) {
      this._expressionManager.updateMotion(this._model, deltaTimeSeconds); // 使用表情符号更新参数(相对变化)
    }

    // model带来的变化
    // 通过model调整脸部的方向
    this._model.addParameterValueById(this._idParamAngleX, this._dragX * 30); // -30から30の値を加える
    this._model.addParameterValueById(this._idParamAngleY, this._dragY * 30);
    this._model.addParameterValueById(
      this._idParamAngleZ,
      this._dragX * this._dragY * -30
    );

    // 通过毒品调整身体的方向
    this._model.addParameterValueById(
      this._idParamBodyAngleX,
      this._dragX * 10
    ); // 从-10加上10的值

    // 用药片调整你的眼睛
    this._model.addParameterValueById(this._idParamEyeBallX, this._dragX); // Minus 1 plus 1
    this._model.addParameterValueById(this._idParamEyeBallY, this._dragY);

    // 呼吸等
    if (this._breath != null) {
      this._breath.updateParameters(this._model, deltaTimeSeconds);
    }

    // 物理运算的设定
    if (this._physics != null) {
      this._physics.evaluate(this._model, deltaTimeSeconds);
    }

    // 对口型的设定
    if (this._lipsync) {
      const value = 0; // 实时对口型时，从系统获取音量，并在0到1的范围内输入数值。

      for (let i = 0; i < this._lipSyncIds.getSize(); ++i) {
        this._model.addParameterValueById(this._lipSyncIds.at(i), value, 0.8);
      }
    }

    // 姿势的设定
    if (this._pose != null) {
      this._pose.updateParameters(this._model, deltaTimeSeconds);
    }

    this._model.update();
  }

  /**
   * 开始自变量指定的运动的再生
   * @param group 运动团体名
   * @param no 组内的号码
   * @param priority 优先度
   * @param onFinishedMotionHandler 动作回放结束时调用的回调函数
   * @return CubismMotionQueueEntryHandle 返回开始的动作的识别号码。作为判断单独运动是否结束的isFinished()的参数使用。不能开始的时候[-1]
   */
  public startMotion(
    group: string,
    no: number,
    priority: number,
    onFinishedMotionHandler?: FinishedMotionCallback
  ): CubismMotionQueueEntryHandle {
    if (priority == LAppDefine.PriorityForce) {
      this._motionManager.setReservePriority(priority);
    } else if (!this._motionManager.reserveMotion(priority)) {
      if (this._debugMode) {
        LAppPal.printMessage("[APP]can't start motion.");
      }
      return InvalidMotionQueueEntryHandleValue;
    }

    const motionFileName = this._modelSetting.getMotionFileName(group, no);

    // 例)idle_0
    const name = `${group}_${no}`;
    let motion: CubismMotion = this._motions.getValue(name) as CubismMotion;
    let autoDelete = false;

    if (motion == null) {
      fetch(`${this._modelHomeDir}/${motionFileName}`)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          motion = this.loadMotion(
            arrayBuffer,
            arrayBuffer.byteLength,
            null,
            onFinishedMotionHandler
          );
          let fadeTime: number = this._modelSetting.getMotionFadeInTimeValue(
            group,
            no
          );

          if (fadeTime >= 0.0) {
            motion.setFadeInTime(fadeTime);
          }

          fadeTime = this._modelSetting.getMotionFadeOutTimeValue(group, no);
          if (fadeTime >= 0.0) {
            motion.setFadeOutTime(fadeTime);
          }

          motion.setEffectIds(this._eyeBlinkIds, this._lipSyncIds);
          autoDelete = true; // 结束时从内存中删除
        });
    } else {
      motion.setFinishedMotionHandler(onFinishedMotionHandler);
    }

    if (this._debugMode) {
      LAppPal.printMessage(`[APP]start motion: [${group}_${no}`);
    }
    return this._motionManager.startMotionPriority(
      motion,
      autoDelete,
      priority
    );
  }

  /**
   * 开始播放随机选择的运动。
   * @param group 运动团体名
   * @param priority 优先度
   * @param onFinishedMotionHandler 动作回放结束时调用的回调函数
   * @return CubismMotionQueueEntryHandle 返回开始的动作的识别号码。作为判断单独运动是否结束的isFinished()的参数使用。不能开始的时候[-1]
   */
  public startRandomMotion(
    group: string,
    priority: number,
    onFinishedMotionHandler?: FinishedMotionCallback
  ): CubismMotionQueueEntryHandle {
    if (this._modelSetting.getMotionCount(group) == 0) {
      return InvalidMotionQueueEntryHandleValue;
    }

    const no: number = Math.floor(
      Math.random() * this._modelSetting.getMotionCount(group)
    );

    return this.startMotion(group, no, priority, onFinishedMotionHandler);
  }

  /**
   * 设置由参数指定的表情动作
   *
   * @param expressionId 表情动作的ID
   */
  public setExpression(expressionId: string): void {
    const motion: ACubismMotion = this._expressions.getValue(expressionId);

    if (this._debugMode) {
      LAppPal.printMessage(`[APP]expression: [${expressionId}]`);
    }

    if (motion != null) {
      this._expressionManager.startMotionPriority(
        motion,
        false,
        LAppDefine.PriorityForce
      );
    } else {
      if (this._debugMode) {
        LAppPal.printMessage(`[APP]expression[${expressionId}] is null`);
      }
    }
  }

  /**
   * 设置随机选择的表情和动作
   */
  public setRandomExpression(): void {
    if (this._expressions.getSize() == 0) {
      return;
    }

    const no: number = Math.floor(Math.random() * this._expressions.getSize());

    for (let i = 0; i < this._expressions.getSize(); i++) {
      if (i == no) {
        const name: string = this._expressions._keyValues[i].first;
        this.setExpression(name);
        return;
      }
    }
  }

  /**
   * 接收事件的火花
   */
  public motionEventFired(eventValue: csmString): void {
    CubismLogInfo('{0} is fired on LAppModel!!', eventValue.s);
  }

  /**
   * 判定测试
   * 从指定ID的顶点列表计算矩形，确定坐标是否在矩形范围内。
   *
   * 每@param hitArenaName要测试判断的ID
   * @param x 进行判定的x坐标
   * @param y 进行判定的y坐标
   */
  public hitTest(hitArenaName: string, x: number, y: number): boolean {
    // 透明时没有判定。
    if (this._opacity < 1) {
      return false;
    }

    const count: number = this._modelSetting.getHitAreasCount();

    for (let i = 0; i < count; i++) {
      if (this._modelSetting.getHitAreaName(i) == hitArenaName) {
        const drawId: CubismIdHandle = this._modelSetting.getHitAreaId(i);
        return this.isHit(drawId, x, y);
      }
    }

    return false;
  }

  /**
   *
   * @param drawableId
   */
  public getDrawRect(drawableId:CubismIdHandle){
      const drawIndex: number = this._model.getDrawableIndex(drawableId);

      if (drawIndex < 0) {
        // return new Rect(); // 存在しない場合はfalse
      }

      const count: number = this._model.getDrawableVertexCount(drawIndex);
      const vertices: Float32Array = this._model.getDrawableVertices(drawIndex);
      let left: number = vertices[0];
      let right: number = vertices[0];
      let top: number = vertices[1];
      let bottom: number = vertices[1];

      let tmp:Vector[] = [];
      for (let j = 1; j < count; ++j) {
        const x = vertices[Constant.vertexOffset + j * Constant.vertexStep];
        const y = vertices[Constant.vertexOffset + j * Constant.vertexStep + 1];
        tmp.push(Vector.create((x+1)*(LAppDefine.RenderTargetWidth/2),(y+1)*(LAppDefine.RenderTargetWidth/2)))
        if (x < left) {
          left = x; // Min x
        }

        if (x > right) {
          right = x; // Max x
        }

        if (y < top) {
          top = y; // Min y
        }

        if (y > bottom) {
          bottom = y; // Max y
        }
      }

      // 取一个正矩形
      left = right;
      top = bottom;

      let rect = new Rect()
      // 转成实际坐标
      rect.left = (left+1)*(LAppDefine.RenderTargetWidth/2);
      rect.right =(right+1)*(LAppDefine.RenderTargetWidth/2);
      rect.up= (top+1)*(LAppDefine.RenderTargetHeight/2);
      rect.down =(bottom+1)*(LAppDefine.RenderTargetHeight/2);
      console.log(rect)
      return [tmp];
  }


  /**
   * 从组名中统一载入运动数据。
   * 运动数据的名称在内部从ModelSetting获取。
   *
   * @param group 运动数据的组名
   */
  public preLoadMotionGroup(group: string): void {
    for (let i = 0; i < this._modelSetting.getMotionCount(group); i++) {
      const motionFileName = this._modelSetting.getMotionFileName(group, i);

      // 例)idle_0
      const name = `${group}_${i}`;
      if (this._debugMode) {
        LAppPal.printMessage(
          `[APP]load motion: ${motionFileName} => [${name}]`
        );
      }

      fetch(`${this._modelHomeDir}/${motionFileName}`)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          const tmpMotion: CubismMotion = this.loadMotion(
            arrayBuffer,
            arrayBuffer.byteLength,
            name
          );

          let fadeTime = this._modelSetting.getMotionFadeInTimeValue(group, i);
          if (fadeTime >= 0.0) {
            tmpMotion.setFadeInTime(fadeTime);
          }

          fadeTime = this._modelSetting.getMotionFadeOutTimeValue(group, i);
          if (fadeTime >= 0.0) {
            tmpMotion.setFadeOutTime(fadeTime);
          }
          tmpMotion.setEffectIds(this._eyeBlinkIds, this._lipSyncIds);

          if (this._motions.getValue(name) != null) {
            ACubismMotion.delete(this._motions.getValue(name));
          }

          this._motions.setValue(name, tmpMotion);

          this._motionCount++;
          if (this._motionCount >= this._allMotionCount) {
            this._state = LoadStep.LoadTexture;

            // 停止所有动作
            this._motionManager.stopAllMotions();

            this._updating = false;
            this._initialized = true;

            this.createRenderer();
            this.setupTextures();
            this.getRenderer().startUp(gl);
          }
        });
    }
  }

  /**
   * 释放所有的运动数据。
   */
  public releaseMotions(): void {
    this._motions.clear();
  }

  /**
   * 释放所有的表情数据。
   */
  public releaseExpressions(): void {
    this._expressions.clear();
  }

  /**
   * 绘制模型的处理。传递绘制模型的空间View-Projection矩阵。
   */
  public doDraw(): void {
    if (this._model == null) return;

    // 交给画布尺寸
    const viewport: number[] = [0, 0, canvas.width, canvas.height];

    this.getRenderer().setRenderState(frameBuffer, viewport);
    this.getRenderer().drawModel();
  }

  /**
   * 绘制模型的处理。传递绘制模型的空间View-Projection矩阵。
   */
  public draw(matrix: CubismMatrix44): void {
    if (this._model == null) {
      return;
    }

    // 每次读取结束后
    if (this._state == LoadStep.CompleteSetup) {
      matrix.multiplyByMatrix(this._modelMatrix);

      this.getRenderer().setMvpMatrix(matrix);

      this.doDraw();
    }
  }

  /**
   * 构造函数
   */
  public constructor() {
    super();
    this._debugMode = DebugModelLogEnable;

    this._modelSetting = null;
    this._modelHomeDir = null;
    this._userTimeSeconds = 0.0;

    this._eyeBlinkIds = new csmVector<CubismIdHandle>();
    this._lipSyncIds = new csmVector<CubismIdHandle>();

    this._motions = new csmMap<string, ACubismMotion>();
    this._expressions = new csmMap<string, ACubismMotion>();

    this._hitArea = new csmVector<csmRect>();
    this._userArea = new csmVector<csmRect>();

    this._idParamAngleX = CubismFramework.getIdManager().getId(
      CubismDefaultParameterId.ParamAngleX
    );
    this._idParamAngleY = CubismFramework.getIdManager().getId(
      CubismDefaultParameterId.ParamAngleY
    );
    this._idParamAngleZ = CubismFramework.getIdManager().getId(
      CubismDefaultParameterId.ParamAngleZ
    );
    this._idParamEyeBallX = CubismFramework.getIdManager().getId(
      CubismDefaultParameterId.ParamEyeBallX
    );
    this._idParamEyeBallY = CubismFramework.getIdManager().getId(
      CubismDefaultParameterId.ParamEyeBallY
    );
    this._idParamBodyAngleX = CubismFramework.getIdManager().getId(
      CubismDefaultParameterId.ParamBodyAngleX
    );

    this._state = LoadStep.LoadAssets;
    this._expressionCount = 0;
    this._textureCount = 0;
    this._motionCount = 0;
    this._allMotionCount = 0;
  }

  _modelSetting: ICubismModelSetting; // 模型设定信息
  _modelHomeDir: string; // 模型设置所在的目录
  _userTimeSeconds: number; // delta时间的累计值[秒]

  _eyeBlinkIds: csmVector<CubismIdHandle>; // 在模型中设定的眨眼功能用参数ID
  _lipSyncIds: csmVector<CubismIdHandle>; // 在模型中设定的对口型功能用参数ID

  _motions: csmMap<string, ACubismMotion>; // 正在读取的动作列表
  _expressions: csmMap<string, ACubismMotion>; // 正在读取的表情列表

  _hitArea: csmVector<csmRect>;
  _userArea: csmVector<csmRect>;

  _idParamAngleX: CubismIdHandle; // 参数ID: ParamAngleX
  _idParamAngleY: CubismIdHandle; // 参数ID: ParamAngleY
  _idParamAngleZ: CubismIdHandle; // 参数ID: ParamAngleZ
  _idParamEyeBallX: CubismIdHandle; // 参数ID: ParamEyeBallX
  _idParamEyeBallY: CubismIdHandle; // 参数ID: ParamEyeBAllY
  _idParamBodyAngleX: CubismIdHandle; // 参数ID: ParamBodyAngleX

  _state: number; // 用于当前状态管理
  _expressionCount: number; // 表情数据计数
  _textureCount: number; // 纹理计数
  _motionCount: number; // 运动数据计数
  _allMotionCount: number; // 运动总数
}
