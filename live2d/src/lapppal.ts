/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

/**
 * 抽象化平台相关功能的Cubism Platform Abstraction Layer。
 *
 * 汇总文件读取和时刻获取等依赖于平台的函数。
 */
// 声明一个全局的log方法，用来打log

export class LAppPal {
  /**
   * 把文件作为字节数据读取
   *
   * @param filePath 読み込み対象ファイルのパス
   * @return
   * {
   *      buffer,  读取的字节数据
   *      size     文件大小
   * }
   */
  public static loadFileAsBytes(
    filePath: string,
    callback: (arrayBuffer: ArrayBuffer, size: number) => void
  ): void {
    fetch(filePath)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => callback(arrayBuffer, arrayBuffer.byteLength));
  }

  /**
   * 获取增量时间(与前一帧的差)
   * @return デルタ時間[ms]
   */
  public static getDeltaTime(): number {
    return this.s_deltaTime;
  }

  public static updateTime(): void {
    this.s_currentFrame = Date.now();
    this.s_deltaTime = (this.s_currentFrame - this.s_lastFrame) / 1000;
    this.s_lastFrame = this.s_currentFrame;
  }

  /**
   * 输出信息
   * @param message 文字列
   */
  public static printMessage(message: string): void {
    console.log(message);
  }

  public static log(any:any,tag:string = "info"):void{
    // @ts-ignore
    console.log(any,tag);
  }
  public static getName(fun){
    return typeof fun==='function'?
        undefined:
        fun.name||/function (.+)\(/.exec(fun + '')[1];
  }


  static lastUpdate = Date.now();

  static s_currentFrame = 0.0;
  static s_lastFrame = 0.0;
  static s_deltaTime = 0.0;
}
