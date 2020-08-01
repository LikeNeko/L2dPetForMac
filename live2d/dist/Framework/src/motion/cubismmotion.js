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
var cubismmotionjson_1 = require("./cubismmotionjson");
var cubismmotioninternal_1 = require("./cubismmotioninternal");
var acubismmotion_1 = require("./acubismmotion");
var live2dcubismframework_1 = require("../live2dcubismframework");
var cubismmath_1 = require("../math/cubismmath");
var csmstring_1 = require("../type/csmstring");
var cubismdebug_1 = require("../utils/cubismdebug");
var csmString = csmstring_1.Live2DCubismFramework.csmString;
var CubismMotionData = cubismmotioninternal_1.Live2DCubismFramework.CubismMotionData;
var CubismMotionSegment = cubismmotioninternal_1.Live2DCubismFramework.CubismMotionSegment;
var CubismMotionPoint = cubismmotioninternal_1.Live2DCubismFramework.CubismMotionPoint;
var CubismMotionEvent = cubismmotioninternal_1.Live2DCubismFramework.CubismMotionEvent;
var CubismMotionSegmentType = cubismmotioninternal_1.Live2DCubismFramework.CubismMotionSegmentType;
var CubismMotionCurve = cubismmotioninternal_1.Live2DCubismFramework.CubismMotionCurve;
var CubismMotionCurveTarget = cubismmotioninternal_1.Live2DCubismFramework.CubismMotionCurveTarget;
var CubismMath = cubismmath_1.Live2DCubismFramework.CubismMath;
var CubismFramework = live2dcubismframework_1.Live2DCubismFramework.CubismFramework;
var ACubismMotion = acubismmotion_1.Live2DCubismFramework.ACubismMotion;
var CubismMotionJson = cubismmotionjson_1.Live2DCubismFramework.CubismMotionJson;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var EffectNameEyeBlink = 'EyeBlink';
    var EffectNameLipSync = 'LipSync';
    var TargetNameModel = 'Model';
    var TargetNameParameter = 'Parameter';
    var TargetNamePartOpacity = 'PartOpacity';
    function lerpPoints(a, b, t) {
        var result = new CubismMotionPoint();
        result.time = a.time + (b.time - a.time) * t;
        result.value = a.value + (b.value - a.value) * t;
        return result;
    }
    function linearEvaluate(points, time) {
        var t = (time - points[0].time) / (points[1].time - points[0].time);
        if (t < 0.0) {
            t = 0.0;
        }
        return points[0].value + (points[1].value - points[0].value) * t;
    }
    function bezierEvaluate(points, time) {
        var t = (time - points[0].time) / (points[3].time - points[0].time);
        if (t < 0.0) {
            t = 0.0;
        }
        var p01 = lerpPoints(points[0], points[1], t);
        var p12 = lerpPoints(points[1], points[2], t);
        var p23 = lerpPoints(points[2], points[3], t);
        var p012 = lerpPoints(p01, p12, t);
        var p123 = lerpPoints(p12, p23, t);
        return lerpPoints(p012, p123, t).value;
    }
    function steppedEvaluate(points, time) {
        return points[0].value;
    }
    function inverseSteppedEvaluate(points, time) {
        return points[1].value;
    }
    function evaluateCurve(motionData, index, time) {
        var curve = motionData.curves.at(index);
        var target = -1;
        var totalSegmentCount = curve.baseSegmentIndex + curve.segmentCount;
        var pointPosition = 0;
        for (var i = curve.baseSegmentIndex; i < totalSegmentCount; ++i) {
            pointPosition =
                motionData.segments.at(i).basePointIndex +
                    (motionData.segments.at(i).segmentType ==
                        CubismMotionSegmentType.CubismMotionSegmentType_Bezier
                        ? 3
                        : 1);
            if (motionData.points.at(pointPosition).time > time) {
                target = i;
                break;
            }
        }
        if (target == -1) {
            return motionData.points.at(pointPosition).value;
        }
        var segment = motionData.segments.at(target);
        return segment.evaluate(motionData.points.get(segment.basePointIndex), time);
    }
    var CubismMotion = (function (_super) {
        __extends(CubismMotion, _super);
        function CubismMotion() {
            var _this = _super.call(this) || this;
            _this._sourceFrameRate = 30.0;
            _this._loopDurationSeconds = -1.0;
            _this._isLoop = false;
            _this._isLoopFadeIn = true;
            _this._lastWeight = 0.0;
            _this._motionData = null;
            _this._modelCurveIdEyeBlink = null;
            _this._modelCurveIdLipSync = null;
            _this._eyeBlinkParameterIds = null;
            _this._lipSyncParameterIds = null;
            return _this;
        }
        CubismMotion.create = function (buffer, size, onFinishedMotionHandler) {
            var ret = new CubismMotion();
            ret.parse(buffer, size);
            ret._sourceFrameRate = ret._motionData.fps;
            ret._loopDurationSeconds = ret._motionData.duration;
            ret._onFinishedMotion = onFinishedMotionHandler;
            return ret;
        };
        CubismMotion.prototype.doUpdateParameters = function (model, userTimeSeconds, fadeWeight, motionQueueEntry) {
            if (this._modelCurveIdEyeBlink == null) {
                this._modelCurveIdEyeBlink = CubismFramework.getIdManager().getId(EffectNameEyeBlink);
            }
            if (this._modelCurveIdLipSync == null) {
                this._modelCurveIdLipSync = CubismFramework.getIdManager().getId(EffectNameLipSync);
            }
            var timeOffsetSeconds = userTimeSeconds - motionQueueEntry.getStartTime();
            if (timeOffsetSeconds < 0.0) {
                timeOffsetSeconds = 0.0;
            }
            var lipSyncValue = Number.MAX_VALUE;
            var eyeBlinkValue = Number.MAX_VALUE;
            var MaxTargetSize = 64;
            var lipSyncFlags = 0;
            var eyeBlinkFlags = 0;
            if (this._eyeBlinkParameterIds.getSize() > MaxTargetSize) {
                cubismdebug_1.CubismLogDebug('too many eye blink targets : {0}', this._eyeBlinkParameterIds.getSize());
            }
            if (this._lipSyncParameterIds.getSize() > MaxTargetSize) {
                cubismdebug_1.CubismLogDebug('too many lip sync targets : {0}', this._lipSyncParameterIds.getSize());
            }
            var tmpFadeIn = this._fadeInSeconds <= 0.0
                ? 1.0
                : CubismMath.getEasingSine((userTimeSeconds - motionQueueEntry.getFadeInStartTime()) /
                    this._fadeInSeconds);
            var tmpFadeOut = this._fadeOutSeconds <= 0.0 || motionQueueEntry.getEndTime() < 0.0
                ? 1.0
                : CubismMath.getEasingSine((motionQueueEntry.getEndTime() - userTimeSeconds) /
                    this._fadeOutSeconds);
            var value;
            var c, parameterIndex;
            var time = timeOffsetSeconds;
            if (this._isLoop) {
                while (time > this._motionData.duration) {
                    time -= this._motionData.duration;
                }
            }
            var curves = this._motionData.curves;
            for (c = 0; c < this._motionData.curveCount &&
                curves.at(c).type ==
                    CubismMotionCurveTarget.CubismMotionCurveTarget_Model; ++c) {
                value = evaluateCurve(this._motionData, c, time);
                if (curves.at(c).id == this._modelCurveIdEyeBlink) {
                    eyeBlinkValue = value;
                }
                else if (curves.at(c).id == this._modelCurveIdLipSync) {
                    lipSyncValue = value;
                }
            }
            var parameterMotionCurveCount = 0;
            for (; c < this._motionData.curveCount &&
                curves.at(c).type ==
                    CubismMotionCurveTarget.CubismMotionCurveTarget_Parameter; ++c) {
                parameterMotionCurveCount++;
                parameterIndex = model.getParameterIndex(curves.at(c).id);
                if (parameterIndex == -1) {
                    continue;
                }
                var sourceValue = model.getParameterValueByIndex(parameterIndex);
                value = evaluateCurve(this._motionData, c, time);
                if (eyeBlinkValue != Number.MAX_VALUE) {
                    for (var i = 0; i < this._eyeBlinkParameterIds.getSize() && i < MaxTargetSize; ++i) {
                        if (this._eyeBlinkParameterIds.at(i) == curves.at(c).id) {
                            value *= eyeBlinkValue;
                            eyeBlinkFlags |= 1 << i;
                            break;
                        }
                    }
                }
                if (lipSyncValue != Number.MAX_VALUE) {
                    for (var i = 0; i < this._lipSyncParameterIds.getSize() && i < MaxTargetSize; ++i) {
                        if (this._lipSyncParameterIds.at(i) == curves.at(c).id) {
                            value += lipSyncValue;
                            lipSyncFlags |= 1 << i;
                            break;
                        }
                    }
                }
                var v = void 0;
                if (curves.at(c).fadeInTime < 0.0 && curves.at(c).fadeOutTime < 0.0) {
                    v = sourceValue + (value - sourceValue) * fadeWeight;
                }
                else {
                    var fin = void 0;
                    var fout = void 0;
                    if (curves.at(c).fadeInTime < 0.0) {
                        fin = tmpFadeIn;
                    }
                    else {
                        fin =
                            curves.at(c).fadeInTime == 0.0
                                ? 1.0
                                : CubismMath.getEasingSine((userTimeSeconds - motionQueueEntry.getFadeInStartTime()) /
                                    curves.at(c).fadeInTime);
                    }
                    if (curves.at(c).fadeOutTime < 0.0) {
                        fout = tmpFadeOut;
                    }
                    else {
                        fout =
                            curves.at(c).fadeOutTime == 0.0 ||
                                motionQueueEntry.getEndTime() < 0.0
                                ? 1.0
                                : CubismMath.getEasingSine((motionQueueEntry.getEndTime() - userTimeSeconds) /
                                    curves.at(c).fadeOutTime);
                    }
                    var paramWeight = this._weight * fin * fout;
                    v = sourceValue + (value - sourceValue) * paramWeight;
                }
                model.setParameterValueByIndex(parameterIndex, v, 1.0);
            }
            {
                if (eyeBlinkValue != Number.MAX_VALUE) {
                    for (var i = 0; i < this._eyeBlinkParameterIds.getSize() && i < MaxTargetSize; ++i) {
                        var sourceValue = model.getParameterValueById(this._eyeBlinkParameterIds.at(i));
                        if ((eyeBlinkFlags >> i) & 0x01) {
                            continue;
                        }
                        var v = sourceValue + (eyeBlinkValue - sourceValue) * fadeWeight;
                        model.setParameterValueById(this._eyeBlinkParameterIds.at(i), v);
                    }
                }
                if (lipSyncValue != Number.MAX_VALUE) {
                    for (var i = 0; i < this._lipSyncParameterIds.getSize() && i < MaxTargetSize; ++i) {
                        var sourceValue = model.getParameterValueById(this._lipSyncParameterIds.at(i));
                        if ((lipSyncFlags >> i) & 0x01) {
                            continue;
                        }
                        var v = sourceValue + (lipSyncValue - sourceValue) * fadeWeight;
                        model.setParameterValueById(this._lipSyncParameterIds.at(i), v);
                    }
                }
            }
            for (; c < this._motionData.curveCount &&
                curves.at(c).type ==
                    CubismMotionCurveTarget.CubismMotionCurveTarget_PartOpacity; ++c) {
                parameterIndex = model.getParameterIndex(curves.at(c).id);
                if (parameterIndex == -1) {
                    continue;
                }
                value = evaluateCurve(this._motionData, c, time);
                model.setParameterValueByIndex(parameterIndex, value);
            }
            if (timeOffsetSeconds >= this._motionData.duration) {
                if (this._isLoop) {
                    motionQueueEntry.setStartTime(userTimeSeconds);
                    if (this._isLoopFadeIn) {
                        motionQueueEntry.setFadeInStartTime(userTimeSeconds);
                    }
                }
                else {
                    if (this._onFinishedMotion) {
                        this._onFinishedMotion(this);
                    }
                    motionQueueEntry.setIsFinished(true);
                }
            }
            this._lastWeight = fadeWeight;
        };
        CubismMotion.prototype.setIsLoop = function (loop) {
            this._isLoop = loop;
        };
        CubismMotion.prototype.isLoop = function () {
            return this._isLoop;
        };
        CubismMotion.prototype.setIsLoopFadeIn = function (loopFadeIn) {
            this._isLoopFadeIn = loopFadeIn;
        };
        CubismMotion.prototype.isLoopFadeIn = function () {
            return this._isLoopFadeIn;
        };
        CubismMotion.prototype.getDuration = function () {
            return this._isLoop ? -1.0 : this._loopDurationSeconds;
        };
        CubismMotion.prototype.getLoopDuration = function () {
            return this._loopDurationSeconds;
        };
        CubismMotion.prototype.setParameterFadeInTime = function (parameterId, value) {
            var curves = this._motionData.curves;
            for (var i = 0; i < this._motionData.curveCount; ++i) {
                if (parameterId == curves.at(i).id) {
                    curves.at(i).fadeInTime = value;
                    return;
                }
            }
        };
        CubismMotion.prototype.setParameterFadeOutTime = function (parameterId, value) {
            var curves = this._motionData.curves;
            for (var i = 0; i < this._motionData.curveCount; ++i) {
                if (parameterId == curves.at(i).id) {
                    curves.at(i).fadeOutTime = value;
                    return;
                }
            }
        };
        CubismMotion.prototype.getParameterFadeInTime = function (parameterId) {
            var curves = this._motionData.curves;
            for (var i = 0; i < this._motionData.curveCount; ++i) {
                if (parameterId == curves.at(i).id) {
                    return curves.at(i).fadeInTime;
                }
            }
            return -1;
        };
        CubismMotion.prototype.getParameterFadeOutTime = function (parameterId) {
            var curves = this._motionData.curves;
            for (var i = 0; i < this._motionData.curveCount; ++i) {
                if (parameterId == curves.at(i).id) {
                    return curves.at(i).fadeOutTime;
                }
            }
            return -1;
        };
        CubismMotion.prototype.setEffectIds = function (eyeBlinkParameterIds, lipSyncParameterIds) {
            this._eyeBlinkParameterIds = eyeBlinkParameterIds;
            this._lipSyncParameterIds = lipSyncParameterIds;
        };
        CubismMotion.prototype.release = function () {
            this._motionData = void 0;
            this._motionData = null;
        };
        CubismMotion.prototype.parse = function (motionJson, size) {
            this._motionData = new CubismMotionData();
            var json = new CubismMotionJson(motionJson, size);
            this._motionData.duration = json.getMotionDuration();
            this._motionData.loop = json.isMotionLoop();
            this._motionData.curveCount = json.getMotionCurveCount();
            this._motionData.fps = json.getMotionFps();
            this._motionData.eventCount = json.getEventCount();
            if (json.isExistMotionFadeInTime()) {
                this._fadeInSeconds =
                    json.getMotionFadeInTime() < 0.0 ? 1.0 : json.getMotionFadeInTime();
            }
            else {
                this._fadeInSeconds = 1.0;
            }
            if (json.isExistMotionFadeOutTime()) {
                this._fadeOutSeconds =
                    json.getMotionFadeOutTime() < 0.0 ? 1.0 : json.getMotionFadeOutTime();
            }
            else {
                this._fadeOutSeconds = 1.0;
            }
            this._motionData.curves.updateSize(this._motionData.curveCount, CubismMotionCurve, true);
            this._motionData.segments.updateSize(json.getMotionTotalSegmentCount(), CubismMotionSegment, true);
            this._motionData.points.updateSize(json.getMotionTotalPointCount(), CubismMotionPoint, true);
            this._motionData.events.updateSize(this._motionData.eventCount, CubismMotionEvent, true);
            var totalPointCount = 0;
            var totalSegmentCount = 0;
            for (var curveCount = 0; curveCount < this._motionData.curveCount; ++curveCount) {
                if (json.getMotionCurveTarget(curveCount) == TargetNameModel) {
                    this._motionData.curves.at(curveCount).type =
                        CubismMotionCurveTarget.CubismMotionCurveTarget_Model;
                }
                else if (json.getMotionCurveTarget(curveCount) == TargetNameParameter) {
                    this._motionData.curves.at(curveCount).type =
                        CubismMotionCurveTarget.CubismMotionCurveTarget_Parameter;
                }
                else if (json.getMotionCurveTarget(curveCount) == TargetNamePartOpacity) {
                    this._motionData.curves.at(curveCount).type =
                        CubismMotionCurveTarget.CubismMotionCurveTarget_PartOpacity;
                }
                this._motionData.curves.at(curveCount).id = json.getMotionCurveId(curveCount);
                this._motionData.curves.at(curveCount).baseSegmentIndex = totalSegmentCount;
                this._motionData.curves.at(curveCount).fadeInTime = json.isExistMotionCurveFadeInTime(curveCount)
                    ? json.getMotionCurveFadeInTime(curveCount)
                    : -1.0;
                this._motionData.curves.at(curveCount).fadeOutTime = json.isExistMotionCurveFadeOutTime(curveCount)
                    ? json.getMotionCurveFadeOutTime(curveCount)
                    : -1.0;
                for (var segmentPosition = 0; segmentPosition < json.getMotionCurveSegmentCount(curveCount);) {
                    if (segmentPosition == 0) {
                        this._motionData.segments.at(totalSegmentCount).basePointIndex = totalPointCount;
                        this._motionData.points.at(totalPointCount).time = json.getMotionCurveSegment(curveCount, segmentPosition);
                        this._motionData.points.at(totalPointCount).value = json.getMotionCurveSegment(curveCount, segmentPosition + 1);
                        totalPointCount += 1;
                        segmentPosition += 2;
                    }
                    else {
                        this._motionData.segments.at(totalSegmentCount).basePointIndex =
                            totalPointCount - 1;
                    }
                    var segment = json.getMotionCurveSegment(curveCount, segmentPosition);
                    switch (segment) {
                        case CubismMotionSegmentType.CubismMotionSegmentType_Linear: {
                            this._motionData.segments.at(totalSegmentCount).segmentType =
                                CubismMotionSegmentType.CubismMotionSegmentType_Linear;
                            this._motionData.segments.at(totalSegmentCount).evaluate = linearEvaluate;
                            this._motionData.points.at(totalPointCount).time = json.getMotionCurveSegment(curveCount, segmentPosition + 1);
                            this._motionData.points.at(totalPointCount).value = json.getMotionCurveSegment(curveCount, segmentPosition + 2);
                            totalPointCount += 1;
                            segmentPosition += 3;
                            break;
                        }
                        case CubismMotionSegmentType.CubismMotionSegmentType_Bezier: {
                            this._motionData.segments.at(totalSegmentCount).segmentType =
                                CubismMotionSegmentType.CubismMotionSegmentType_Bezier;
                            this._motionData.segments.at(totalSegmentCount).evaluate = bezierEvaluate;
                            this._motionData.points.at(totalPointCount).time = json.getMotionCurveSegment(curveCount, segmentPosition + 1);
                            this._motionData.points.at(totalPointCount).value = json.getMotionCurveSegment(curveCount, segmentPosition + 2);
                            this._motionData.points.at(totalPointCount + 1).time = json.getMotionCurveSegment(curveCount, segmentPosition + 3);
                            this._motionData.points.at(totalPointCount + 1).value = json.getMotionCurveSegment(curveCount, segmentPosition + 4);
                            this._motionData.points.at(totalPointCount + 2).time = json.getMotionCurveSegment(curveCount, segmentPosition + 5);
                            this._motionData.points.at(totalPointCount + 2).value = json.getMotionCurveSegment(curveCount, segmentPosition + 6);
                            totalPointCount += 3;
                            segmentPosition += 7;
                            break;
                        }
                        case CubismMotionSegmentType.CubismMotionSegmentType_Stepped: {
                            this._motionData.segments.at(totalSegmentCount).segmentType =
                                CubismMotionSegmentType.CubismMotionSegmentType_Stepped;
                            this._motionData.segments.at(totalSegmentCount).evaluate = steppedEvaluate;
                            this._motionData.points.at(totalPointCount).time = json.getMotionCurveSegment(curveCount, segmentPosition + 1);
                            this._motionData.points.at(totalPointCount).value = json.getMotionCurveSegment(curveCount, segmentPosition + 2);
                            totalPointCount += 1;
                            segmentPosition += 3;
                            break;
                        }
                        case CubismMotionSegmentType.CubismMotionSegmentType_InverseStepped: {
                            this._motionData.segments.at(totalSegmentCount).segmentType =
                                CubismMotionSegmentType.CubismMotionSegmentType_InverseStepped;
                            this._motionData.segments.at(totalSegmentCount).evaluate = inverseSteppedEvaluate;
                            this._motionData.points.at(totalPointCount).time = json.getMotionCurveSegment(curveCount, segmentPosition + 1);
                            this._motionData.points.at(totalPointCount).value = json.getMotionCurveSegment(curveCount, segmentPosition + 2);
                            totalPointCount += 1;
                            segmentPosition += 3;
                            break;
                        }
                        default: {
                            cubismdebug_1.CSM_ASSERT(0);
                            break;
                        }
                    }
                    ++this._motionData.curves.at(curveCount).segmentCount;
                    ++totalSegmentCount;
                }
            }
            for (var userdatacount = 0; userdatacount < json.getEventCount(); ++userdatacount) {
                this._motionData.events.at(userdatacount).fireTime = json.getEventTime(userdatacount);
                this._motionData.events.at(userdatacount).value = json.getEventValue(userdatacount);
            }
            json.release();
            json = void 0;
            json = null;
        };
        CubismMotion.prototype.getFiredEvent = function (beforeCheckTimeSeconds, motionTimeSeconds) {
            this._firedEventValues.updateSize(0);
            for (var u = 0; u < this._motionData.eventCount; ++u) {
                if (this._motionData.events.at(u).fireTime > beforeCheckTimeSeconds &&
                    this._motionData.events.at(u).fireTime <= motionTimeSeconds) {
                    this._firedEventValues.pushBack(new csmString(this._motionData.events.at(u).value.s));
                }
            }
            return this._firedEventValues;
        };
        return CubismMotion;
    }(ACubismMotion));
    Live2DCubismFramework.CubismMotion = CubismMotion;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmotion.js.map