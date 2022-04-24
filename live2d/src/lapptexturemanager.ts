/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { Live2DCubismFramework as csmvector } from '@framework/type/csmvector';
import Csm_csmVector = csmvector.csmVector;
import csmVector_iterator = csmvector.iterator;
import { gl } from './lappdelegate';
import {LAppLive2DManager} from "./lapplive2dmanager";

/**
 * 纹理管理类
 * 进行图像读取和管理的班级。
 */
export class LAppTextureManager {
  /**
   * 构造函数
   */
  constructor() {
    this._textures = new Csm_csmVector<TextureInfo>();
  }

  /**
   * 解放
   */
  public release(): void {
    for (
      let ite: csmVector_iterator<TextureInfo> = this._textures.begin();
      ite.notEqual(this._textures.end());
      ite.preIncrement()
    ) {
      gl.deleteTexture(ite.ptr().id);
    }
    this._textures = null;
  }

  /**
   * 图像读取
   *
   * @param fileName 読み込む画像ファイルパス名
   * @param usePremultiply 启用Premult处理
   * @return portrait情報、読み込み失敗時はnullを返す
   */
  public createTextureFromPngFile(
    fileName: string,
    usePremultiply: boolean,
    callback: (textureInfo: TextureInfo) => void
  ): void {
    // 搜索已经加载了纹理
    for (
      let ite: csmVector_iterator<TextureInfo> = this._textures.begin();
      ite.notEqual(this._textures.end());
      ite.preIncrement()
    ) {
      if (
        ite.ptr().fileName == fileName &&
        ite.ptr().usePremultply == usePremultiply
      ) {
        // 第二次以后使用缓存(无等待时间)
        // WebKit需要重新实例才能再次调用同一Image的onload
        // 详细：https://stackoverflow.com/a/5024181
        ite.ptr().img = new Image();
        ite.ptr().img.onload = (): void => callback(ite.ptr());
        ite.ptr().img.src = fileName;
        return;
      }
    }

    // 以加载数据为触发要素
    const img = new Image();
    img.onload = (): void => {
      // 创建纹理对象
      const tex: WebGLTexture = gl.createTexture();

      // 选择纹理
      gl.bindTexture(gl.TEXTURE_2D, tex);

      // 在纹理上写入像素
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      // 进行Premult处理
      if (usePremultiply) {
        // 透明处理
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
      }

      if (LAppLive2DManager.getInstance().cache_imgs[fileName]){
        console.log('使用缓存')
        // 在纹理上写入像素
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
            LAppLive2DManager.getInstance().cache_imgs[fileName]);
      }else{
        // 在纹理上写入像素
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      }


      // 是2次冥的走这个
      if (0===(img.width&img.width-1) || 0===(img.height&img.height-1)){
        // 生成地图
        gl.generateMipmap(gl.TEXTURE_2D);
      }

      // 粘合纹理
      gl.bindTexture(gl.TEXTURE_2D, null);

      const textureInfo: TextureInfo = new TextureInfo();
      if (textureInfo != null) {
        textureInfo.fileName = fileName;
        textureInfo.width = img.width;
        textureInfo.height = img.height;
        textureInfo.id = tex;
        textureInfo.img = img;
        textureInfo.usePremultply = usePremultiply;
        this._textures.pushBack(textureInfo);
      }

      callback(textureInfo);
    };
    img.src = fileName;
  }

  /**
   * 图像的解放
   *
   * 释放阵列中存在的所有图像。
   */
  public releaseTextures(): void {
    for (let i = 0; i < this._textures.getSize(); i++) {
      this._textures.set(i, null);
    }

    this._textures.clear();
  }

  /**
   * 图像的解放
   *
   * 释放指定纹理的图像。
   * @param texture 解放するテクスチャ
   */
  public releaseTextureByTexture(texture: WebGLTexture): void {
    for (let i = 0; i < this._textures.getSize(); i++) {
      if (this._textures.at(i).id != texture) {
        continue;
      }

      this._textures.set(i, null);
      this._textures.remove(i);
      break;
    }
  }

  /**
   * 图像的解放
   *
   * 释放指定名称的图像。
   * @param fileName 解放する画像ファイルパス名
   */
  public releaseTextureByFilePath(fileName: string): void {
    for (let i = 0; i < this._textures.getSize(); i++) {
      if (this._textures.at(i).fileName == fileName) {
        this._textures.set(i, null);
        this._textures.remove(i);
        break;
      }
    }
  }

  _textures: Csm_csmVector<TextureInfo>;
}

/**
 * 画像情报构造体
 */
export class TextureInfo {
  img: HTMLImageElement; // 画像
  id: WebGLTexture = null; // 纹理
  width = 0; // banner
  height = 0; // 高
  usePremultply: boolean; // Premult処理を有効にするか
  fileName: string; // 文件名
}
