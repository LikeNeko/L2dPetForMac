"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var csmvector_1 = require("../type/csmvector");
var csmVector = csmvector_1.Live2DCubismFramework.csmVector;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var CubismEyeBlink = (function () {
        function CubismEyeBlink(modelSetting) {
            this._blinkingState = EyeState.EyeState_First;
            this._nextBlinkingTime = 0.0;
            this._stateStartTimeSeconds = 0.0;
            this._blinkingIntervalSeconds = 4.0;
            this._closingSeconds = 0.1;
            this._closedSeconds = 0.05;
            this._openingSeconds = 0.15;
            this._userTimeSeconds = 0.0;
            this._parameterIds = new csmVector();
            if (modelSetting == null) {
                return;
            }
            for (var i = 0; i < modelSetting.getEyeBlinkParameterCount(); ++i) {
                this._parameterIds.pushBack(modelSetting.getEyeBlinkParameterId(i));
            }
        }
        CubismEyeBlink.create = function (modelSetting) {
            if (modelSetting === void 0) { modelSetting = null; }
            return new CubismEyeBlink(modelSetting);
        };
        CubismEyeBlink.delete = function (eyeBlink) {
            if (eyeBlink != null) {
                eyeBlink = null;
            }
        };
        CubismEyeBlink.prototype.setBlinkingInterval = function (blinkingInterval) {
            this._blinkingIntervalSeconds = blinkingInterval;
        };
        CubismEyeBlink.prototype.setBlinkingSetting = function (closing, closed, opening) {
            this._closingSeconds = closing;
            this._closedSeconds = closed;
            this._openingSeconds = opening;
        };
        CubismEyeBlink.prototype.setParameterIds = function (parameterIds) {
            this._parameterIds = parameterIds;
        };
        CubismEyeBlink.prototype.getParameterIds = function () {
            return this._parameterIds;
        };
        CubismEyeBlink.prototype.updateParameters = function (model, deltaTimeSeconds) {
            this._userTimeSeconds += deltaTimeSeconds;
            var parameterValue;
            var t = 0.0;
            switch (this._blinkingState) {
                case EyeState.EyeState_Closing:
                    t =
                        (this._userTimeSeconds - this._stateStartTimeSeconds) /
                            this._closingSeconds;
                    if (t >= 1.0) {
                        t = 1.0;
                        this._blinkingState = EyeState.EyeState_Closed;
                        this._stateStartTimeSeconds = this._userTimeSeconds;
                    }
                    parameterValue = 1.0 - t;
                    break;
                case EyeState.EyeState_Closed:
                    t =
                        (this._userTimeSeconds - this._stateStartTimeSeconds) /
                            this._closedSeconds;
                    if (t >= 1.0) {
                        this._blinkingState = EyeState.EyeState_Opening;
                        this._stateStartTimeSeconds = this._userTimeSeconds;
                    }
                    parameterValue = 0.0;
                    break;
                case EyeState.EyeState_Opening:
                    t =
                        (this._userTimeSeconds - this._stateStartTimeSeconds) /
                            this._openingSeconds;
                    if (t >= 1.0) {
                        t = 1.0;
                        this._blinkingState = EyeState.EyeState_Interval;
                        this._nextBlinkingTime = this.determinNextBlinkingTiming();
                    }
                    parameterValue = t;
                    break;
                case EyeState.EyeState_Interval:
                    if (this._nextBlinkingTime < this._userTimeSeconds) {
                        this._blinkingState = EyeState.EyeState_Closing;
                        this._stateStartTimeSeconds = this._userTimeSeconds;
                    }
                    parameterValue = 1.0;
                    break;
                case EyeState.EyeState_First:
                default:
                    this._blinkingState = EyeState.EyeState_Interval;
                    this._nextBlinkingTime = this.determinNextBlinkingTiming();
                    parameterValue = 1.0;
                    break;
            }
            if (!CubismEyeBlink.CloseIfZero) {
                parameterValue = -parameterValue;
            }
            for (var i = 0; i < this._parameterIds.getSize(); ++i) {
                model.setParameterValueById(this._parameterIds.at(i), parameterValue);
            }
        };
        CubismEyeBlink.prototype.determinNextBlinkingTiming = function () {
            var r = Math.random();
            return (this._userTimeSeconds + r * (2.0 * this._blinkingIntervalSeconds - 1.0));
        };
        CubismEyeBlink.CloseIfZero = true;
        return CubismEyeBlink;
    }());
    Live2DCubismFramework.CubismEyeBlink = CubismEyeBlink;
    var EyeState;
    (function (EyeState) {
        EyeState[EyeState["EyeState_First"] = 0] = "EyeState_First";
        EyeState[EyeState["EyeState_Interval"] = 1] = "EyeState_Interval";
        EyeState[EyeState["EyeState_Closing"] = 2] = "EyeState_Closing";
        EyeState[EyeState["EyeState_Closed"] = 3] = "EyeState_Closed";
        EyeState[EyeState["EyeState_Opening"] = 4] = "EyeState_Opening";
    })(EyeState = Live2DCubismFramework.EyeState || (Live2DCubismFramework.EyeState = {}));
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismeyeblink.js.map