/**
 * 版权(c) Live2D Inc .)保留所有权利。
 *
 * 此源代码的使用受Live2D开放软件许可证的约束
 * that can be found at https:// www.live2d.com/eula/live2d-open-software-license-agreement_en.html。
 */

import {gl, canvas} from './lappdelegate';
import {LAppPal} from "./lapppal";
import {m3} from './lcanvas';

/**
 * 实现雪碧的类
 *
 * 纹理ID、Rect的管理
 */
export class LAppSprite {
    /**
     * The elves width
     */
    _width: number;
    /**
     * The elves height
     */
    _height: number;

    _x: any;
    _y: any;
    _matrixLocation: WebGLUniformLocation;
    _matrix: number[];
    _angleInRadians = 0;
    _translation = { x: 0, y: 0 };
    _scale = { x: 1, y: 1 };
    _origin = { x: 0, y:0};

    /**
     * 构造函数
     * @param x            x座標
     * @param y            y座標
     * @param width        横幅
     * @param height       高さ
     * @param textureId    纹理
     */
    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        textureId: WebGLTexture
    ) {
        this._width = width;
        this._height = height;
        this._x = x;
        this._y = y;
        this._translation.x = x;
        this._translation.y = y;
        this._rect = new Rect();

        this._rect.left = x;// 0- 64*0.5 32
        this._rect.right = x + width;// 0+64*0.5 32
        this._rect.up = y ;
        this._rect.down = y - height;
        console.log(this._rect,x,y,width,height)
        this._texture = textureId;
        this._vertexBuffer = null;
        this._uvBuffer = null;
        this._indexBuffer = null;

        this._positionLocation = null;
        this._uvLocation = null;
        this._textureLocation = null;

        this._positionArray = null;
        this._uvArray = null;
        this._indexArray = null;

        this._firstDraw = true;
    }

    /**
     * 解放
     */
    public release(): void {
        this._rect = null;

        gl.deleteTexture(this._texture);
        this._texture = null;

        gl.deleteBuffer(this._uvBuffer);
        this._uvBuffer = null;

        gl.deleteBuffer(this._vertexBuffer);
        this._vertexBuffer = null;

        gl.deleteBuffer(this._indexBuffer);
        this._indexBuffer = null;

        this._matrixLocation = null;
    }

    /**
     * 返回纹理
     */
    public getTexture(): WebGLTexture {
        return this._texture;
    }
    public position(x,y) {
        this._x = x;
        this._y = y;
        this._translation = {x:x,y:y}
        this.reload()
    }

    public angle(val) {
        this._angleInRadians =val;
        this.reload()
    }

    public scale(x,y) {
        this._scale = {x:x,y:y}
        this.reload()
    }
    public origin(x,y){
        this._origin = {x:x,y:y}
        this.reload()
    }

    public reset(){
        this.reload()
    }
    public reload(){
        // Compute the matrices
        let matrix = m3.projection(gl.drawingBufferWidth, gl.drawingBufferHeight);
        matrix = m3.translate(matrix, this._translation.x, this._translation.y);
        matrix = m3.rotate(matrix, this._angleInRadians);
        matrix = m3.scale(matrix, this._scale.x, this._scale.y);
        // make a matrix that will move the origin of the 'F' to its center.
        let moveOriginMatrix = m3.translation(-this._origin.x, -this._origin.y);
        // let moveOriginMatrix = m3.translation(-this._width/2, -this._height/2);
        matrix = m3.multiply(matrix, moveOriginMatrix);
        this._matrix = matrix;
    }
    public rect(rect:Rect){
        this._rect = rect;
    }
    public width(w){
        this._rect.left = this._x - w * 0.5;
        this._rect.right = this._x + w * 0.5;

    }
    public height(h){
        this._rect.up = this._y + h * 0.5;
        this._rect.down = this._y - h * 0.5;
    }
    /**
     * 绘图
     * @param programId 着色器程序
     */
    public render(programId: WebGLProgram): void {
        if (this._texture == null) {
            // 加载没有完成
            return;
        }

        // 初回绘制时
        if (this._firstDraw) {
            // 获取属性变量的数目
            this._positionLocation = gl.getAttribLocation(programId, 'a_position');
            gl.enableVertexAttribArray(this._positionLocation);

            // 获取uv的属性变量
            this._uvLocation = gl.getAttribLocation(programId, 'uv');
            gl.enableVertexAttribArray(this._uvLocation);

            // lookup uniforms
            this._matrixLocation = gl.getUniformLocation(programId, "u_matrix");

            // 得到UNIFORM变量的个数
            this._textureLocation = gl.getUniformLocation(programId, 'texture');


            // uniform属性的注册
            gl.uniform1i(this._textureLocation, 0);

            // Uv缓冲，坐标初始化
            {
                this._uvArray = new Float32Array([
                    1.0, 0.0,
                    0.0, 0.0,
                    0.0, 1.0,
                    1.0, 1.0
                ]);

                // 创建uv缓冲器
                this._uvBuffer = gl.createBuffer();
            }

            // 顶点缓冲，坐标初始化
            {
                this._positionArray = new Float32Array([
                    this._rect.right, this._rect.up,
                    this._rect.left, this._rect.up,
                    this._rect.left, this._rect.down,
                    this._rect.right, this._rect.down
                ])
                // 创建一个顶点缓冲器
                this._vertexBuffer = gl.createBuffer();
            }

            // 顶点索引缓冲器初始化
            {
                // 索引数据
                this._indexArray = new Uint16Array([0, 1, 2, 3, 2, 0]);

                // 创建索引缓冲器
                this._indexBuffer = gl.createBuffer();
            }

            this._firstDraw = false;
        }
        this.reload()

        // UV座标登录
        gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._uvArray, gl.STATIC_DRAW);

        // 注册attribute属性
        gl.vertexAttribPointer(this._uvLocation, 2, gl.FLOAT, false, 0, 0);

        // 登记顶点坐标

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, this._positionArray, gl.STATIC_DRAW);

        // 注册attribute属性
        gl.vertexAttribPointer(this._positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Set the matrix.
        gl.uniformMatrix3fv(this._matrixLocation, false, this._matrix);

        // 创建顶点索引
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indexArray, gl.DYNAMIC_DRAW);

        // 模型图
        gl.bindTexture(gl.TEXTURE_2D, this._texture);

        // 宽高不等也ok
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.drawElements(
            gl.TRIANGLES,
            this._indexArray.length,
            gl.UNSIGNED_SHORT,
            0
        );
    }

    /**
     * 猜中判定
     * @param pointX x座標
     * @param pointY y座標
     */
    public isHit(pointX: number, pointY: number): boolean {
        // 获取画面尺寸。
        const {height} = canvas;

        // Y坐标需要变换，
        const y = height - pointY;

        return (
            pointX >= this._rect.left &&
            pointX <= this._rect.right &&
            y <= this._rect.up &&
            y >= this._rect.down
        );
    }

    _texture: WebGLTexture; // テクスチャ
    _vertexBuffer: WebGLBuffer; // 顶点缓冲器
    _uvBuffer: WebGLBuffer; // uv顶点缓冲器
    _indexBuffer: WebGLBuffer; // 顶点索引缓冲器
    _rect: Rect; // 矩形的

    _positionLocation: number;
    _uvLocation: number;
    _textureLocation: WebGLUniformLocation;

    _positionArray: Float32Array;
    _uvArray: Float32Array;
    _indexArray: Uint16Array;

    _firstDraw: boolean;
}

export class Rect {
    public left: number; // 左辺
    public right: number; // 右辺
    public up: number; // 上辺
    public down: number; // 下辺
}
