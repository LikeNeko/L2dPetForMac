"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var cubismmatrix44_1 = require("./cubismmatrix44");
var CubismMatrix44 = cubismmatrix44_1.Live2DCubismFramework.CubismMatrix44;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var CubismViewMatrix = (function (_super) {
        __extends(CubismViewMatrix, _super);
        function CubismViewMatrix() {
            var _this = _super.call(this) || this;
            _this._screenLeft = 0.0;
            _this._screenRight = 0.0;
            _this._screenTop = 0.0;
            _this._screenBottom = 0.0;
            _this._maxLeft = 0.0;
            _this._maxRight = 0.0;
            _this._maxTop = 0.0;
            _this._maxBottom = 0.0;
            _this._maxScale = 0.0;
            _this._minScale = 0.0;
            return _this;
        }
        CubismViewMatrix.prototype.adjustTranslate = function (x, y) {
            if (this._tr[0] * this._maxLeft + (this._tr[12] + x) > this._screenLeft) {
                x = this._screenLeft - this._tr[0] * this._maxLeft - this._tr[12];
            }
            if (this._tr[0] * this._maxRight + (this._tr[12] + x) <
                this._screenRight) {
                x = this._screenRight - this._tr[0] * this._maxRight - this._tr[12];
            }
            if (this._tr[5] * this._maxTop + (this._tr[13] + y) < this._screenTop) {
                y = this._screenTop - this._tr[5] * this._maxTop - this._tr[13];
            }
            if (this._tr[5] * this._maxBottom + (this._tr[13] + y) >
                this._screenBottom) {
                y = this._screenBottom - this._tr[5] * this._maxBottom - this._tr[13];
            }
            var tr1 = new Float32Array([
                1.0,
                0.0,
                0.0,
                0.0,
                0.0,
                1.0,
                0.0,
                0.0,
                0.0,
                0.0,
                1.0,
                0.0,
                x,
                y,
                0.0,
                1.0
            ]);
            CubismMatrix44.multiply(tr1, this._tr, this._tr);
        };
        CubismViewMatrix.prototype.adjustScale = function (cx, cy, scale) {
            var maxScale = this.getMaxScale();
            var minScale = this.getMinScale();
            var targetScale = scale * this._tr[0];
            if (targetScale < minScale) {
                if (this._tr[0] > 0.0) {
                    scale = minScale / this._tr[0];
                }
            }
            else if (targetScale > maxScale) {
                if (this._tr[0] > 0.0) {
                    scale = maxScale / this._tr[0];
                }
            }
            var tr1 = new Float32Array([
                1.0,
                0.0,
                0.0,
                0.0,
                0.0,
                1.0,
                0.0,
                0.0,
                0.0,
                0.0,
                1.0,
                0.0,
                cx,
                cy,
                0.0,
                1.0
            ]);
            var tr2 = new Float32Array([
                scale,
                0.0,
                0.0,
                0.0,
                0.0,
                scale,
                0.0,
                0.0,
                0.0,
                0.0,
                1.0,
                0.0,
                0.0,
                0.0,
                0.0,
                1.0
            ]);
            var tr3 = new Float32Array([
                1.0,
                0.0,
                0.0,
                0.0,
                0.0,
                1.0,
                0.0,
                0.0,
                0.0,
                0.0,
                1.0,
                0.0,
                -cx,
                -cy,
                0.0,
                1.0
            ]);
            CubismMatrix44.multiply(tr3, this._tr, this._tr);
            CubismMatrix44.multiply(tr2, this._tr, this._tr);
            CubismMatrix44.multiply(tr1, this._tr, this._tr);
        };
        CubismViewMatrix.prototype.setScreenRect = function (left, right, bottom, top) {
            this._screenLeft = left;
            this._screenRight = right;
            this._screenBottom = bottom;
            this._screenTop = top;
        };
        CubismViewMatrix.prototype.setMaxScreenRect = function (left, right, bottom, top) {
            this._maxLeft = left;
            this._maxRight = right;
            this._maxTop = top;
            this._maxBottom = bottom;
        };
        CubismViewMatrix.prototype.setMaxScale = function (maxScale) {
            this._maxScale = maxScale;
        };
        CubismViewMatrix.prototype.setMinScale = function (minScale) {
            this._minScale = minScale;
        };
        CubismViewMatrix.prototype.getMaxScale = function () {
            return this._maxScale;
        };
        CubismViewMatrix.prototype.getMinScale = function () {
            return this._minScale;
        };
        CubismViewMatrix.prototype.isMaxScale = function () {
            return this.getScaleX() >= this._maxScale;
        };
        CubismViewMatrix.prototype.isMinScale = function () {
            return this.getScaleX() <= this._minScale;
        };
        CubismViewMatrix.prototype.getScreenLeft = function () {
            return this._screenLeft;
        };
        CubismViewMatrix.prototype.getScreenRight = function () {
            return this._screenRight;
        };
        CubismViewMatrix.prototype.getScreenBottom = function () {
            return this._screenBottom;
        };
        CubismViewMatrix.prototype.getScreenTop = function () {
            return this._screenTop;
        };
        CubismViewMatrix.prototype.getMaxLeft = function () {
            return this._maxLeft;
        };
        CubismViewMatrix.prototype.getMaxRight = function () {
            return this._maxRight;
        };
        CubismViewMatrix.prototype.getMaxBottom = function () {
            return this._maxBottom;
        };
        CubismViewMatrix.prototype.getMaxTop = function () {
            return this._maxTop;
        };
        return CubismViewMatrix;
    }(CubismMatrix44));
    Live2DCubismFramework.CubismViewMatrix = CubismViewMatrix;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismviewmatrix.js.map