"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var cubismjson_1 = require("../utils/cubismjson");
var live2dcubismframework_1 = require("../live2dcubismframework");
var csmstring_1 = require("../type/csmstring");
var csmString = csmstring_1.Live2DCubismFramework.csmString;
var CubismFramework = live2dcubismframework_1.Live2DCubismFramework.CubismFramework;
var CubismJson = cubismjson_1.Live2DCubismFramework.CubismJson;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var Meta = 'Meta';
    var Duration = 'Duration';
    var Loop = 'Loop';
    var CurveCount = 'CurveCount';
    var Fps = 'Fps';
    var TotalSegmentCount = 'TotalSegmentCount';
    var TotalPointCount = 'TotalPointCount';
    var Curves = 'Curves';
    var Target = 'Target';
    var Id = 'Id';
    var FadeInTime = 'FadeInTime';
    var FadeOutTime = 'FadeOutTime';
    var Segments = 'Segments';
    var UserData = 'UserData';
    var UserDataCount = 'UserDataCount';
    var TotalUserDataSize = 'TotalUserDataSize';
    var Time = 'Time';
    var Value = 'Value';
    var CubismMotionJson = (function () {
        function CubismMotionJson(buffer, size) {
            this._json = CubismJson.create(buffer, size);
        }
        CubismMotionJson.prototype.release = function () {
            CubismJson.delete(this._json);
        };
        CubismMotionJson.prototype.getMotionDuration = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(Duration)
                .toFloat();
        };
        CubismMotionJson.prototype.isMotionLoop = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(Loop)
                .toBoolean();
        };
        CubismMotionJson.prototype.getMotionCurveCount = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(CurveCount)
                .toInt();
        };
        CubismMotionJson.prototype.getMotionFps = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(Fps)
                .toFloat();
        };
        CubismMotionJson.prototype.getMotionTotalSegmentCount = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(TotalSegmentCount)
                .toInt();
        };
        CubismMotionJson.prototype.getMotionTotalPointCount = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(TotalPointCount)
                .toInt();
        };
        CubismMotionJson.prototype.isExistMotionFadeInTime = function () {
            return !this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(FadeInTime)
                .isNull();
        };
        CubismMotionJson.prototype.isExistMotionFadeOutTime = function () {
            return !this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(FadeOutTime)
                .isNull();
        };
        CubismMotionJson.prototype.getMotionFadeInTime = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(FadeInTime)
                .toFloat();
        };
        CubismMotionJson.prototype.getMotionFadeOutTime = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(FadeOutTime)
                .toFloat();
        };
        CubismMotionJson.prototype.getMotionCurveTarget = function (curveIndex) {
            return this._json
                .getRoot()
                .getValueByString(Curves)
                .getValueByIndex(curveIndex)
                .getValueByString(Target)
                .getRawString();
        };
        CubismMotionJson.prototype.getMotionCurveId = function (curveIndex) {
            return CubismFramework.getIdManager().getId(this._json
                .getRoot()
                .getValueByString(Curves)
                .getValueByIndex(curveIndex)
                .getValueByString(Id)
                .getRawString());
        };
        CubismMotionJson.prototype.isExistMotionCurveFadeInTime = function (curveIndex) {
            return !this._json
                .getRoot()
                .getValueByString(Curves)
                .getValueByIndex(curveIndex)
                .getValueByString(FadeInTime)
                .isNull();
        };
        CubismMotionJson.prototype.isExistMotionCurveFadeOutTime = function (curveIndex) {
            return !this._json
                .getRoot()
                .getValueByString(Curves)
                .getValueByIndex(curveIndex)
                .getValueByString(FadeOutTime)
                .isNull();
        };
        CubismMotionJson.prototype.getMotionCurveFadeInTime = function (curveIndex) {
            return this._json
                .getRoot()
                .getValueByString(Curves)
                .getValueByIndex(curveIndex)
                .getValueByString(FadeInTime)
                .toFloat();
        };
        CubismMotionJson.prototype.getMotionCurveFadeOutTime = function (curveIndex) {
            return this._json
                .getRoot()
                .getValueByString(Curves)
                .getValueByIndex(curveIndex)
                .getValueByString(FadeOutTime)
                .toFloat();
        };
        CubismMotionJson.prototype.getMotionCurveSegmentCount = function (curveIndex) {
            return this._json
                .getRoot()
                .getValueByString(Curves)
                .getValueByIndex(curveIndex)
                .getValueByString(Segments)
                .getVector()
                .getSize();
        };
        CubismMotionJson.prototype.getMotionCurveSegment = function (curveIndex, segmentIndex) {
            return this._json
                .getRoot()
                .getValueByString(Curves)
                .getValueByIndex(curveIndex)
                .getValueByString(Segments)
                .getValueByIndex(segmentIndex)
                .toFloat();
        };
        CubismMotionJson.prototype.getEventCount = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(UserDataCount)
                .toInt();
        };
        CubismMotionJson.prototype.getTotalEventValueSize = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(TotalUserDataSize)
                .toInt();
        };
        CubismMotionJson.prototype.getEventTime = function (userDataIndex) {
            return this._json
                .getRoot()
                .getValueByString(UserData)
                .getValueByIndex(userDataIndex)
                .getValueByString(Time)
                .toInt();
        };
        CubismMotionJson.prototype.getEventValue = function (userDataIndex) {
            return new csmString(this._json
                .getRoot()
                .getValueByString(UserData)
                .getValueByIndex(userDataIndex)
                .getValueByString(Value)
                .getRawString());
        };
        return CubismMotionJson;
    }());
    Live2DCubismFramework.CubismMotionJson = CubismMotionJson;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmotionjson.js.map