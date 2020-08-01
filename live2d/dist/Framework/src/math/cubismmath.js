"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var cubismvector2_1 = require("./cubismvector2");
var CubismVector2 = cubismvector2_1.Live2DCubismFramework.CubismVector2;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var CubismMath = (function () {
        function CubismMath() {
        }
        CubismMath.range = function (value, min, max) {
            if (value < min) {
                value = min;
            }
            else if (value > max) {
                value = max;
            }
            return value;
        };
        CubismMath.sin = function (x) {
            return Math.sin(x);
        };
        CubismMath.cos = function (x) {
            return Math.cos(x);
        };
        CubismMath.abs = function (x) {
            return Math.abs(x);
        };
        CubismMath.sqrt = function (x) {
            return Math.sqrt(x);
        };
        CubismMath.getEasingSine = function (value) {
            if (value < 0.0) {
                return 0.0;
            }
            else if (value > 1.0) {
                return 1.0;
            }
            return 0.5 - 0.5 * this.cos(value * Math.PI);
        };
        CubismMath.max = function (left, right) {
            return left > right ? left : right;
        };
        CubismMath.min = function (left, right) {
            return left > right ? right : left;
        };
        CubismMath.degreesToRadian = function (degrees) {
            return (degrees / 180.0) * Math.PI;
        };
        CubismMath.radianToDegrees = function (radian) {
            return (radian * 180.0) / Math.PI;
        };
        CubismMath.directionToRadian = function (from, to) {
            var q1 = Math.atan2(to.y, to.x);
            var q2 = Math.atan2(from.y, from.x);
            var ret = q1 - q2;
            while (ret < -Math.PI) {
                ret += Math.PI * 2.0;
            }
            while (ret > Math.PI) {
                ret -= Math.PI * 2.0;
            }
            return ret;
        };
        CubismMath.directionToDegrees = function (from, to) {
            var radian = this.directionToRadian(from, to);
            var degree = this.radianToDegrees(radian);
            if (to.x - from.x > 0.0) {
                degree = -degree;
            }
            return degree;
        };
        CubismMath.radianToDirection = function (totalAngle) {
            var ret = new CubismVector2();
            ret.x = this.sin(totalAngle);
            ret.y = this.cos(totalAngle);
            return ret;
        };
        return CubismMath;
    }());
    Live2DCubismFramework.CubismMath = CubismMath;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmath.js.map