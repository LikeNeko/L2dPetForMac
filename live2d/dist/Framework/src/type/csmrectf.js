"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var csmRect = (function () {
        function csmRect(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
        }
        csmRect.prototype.getCenterX = function () {
            return this.x + 0.5 * this.width;
        };
        csmRect.prototype.getCenterY = function () {
            return this.y + 0.5 * this.height;
        };
        csmRect.prototype.getRight = function () {
            return this.x + this.width;
        };
        csmRect.prototype.getBottom = function () {
            return this.y + this.height;
        };
        csmRect.prototype.setRect = function (r) {
            this.x = r.x;
            this.y = r.y;
            this.width = r.width;
            this.height = r.height;
        };
        csmRect.prototype.expand = function (w, h) {
            this.x -= w;
            this.y -= h;
            this.width += w * 2.0;
            this.height += h * 2.0;
        };
        return csmRect;
    }());
    Live2DCubismFramework.csmRect = csmRect;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=csmrectf.js.map