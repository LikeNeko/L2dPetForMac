"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var CubismVector2 = (function () {
        function CubismVector2(x, y) {
            this.x = x;
            this.y = y;
            this.x = x == undefined ? 0.0 : x;
            this.y = y == undefined ? 0.0 : y;
        }
        CubismVector2.prototype.add = function (vector2) {
            var ret = new CubismVector2(0.0, 0.0);
            ret.x = this.x + vector2.x;
            ret.y = this.y + vector2.y;
            return ret;
        };
        CubismVector2.prototype.substract = function (vector2) {
            var ret = new CubismVector2(0.0, 0.0);
            ret.x = this.x - vector2.x;
            ret.y = this.y - vector2.y;
            return ret;
        };
        CubismVector2.prototype.multiply = function (vector2) {
            var ret = new CubismVector2(0.0, 0.0);
            ret.x = this.x * vector2.x;
            ret.y = this.y * vector2.y;
            return ret;
        };
        CubismVector2.prototype.multiplyByScaler = function (scalar) {
            return this.multiply(new CubismVector2(scalar, scalar));
        };
        CubismVector2.prototype.division = function (vector2) {
            var ret = new CubismVector2(0.0, 0.0);
            ret.x = this.x / vector2.x;
            ret.y = this.y / vector2.y;
            return ret;
        };
        CubismVector2.prototype.divisionByScalar = function (scalar) {
            return this.division(new CubismVector2(scalar, scalar));
        };
        CubismVector2.prototype.getLength = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        CubismVector2.prototype.getDistanceWith = function (a) {
            return Math.sqrt((this.x - a.x) * (this.x - a.x) + (this.y - a.y) * (this.y - a.y));
        };
        CubismVector2.prototype.dot = function (a) {
            return this.x * a.x + this.y * a.y;
        };
        CubismVector2.prototype.normalize = function () {
            var length = Math.pow(this.x * this.x + this.y * this.y, 0.5);
            this.x = this.x / length;
            this.y = this.y / length;
        };
        CubismVector2.prototype.isEqual = function (rhs) {
            return this.x == rhs.x && this.y == rhs.y;
        };
        CubismVector2.prototype.isNotEqual = function (rhs) {
            return !this.isEqual(rhs);
        };
        return CubismVector2;
    }());
    Live2DCubismFramework.CubismVector2 = CubismVector2;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismvector2.js.map