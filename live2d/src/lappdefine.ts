/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LogLevel } from '@framework/live2dcubismframework';

/**
 * Sample Appで使用する定数
 */
// 画面
export const ViewMaxScale = 2.0;
export const ViewMinScale = 0.1;

export const ViewLogicalLeft = -1.0;
export const ViewLogicalRight = 1.0;

export const ViewLogicalMaxLeft = -2.0;
export const ViewLogicalMaxRight = 2.0;
export const ViewLogicalMaxBottom = -2.0;
export const ViewLogicalMaxTop = 2.0;

// 相对路径
export const ResourcesPath = '../../res/models/';

// 模型后面的背景图像文件
export const BackImageName = 'back_class_normal.png';

// 齿轮
export const GearImageName = 'icon_gear.png';

// 结束按钮
export const PowerImageName = 'CloseNormal.png';

// 模型定义- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 配置模型的目录名的排列
// 保持目录名称与模型3一致。json的名字
export let ModelDir: string[] = ['++gongkaimo','cat_model_miao_pro','Senko','jinsechangzhifa','Rice','Hiyori','Haru',  'Mark', 'Natori'];
export const ModelDirSize: number = ModelDir.length;

// 配合外部定义文件(json)
export const MotionGroupIdle = 'Idle'; // 怠速
export const MotionGroupTapBody = 'TapBody'; // 当你轻敲它的身体时

// 配合外部定义文件(json)
export const HitAreaNameHead = 'Head';
export const HitAreaNameBody = 'Body';

// 运动的优先级常数
export const PriorityNone = 0;
export const PriorityIdle = 1;
export const PriorityNormal = 2;
export const PriorityForce = 3;

// 调试用日志的显示选项
export const DebugLogEnable = true;
export const DebugTouchLogEnable = true;
export const DebugModelLogEnable = true;

// 从Framework输出的日志的等级设定
export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;

// 默认的渲染目标尺寸
export const RenderTargetWidth = window.innerWidth;
export const RenderTargetHeight = window.innerHeight;

