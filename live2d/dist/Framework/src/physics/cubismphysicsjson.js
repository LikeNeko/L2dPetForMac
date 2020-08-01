"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var cubismjson_1 = require("../utils/cubismjson");
var cubismvector2_1 = require("../math/cubismvector2");
var live2dcubismframework_1 = require("../live2dcubismframework");
var CubismFramework = live2dcubismframework_1.Live2DCubismFramework.CubismFramework;
var CubismVector2 = cubismvector2_1.Live2DCubismFramework.CubismVector2;
var CubismJson = cubismjson_1.Live2DCubismFramework.CubismJson;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var Position = 'Position';
    var X = 'X';
    var Y = 'Y';
    var Angle = 'Angle';
    var Type = 'Type';
    var Id = 'Id';
    var Meta = 'Meta';
    var EffectiveForces = 'EffectiveForces';
    var TotalInputCount = 'TotalInputCount';
    var TotalOutputCount = 'TotalOutputCount';
    var PhysicsSettingCount = 'PhysicsSettingCount';
    var Gravity = 'Gravity';
    var Wind = 'Wind';
    var VertexCount = 'VertexCount';
    var PhysicsSettings = 'PhysicsSettings';
    var Normalization = 'Normalization';
    var Minimum = 'Minimum';
    var Maximum = 'Maximum';
    var Default = 'Default';
    var Reflect = 'Reflect';
    var Weight = 'Weight';
    var Input = 'Input';
    var Source = 'Source';
    var Output = 'Output';
    var Scale = 'Scale';
    var VertexIndex = 'VertexIndex';
    var Destination = 'Destination';
    var Vertices = 'Vertices';
    var Mobility = 'Mobility';
    var Delay = 'Delay';
    var Radius = 'Radius';
    var Acceleration = 'Acceleration';
    var CubismPhysicsJson = (function () {
        function CubismPhysicsJson(buffer, size) {
            this._json = CubismJson.create(buffer, size);
        }
        CubismPhysicsJson.prototype.release = function () {
            CubismJson.delete(this._json);
        };
        CubismPhysicsJson.prototype.getGravity = function () {
            var ret = new CubismVector2(0, 0);
            ret.x = this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(EffectiveForces)
                .getValueByString(Gravity)
                .getValueByString(X)
                .toFloat();
            ret.y = this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(EffectiveForces)
                .getValueByString(Gravity)
                .getValueByString(Y)
                .toFloat();
            return ret;
        };
        CubismPhysicsJson.prototype.getWind = function () {
            var ret = new CubismVector2(0, 0);
            ret.x = this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(EffectiveForces)
                .getValueByString(Wind)
                .getValueByString(X)
                .toFloat();
            ret.y = this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(EffectiveForces)
                .getValueByString(Wind)
                .getValueByString(Y)
                .toFloat();
            return ret;
        };
        CubismPhysicsJson.prototype.getSubRigCount = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(PhysicsSettingCount)
                .toInt();
        };
        CubismPhysicsJson.prototype.getTotalInputCount = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(TotalInputCount)
                .toInt();
        };
        CubismPhysicsJson.prototype.getTotalOutputCount = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(TotalOutputCount)
                .toInt();
        };
        CubismPhysicsJson.prototype.getVertexCount = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(VertexCount)
                .toInt();
        };
        CubismPhysicsJson.prototype.getNormalizationPositionMinimumValue = function (physicsSettingIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Normalization)
                .getValueByString(Position)
                .getValueByString(Minimum)
                .toFloat();
        };
        CubismPhysicsJson.prototype.getNormalizationPositionMaximumValue = function (physicsSettingIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Normalization)
                .getValueByString(Position)
                .getValueByString(Maximum)
                .toFloat();
        };
        CubismPhysicsJson.prototype.getNormalizationPositionDefaultValue = function (physicsSettingIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Normalization)
                .getValueByString(Position)
                .getValueByString(Default)
                .toFloat();
        };
        CubismPhysicsJson.prototype.getNormalizationAngleMinimumValue = function (physicsSettingIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Normalization)
                .getValueByString(Angle)
                .getValueByString(Minimum)
                .toFloat();
        };
        CubismPhysicsJson.prototype.getNormalizationAngleMaximumValue = function (physicsSettingIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Normalization)
                .getValueByString(Angle)
                .getValueByString(Maximum)
                .toFloat();
        };
        CubismPhysicsJson.prototype.getNormalizationAngleDefaultValue = function (physicsSettingIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Normalization)
                .getValueByString(Angle)
                .getValueByString(Default)
                .toFloat();
        };
        CubismPhysicsJson.prototype.getInputCount = function (physicsSettingIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Input)
                .getVector()
                .getSize();
        };
        CubismPhysicsJson.prototype.getInputWeight = function (physicsSettingIndex, inputIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Input)
                .getValueByIndex(inputIndex)
                .getValueByString(Weight)
                .toFloat();
        };
        CubismPhysicsJson.prototype.getInputReflect = function (physicsSettingIndex, inputIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Input)
                .getValueByIndex(inputIndex)
                .getValueByString(Reflect)
                .toBoolean();
        };
        CubismPhysicsJson.prototype.getInputType = function (physicsSettingIndex, inputIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Input)
                .getValueByIndex(inputIndex)
                .getValueByString(Type)
                .getRawString();
        };
        CubismPhysicsJson.prototype.getInputSourceId = function (physicsSettingIndex, inputIndex) {
            return CubismFramework.getIdManager().getId(this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Input)
                .getValueByIndex(inputIndex)
                .getValueByString(Source)
                .getValueByString(Id)
                .getRawString());
        };
        CubismPhysicsJson.prototype.getOutputCount = function (physicsSettingIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Output)
                .getVector()
                .getSize();
        };
        CubismPhysicsJson.prototype.getOutputVertexIndex = function (physicsSettingIndex, outputIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Output)
                .getValueByIndex(outputIndex)
                .getValueByString(VertexIndex)
                .toInt();
        };
        CubismPhysicsJson.prototype.getOutputAngleScale = function (physicsSettingIndex, outputIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Output)
                .getValueByIndex(outputIndex)
                .getValueByString(Scale)
                .toFloat();
        };
        CubismPhysicsJson.prototype.getOutputWeight = function (physicsSettingIndex, outputIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Output)
                .getValueByIndex(outputIndex)
                .getValueByString(Weight)
                .toFloat();
        };
        CubismPhysicsJson.prototype.getOutputDestinationId = function (physicsSettingIndex, outputIndex) {
            return CubismFramework.getIdManager().getId(this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Output)
                .getValueByIndex(outputIndex)
                .getValueByString(Destination)
                .getValueByString(Id)
                .getRawString());
        };
        CubismPhysicsJson.prototype.getOutputType = function (physicsSettingIndex, outputIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Output)
                .getValueByIndex(outputIndex)
                .getValueByString(Type)
                .getRawString();
        };
        CubismPhysicsJson.prototype.getOutputReflect = function (physicsSettingIndex, outputIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Output)
                .getValueByIndex(outputIndex)
                .getValueByString(Reflect)
                .toBoolean();
        };
        CubismPhysicsJson.prototype.getParticleCount = function (physicsSettingIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Vertices)
                .getVector()
                .getSize();
        };
        CubismPhysicsJson.prototype.getParticleMobility = function (physicsSettingIndex, vertexIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Vertices)
                .getValueByIndex(vertexIndex)
                .getValueByString(Mobility)
                .toFloat();
        };
        CubismPhysicsJson.prototype.getParticleDelay = function (physicsSettingIndex, vertexIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Vertices)
                .getValueByIndex(vertexIndex)
                .getValueByString(Delay)
                .toFloat();
        };
        CubismPhysicsJson.prototype.getParticleAcceleration = function (physicsSettingIndex, vertexIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Vertices)
                .getValueByIndex(vertexIndex)
                .getValueByString(Acceleration)
                .toFloat();
        };
        CubismPhysicsJson.prototype.getParticleRadius = function (physicsSettingIndex, vertexIndex) {
            return this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Vertices)
                .getValueByIndex(vertexIndex)
                .getValueByString(Radius)
                .toInt();
        };
        CubismPhysicsJson.prototype.getParticlePosition = function (physicsSettingIndex, vertexIndex) {
            var ret = new CubismVector2(0, 0);
            ret.x = this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Vertices)
                .getValueByIndex(vertexIndex)
                .getValueByString(Position)
                .getValueByString(X)
                .toFloat();
            ret.y = this._json
                .getRoot()
                .getValueByString(PhysicsSettings)
                .getValueByIndex(physicsSettingIndex)
                .getValueByString(Vertices)
                .getValueByIndex(vertexIndex)
                .getValueByString(Position)
                .getValueByString(Y)
                .toFloat();
            return ret;
        };
        return CubismPhysicsJson;
    }());
    Live2DCubismFramework.CubismPhysicsJson = CubismPhysicsJson;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismphysicsjson.js.map