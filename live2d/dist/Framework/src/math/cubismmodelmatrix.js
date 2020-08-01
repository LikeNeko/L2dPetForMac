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
    var CubismModelMatrix = (function (_super) {
        __extends(CubismModelMatrix, _super);
        function CubismModelMatrix(w, h) {
            var _this = _super.call(this) || this;
            _this._width = w !== undefined ? w : 0.0;
            _this._height = h !== undefined ? h : 0.0;
            _this.setHeight(1.0);
            return _this;
        }
        CubismModelMatrix.prototype.setWidth = function (w) {
            var scaleX = w / this._width;
            var scaleY = scaleX;
            this.scale(scaleX, scaleY);
        };
        CubismModelMatrix.prototype.setHeight = function (h) {
            var scaleX = h / this._height;
            var scaleY = scaleX;
            this.scale(scaleX, scaleY);
        };
        CubismModelMatrix.prototype.setPosition = function (x, y) {
            this.translate(x, y);
        };
        CubismModelMatrix.prototype.setCenterPosition = function (x, y) {
            this.centerX(x);
            this.centerY(y);
        };
        CubismModelMatrix.prototype.top = function (y) {
            this.setY(y);
        };
        CubismModelMatrix.prototype.bottom = function (y) {
            var h = this._height * this.getScaleY();
            this.translateY(y - h);
        };
        CubismModelMatrix.prototype.left = function (x) {
            this.setX(x);
        };
        CubismModelMatrix.prototype.right = function (x) {
            var w = this._width * this.getScaleX();
            this.translateX(x - w);
        };
        CubismModelMatrix.prototype.centerX = function (x) {
            var w = this._width * this.getScaleX();
            this.translateX(x - w / 2.0);
        };
        CubismModelMatrix.prototype.setX = function (x) {
            this.translateX(x);
        };
        CubismModelMatrix.prototype.centerY = function (y) {
            var h = this._height * this.getScaleY();
            this.translateY(y - h / 2.0);
        };
        CubismModelMatrix.prototype.setY = function (y) {
            this.translateY(y);
        };
        CubismModelMatrix.prototype.setupFromLayout = function (layout) {
            var keyWidth = 'width';
            var keyHeight = 'height';
            var keyX = 'x';
            var keyY = 'y';
            var keyCenterX = 'center_x';
            var keyCenterY = 'center_y';
            var keyTop = 'top';
            var keyBottom = 'bottom';
            var keyLeft = 'left';
            var keyRight = 'right';
            for (var ite = layout.begin(); ite.notEqual(layout.end()); ite.preIncrement()) {
                var key = ite.ptr().first;
                var value = ite.ptr().second;
                if (key == keyWidth) {
                    this.setWidth(value);
                }
                else if (key == keyHeight) {
                    this.setHeight(value);
                }
            }
            for (var ite = layout.begin(); ite.notEqual(layout.end()); ite.preIncrement()) {
                var key = ite.ptr().first;
                var value = ite.ptr().second;
                if (key == keyX) {
                    this.setX(value);
                }
                else if (key == keyY) {
                    this.setY(value);
                }
                else if (key == keyCenterX) {
                    this.centerX(value);
                }
                else if (key == keyCenterY) {
                    this.centerY(value);
                }
                else if (key == keyTop) {
                    this.top(value);
                }
                else if (key == keyBottom) {
                    this.bottom(value);
                }
                else if (key == keyLeft) {
                    this.left(value);
                }
                else if (key == keyRight) {
                    this.right(value);
                }
            }
        };
        return CubismModelMatrix;
    }(CubismMatrix44));
    Live2DCubismFramework.CubismModelMatrix = CubismModelMatrix;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmodelmatrix.js.map