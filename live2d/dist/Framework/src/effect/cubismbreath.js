"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var CubismBreath = (function () {
        function CubismBreath() {
            this._currentTime = 0.0;
        }
        CubismBreath.create = function () {
            return new CubismBreath();
        };
        CubismBreath.delete = function (instance) {
            if (instance != null) {
                instance = null;
            }
        };
        CubismBreath.prototype.setParameters = function (breathParameters) {
            this._breathParameters = breathParameters;
        };
        CubismBreath.prototype.getParameters = function () {
            return this._breathParameters;
        };
        CubismBreath.prototype.updateParameters = function (model, deltaTimeSeconds) {
            this._currentTime += deltaTimeSeconds;
            var t = this._currentTime * 2.0 * 3.14159;
            for (var i = 0; i < this._breathParameters.getSize(); ++i) {
                var data = this._breathParameters.at(i);
                model.addParameterValueById(data.parameterId, data.offset + data.peak * Math.sin(t / data.cycle), data.weight);
            }
        };
        return CubismBreath;
    }());
    Live2DCubismFramework.CubismBreath = CubismBreath;
    var BreathParameterData = (function () {
        function BreathParameterData(parameterId, offset, peak, cycle, weight) {
            this.parameterId = parameterId == undefined ? null : parameterId;
            this.offset = offset == undefined ? 0.0 : offset;
            this.peak = peak == undefined ? 0.0 : peak;
            this.cycle = cycle == undefined ? 0.0 : cycle;
            this.weight = weight == undefined ? 0.0 : weight;
        }
        return BreathParameterData;
    }());
    Live2DCubismFramework.BreathParameterData = BreathParameterData;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismbreath.js.map