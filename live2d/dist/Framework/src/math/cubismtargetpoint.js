"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var cubismmath_1 = require("./cubismmath");
var CubismMath = cubismmath_1.Live2DCubismFramework.CubismMath;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var FrameRate = 30;
    var Epsilon = 0.01;
    var CubismTargetPoint = (function () {
        function CubismTargetPoint() {
            this._faceTargetX = 0.0;
            this._faceTargetY = 0.0;
            this._faceX = 0.0;
            this._faceY = 0.0;
            this._faceVX = 0.0;
            this._faceVY = 0.0;
            this._lastTimeSeconds = 0.0;
            this._userTimeSeconds = 0.0;
        }
        CubismTargetPoint.prototype.update = function (deltaTimeSeconds) {
            this._userTimeSeconds += deltaTimeSeconds;
            var faceParamMaxV = 40.0 / 10.0;
            var maxV = (faceParamMaxV * 1.0) / FrameRate;
            if (this._lastTimeSeconds == 0.0) {
                this._lastTimeSeconds = this._userTimeSeconds;
                return;
            }
            var deltaTimeWeight = (this._userTimeSeconds - this._lastTimeSeconds) * FrameRate;
            this._lastTimeSeconds = this._userTimeSeconds;
            var timeToMaxSpeed = 0.15;
            var frameToMaxSpeed = timeToMaxSpeed * FrameRate;
            var maxA = (deltaTimeWeight * maxV) / frameToMaxSpeed;
            var dx = this._faceTargetX - this._faceX;
            var dy = this._faceTargetY - this._faceY;
            if (CubismMath.abs(dx) <= Epsilon && CubismMath.abs(dy) <= Epsilon) {
                return;
            }
            var d = CubismMath.sqrt(dx * dx + dy * dy);
            var vx = (maxV * dx) / d;
            var vy = (maxV * dy) / d;
            var ax = vx - this._faceVX;
            var ay = vy - this._faceVY;
            var a = CubismMath.sqrt(ax * ax + ay * ay);
            if (a < -maxA || a > maxA) {
                ax *= maxA / a;
                ay *= maxA / a;
            }
            this._faceVX += ax;
            this._faceVY += ay;
            {
                var maxV_1 = 0.5 *
                    (CubismMath.sqrt(maxA * maxA + 16.0 * maxA * d - 8.0 * maxA * d) -
                        maxA);
                var curV = CubismMath.sqrt(this._faceVX * this._faceVX + this._faceVY * this._faceVY);
                if (curV > maxV_1) {
                    this._faceVX *= maxV_1 / curV;
                    this._faceVY *= maxV_1 / curV;
                }
            }
            this._faceX += this._faceVX;
            this._faceY += this._faceVY;
        };
        CubismTargetPoint.prototype.getX = function () {
            return this._faceX;
        };
        CubismTargetPoint.prototype.getY = function () {
            return this._faceY;
        };
        CubismTargetPoint.prototype.set = function (x, y) {
            this._faceTargetX = x;
            this._faceTargetY = y;
        };
        return CubismTargetPoint;
    }());
    Live2DCubismFramework.CubismTargetPoint = CubismTargetPoint;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismtargetpoint.js.map