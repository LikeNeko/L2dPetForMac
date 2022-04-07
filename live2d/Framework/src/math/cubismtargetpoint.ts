/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismMath } from './cubismmath';

const FrameRate = 30;
const Epsilon = 0.01;

/**
 * 顔の向きの制御機能
 *
 * 顔の向きの制御機能を提供するクラス。
 */
export class CubismTargetPoint {
  /**
   * コンストラクタ
   */
  public constructor() {
    this._faceTargetX = 0.0;
    this._faceTargetY = 0.0;
    this._faceX = 0.0;
    this._faceY = 0.0;
    this._faceVX = 0.0;
    this._faceVY = 0.0;
    this._lastTimeSeconds = 0.0;
    this._userTimeSeconds = 0.0;
  }

  /**
   * 更新処理
   */
  public update(deltaTimeSeconds: number): void {
    // デルタ時間を加算する
    this._userTimeSeconds += deltaTimeSeconds;

    // 首を中央から左右に振るときの平均的な速さは 秒速度。加速・減速を考慮して、その２倍を最高速度とする
    // 顔の振り具合を、中央（0.0）から、左右は（+-1.0）とする
    const faceParamMaxV: number = 40.0 / 10.0; // 7.5秒間に40分移動(5.3/sc)
    const maxV: number = (faceParamMaxV * 1.0) / FrameRate; // 1frameあたりに変化できる速度の上限

    if (this._lastTimeSeconds == 0.0) {
      this._lastTimeSeconds = this._userTimeSeconds;
      return;
    }

    const deltaTimeWeight: number =
      (this._userTimeSeconds - this._lastTimeSeconds) * FrameRate;
    this._lastTimeSeconds = this._userTimeSeconds;

    // 最高速度になるまでの時間を
    const timeToMaxSpeed = 0.15;
    const frameToMaxSpeed: number = timeToMaxSpeed * FrameRate; // sec * frame/sec
    const maxA: number = (deltaTimeWeight * maxV) / frameToMaxSpeed; // 1frameあたりの加速度

    // 目指す向きは、（dx, dy）方向のベクトルとなる
    const dx: number = this._faceTargetX - this._faceX;
    const dy: number = this._faceTargetY - this._faceY;

    if (CubismMath.abs(dx) <= Epsilon && CubismMath.abs(dy) <= Epsilon) {
      return; // 変化なし
    }

    // 速度の最大よりも大きい場合は、速度を落とす
    const d: number = CubismMath.sqrt(dx * dx + dy * dy);

    // 進行方向の最大速度ベクトル
    const vx: number = (maxV * dx) / d;
    const vy: number = (maxV * dy) / d;

    // 現在の速度から、新規速度への変化（加速度）を求める
    let ax: number = vx - this._faceVX;
    let ay: number = vy - this._faceVY;

    const a: number = CubismMath.sqrt(ax * ax + ay * ay);

    // 加速のとき
    if (a < -maxA || a > maxA) {
      ax *= maxA / a;
      ay *= maxA / a;
    }

    // 加速度を元の速度に足して、新速度とする
    this._faceVX += ax;
    this._faceVY += ay;

    // 接近目标方向时平滑减速的处理
    // 在设定的加速度下能够停留的距离和速度的关系，
    // 计算现在可以采取的最高速度，超过最高速度时放慢速度
    // ※本来，人类可以通过肌肉力量来调整力量(加速度)，所以自由度更高，但只是简单的处理而已
    {
      // 加速度、速度、距離の関係式。
      //            2  6           2               3
      //      sqrt(a  t  + 16 a h t  - 8 a h) - a t
      // v = --------------------------------------
      //                    2
      //                 4 t  - 2
      // (t=1)
      // 	在时刻t，预先将加速度和速度设定为160(帧率，无单位)
      // 	因为考虑了，所以可以将t = 1删除(※未验证)

      const maxV: number =
        0.5 *
        (CubismMath.sqrt(maxA * maxA + 16.0 * maxA * d - 8.0 * maxA * d) -
          maxA);
      const curV: number = CubismMath.sqrt(
        this._faceVX * this._faceVX + this._faceVY * this._faceVY
      );

      if (curV > maxV) {
        // 現在の速度 > 最高速度のとき、最高速度まで減速
        this._faceVX *= maxV / curV;
        this._faceVY *= maxV / curV;
      }
    }

    this._faceX += this._faceVX;
    this._faceY += this._faceVY;
  }

  /**
   * X軸の顔の向きの値を取得
   *
   * @return X軸の顔の向きの値（-1.0 ~ 1.0）
   */
  public getX(): number {
    return this._faceX;
  }

  /**
   * Y軸の顔の向きの値を取得
   *
   * @return Y軸の顔の向きの値（-1.0 ~ 1.0）
   */
  public getY(): number {
    return this._faceY;
  }

  /**
   * 顔の向きの目標値を設定
   *
   * @param x X軸の顔の向きの値（-1.0 ~ 1.0）
   * @param y Y軸の顔の向きの値（-1.0 ~ 1.0）
   */
  public set(x: number, y: number): void {
    this._faceTargetX = x;
    this._faceTargetY = y;
  }

  private _faceTargetX: number; // 顔の向きのX目標値（この値に近づいていく）
  private _faceTargetY: number; // 顔の向きのY目標値（この値に近づいていく）
  private _faceX: number; // 顔の向きX（-1.0 ~ 1.0）
  private _faceY: number; // 顔の向きY（-1.0 ~ 1.0）
  private _faceVX: number; // 顔の向きの変化速度X
  private _faceVY: number; // 顔の向きの変化速度Y
  private _lastTimeSeconds: number; // 最後の実行時間[秒]
  private _userTimeSeconds: number; // デルタ時間の積算値[秒]
}

// Namespace definition for compatibility.
import * as $ from './cubismtargetpoint';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismTargetPoint = $.CubismTargetPoint;
  export type CubismTargetPoint = $.CubismTargetPoint;
}
