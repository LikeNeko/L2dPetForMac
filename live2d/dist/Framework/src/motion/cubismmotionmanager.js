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
var cubismmotionqueuemanager_1 = require("./cubismmotionqueuemanager");
var CubismMotionQueueManager = cubismmotionqueuemanager_1.Live2DCubismFramework.CubismMotionQueueManager;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var CubismMotionManager = (function (_super) {
        __extends(CubismMotionManager, _super);
        function CubismMotionManager() {
            var _this = _super.call(this) || this;
            _this._currentPriority = 0;
            _this._reservePriority = 0;
            return _this;
        }
        CubismMotionManager.prototype.getCurrentPriority = function () {
            return this._currentPriority;
        };
        CubismMotionManager.prototype.getReservePriority = function () {
            return this._reservePriority;
        };
        CubismMotionManager.prototype.setReservePriority = function (val) {
            this._reservePriority = val;
        };
        CubismMotionManager.prototype.startMotionPriority = function (motion, autoDelete, priority) {
            if (priority == this._reservePriority) {
                this._reservePriority = 0;
            }
            this._currentPriority = priority;
            return _super.prototype.startMotion.call(this, motion, autoDelete, this._userTimeSeconds);
        };
        CubismMotionManager.prototype.updateMotion = function (model, deltaTimeSeconds) {
            this._userTimeSeconds += deltaTimeSeconds;
            var updated = _super.prototype.doUpdateMotion.call(this, model, this._userTimeSeconds);
            if (this.isFinished()) {
                this._currentPriority = 0;
            }
            return updated;
        };
        CubismMotionManager.prototype.reserveMotion = function (priority) {
            if (priority <= this._reservePriority ||
                priority <= this._currentPriority) {
                return false;
            }
            this._reservePriority = priority;
            return true;
        };
        return CubismMotionManager;
    }(CubismMotionQueueManager));
    Live2DCubismFramework.CubismMotionManager = CubismMotionManager;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmotionmanager.js.map