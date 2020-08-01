"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var cubismmath_1 = require("../math/cubismmath");
var csmvector_1 = require("../type/csmvector");
var cubismdebug_1 = require("../utils/cubismdebug");
var csmVector = csmvector_1.Live2DCubismFramework.csmVector;
var CubismMath = cubismmath_1.Live2DCubismFramework.CubismMath;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var ACubismMotion = (function () {
        function ACubismMotion() {
            var _this = this;
            this.setFinishedMotionHandler = function (onFinishedMotionHandler) { return (_this._onFinishedMotion = onFinishedMotionHandler); };
            this.getFinishedMotionHandler = function () { return _this._onFinishedMotion; };
            this._fadeInSeconds = -1.0;
            this._fadeOutSeconds = -1.0;
            this._weight = 1.0;
            this._offsetSeconds = 0.0;
            this._firedEventValues = new csmVector();
        }
        ACubismMotion.delete = function (motion) {
            motion.release();
            motion = void 0;
            motion = null;
        };
        ACubismMotion.prototype.release = function () {
            this._weight = 0.0;
        };
        ACubismMotion.prototype.updateParameters = function (model, motionQueueEntry, userTimeSeconds) {
            if (!motionQueueEntry.isAvailable() || motionQueueEntry.isFinished()) {
                return;
            }
            if (!motionQueueEntry.isStarted()) {
                motionQueueEntry.setIsStarted(true);
                motionQueueEntry.setStartTime(userTimeSeconds - this._offsetSeconds);
                motionQueueEntry.setFadeInStartTime(userTimeSeconds);
                var duration = this.getDuration();
                if (motionQueueEntry.getEndTime() < 0) {
                    motionQueueEntry.setEndTime(duration <= 0 ? -1 : motionQueueEntry.getStartTime() + duration);
                }
            }
            var fadeWeight = this._weight;
            var fadeIn = this._fadeInSeconds == 0.0
                ? 1.0
                : CubismMath.getEasingSine((userTimeSeconds - motionQueueEntry.getFadeInStartTime()) /
                    this._fadeInSeconds);
            var fadeOut = this._fadeOutSeconds == 0.0 || motionQueueEntry.getEndTime() < 0.0
                ? 1.0
                : CubismMath.getEasingSine((motionQueueEntry.getEndTime() - userTimeSeconds) /
                    this._fadeOutSeconds);
            fadeWeight = fadeWeight * fadeIn * fadeOut;
            motionQueueEntry.setState(userTimeSeconds, fadeWeight);
            cubismdebug_1.CSM_ASSERT(0.0 <= fadeWeight && fadeWeight <= 1.0);
            this.doUpdateParameters(model, userTimeSeconds, fadeWeight, motionQueueEntry);
            if (motionQueueEntry.getEndTime() > 0 &&
                motionQueueEntry.getEndTime() < userTimeSeconds) {
                motionQueueEntry.setIsFinished(true);
            }
        };
        ACubismMotion.prototype.setFadeInTime = function (fadeInSeconds) {
            this._fadeInSeconds = fadeInSeconds;
        };
        ACubismMotion.prototype.setFadeOutTime = function (fadeOutSeconds) {
            this._fadeOutSeconds = fadeOutSeconds;
        };
        ACubismMotion.prototype.getFadeOutTime = function () {
            return this._fadeOutSeconds;
        };
        ACubismMotion.prototype.getFadeInTime = function () {
            return this._fadeInSeconds;
        };
        ACubismMotion.prototype.setWeight = function (weight) {
            this._weight = weight;
        };
        ACubismMotion.prototype.getWeight = function () {
            return this._weight;
        };
        ACubismMotion.prototype.getDuration = function () {
            return -1.0;
        };
        ACubismMotion.prototype.getLoopDuration = function () {
            return -1.0;
        };
        ACubismMotion.prototype.setOffsetTime = function (offsetSeconds) {
            this._offsetSeconds = offsetSeconds;
        };
        ACubismMotion.prototype.getFiredEvent = function (beforeCheckTimeSeconds, motionTimeSeconds) {
            return this._firedEventValues;
        };
        return ACubismMotion;
    }());
    Live2DCubismFramework.ACubismMotion = ACubismMotion;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=acubismmotion.js.map