"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var csmvector_1 = require("../type/csmvector");
var live2dcubismframework_1 = require("../live2dcubismframework");
var cubismjson_1 = require("../utils/cubismjson");
var csmVector = csmvector_1.Live2DCubismFramework.csmVector;
var CubismFramework = live2dcubismframework_1.Live2DCubismFramework.CubismFramework;
var CubismJson = cubismjson_1.Live2DCubismFramework.CubismJson;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var Epsilon = 0.001;
    var DefaultFadeInSeconds = 0.5;
    var FadeIn = 'FadeInTime';
    var Link = 'Link';
    var Groups = 'Groups';
    var Id = 'Id';
    var CubismPose = (function () {
        function CubismPose() {
            this._fadeTimeSeconds = DefaultFadeInSeconds;
            this._lastModel = null;
            this._partGroups = new csmVector();
            this._partGroupCounts = new csmVector();
        }
        CubismPose.create = function (pose3json, size) {
            var ret = new CubismPose();
            var json = CubismJson.create(pose3json, size);
            var root = json.getRoot();
            if (!root.getValueByString(FadeIn).isNull()) {
                ret._fadeTimeSeconds = root
                    .getValueByString(FadeIn)
                    .toFloat(DefaultFadeInSeconds);
                if (ret._fadeTimeSeconds <= 0.0) {
                    ret._fadeTimeSeconds = DefaultFadeInSeconds;
                }
            }
            var poseListInfo = root.getValueByString(Groups);
            var poseCount = poseListInfo.getSize();
            for (var poseIndex = 0; poseIndex < poseCount; ++poseIndex) {
                var idListInfo = poseListInfo.getValueByIndex(poseIndex);
                var idCount = idListInfo.getSize();
                var groupCount = 0;
                for (var groupIndex = 0; groupIndex < idCount; ++groupIndex) {
                    var partInfo = idListInfo.getValueByIndex(groupIndex);
                    var partData = new PartData();
                    var parameterId = CubismFramework.getIdManager().getId(partInfo.getValueByString(Id).getRawString());
                    partData.partId = parameterId;
                    if (!partInfo.getValueByString(Link).isNull()) {
                        var linkListInfo = partInfo.getValueByString(Link);
                        var linkCount = linkListInfo.getSize();
                        for (var linkIndex = 0; linkIndex < linkCount; ++linkIndex) {
                            var linkPart = new PartData();
                            var linkId = CubismFramework.getIdManager().getId(linkListInfo.getValueByIndex(linkIndex).getString());
                            linkPart.partId = linkId;
                            partData.link.pushBack(linkPart);
                        }
                    }
                    ret._partGroups.pushBack(partData.clone());
                    ++groupCount;
                }
                ret._partGroupCounts.pushBack(groupCount);
            }
            CubismJson.delete(json);
            return ret;
        };
        CubismPose.delete = function (pose) {
            if (pose != null) {
                pose = null;
            }
        };
        CubismPose.prototype.updateParameters = function (model, deltaTimeSeconds) {
            if (model != this._lastModel) {
                this.reset(model);
            }
            this._lastModel = model;
            if (deltaTimeSeconds < 0.0) {
                deltaTimeSeconds = 0.0;
            }
            var beginIndex = 0;
            for (var i = 0; i < this._partGroupCounts.getSize(); i++) {
                var partGroupCount = this._partGroupCounts.at(i);
                this.doFade(model, deltaTimeSeconds, beginIndex, partGroupCount);
                beginIndex += partGroupCount;
            }
            this.copyPartOpacities(model);
        };
        CubismPose.prototype.reset = function (model) {
            var beginIndex = 0;
            for (var i = 0; i < this._partGroupCounts.getSize(); ++i) {
                var groupCount = this._partGroupCounts.at(i);
                for (var j = beginIndex; j < beginIndex + groupCount; ++j) {
                    this._partGroups.at(j).initialize(model);
                    var partsIndex = this._partGroups.at(j).partIndex;
                    var paramIndex = this._partGroups.at(j).parameterIndex;
                    if (partsIndex < 0) {
                        continue;
                    }
                    model.setPartOpacityByIndex(partsIndex, j == beginIndex ? 1.0 : 0.0);
                    model.setParameterValueByIndex(paramIndex, j == beginIndex ? 1.0 : 0.0);
                    for (var k = 0; k < this._partGroups.at(j).link.getSize(); ++k) {
                        this._partGroups
                            .at(j)
                            .link.at(k)
                            .initialize(model);
                    }
                }
                beginIndex += groupCount;
            }
        };
        CubismPose.prototype.copyPartOpacities = function (model) {
            for (var groupIndex = 0; groupIndex < this._partGroups.getSize(); ++groupIndex) {
                var partData = this._partGroups.at(groupIndex);
                if (partData.link.getSize() == 0) {
                    continue;
                }
                var partIndex = this._partGroups.at(groupIndex).partIndex;
                var opacity = model.getPartOpacityByIndex(partIndex);
                for (var linkIndex = 0; linkIndex < partData.link.getSize(); ++linkIndex) {
                    var linkPart = partData.link.at(linkIndex);
                    var linkPartIndex = linkPart.partIndex;
                    if (linkPartIndex < 0) {
                        continue;
                    }
                    model.setPartOpacityByIndex(linkPartIndex, opacity);
                }
            }
        };
        CubismPose.prototype.doFade = function (model, deltaTimeSeconds, beginIndex, partGroupCount) {
            var visiblePartIndex = -1;
            var newOpacity = 1.0;
            var phi = 0.5;
            var backOpacityThreshold = 0.15;
            for (var i = beginIndex; i < beginIndex + partGroupCount; ++i) {
                var partIndex = this._partGroups.at(i).partIndex;
                var paramIndex = this._partGroups.at(i).parameterIndex;
                if (model.getParameterValueByIndex(paramIndex) > Epsilon) {
                    if (visiblePartIndex >= 0) {
                        break;
                    }
                    visiblePartIndex = i;
                    newOpacity = model.getPartOpacityByIndex(partIndex);
                    newOpacity += deltaTimeSeconds / this._fadeTimeSeconds;
                    if (newOpacity > 1.0) {
                        newOpacity = 1.0;
                    }
                }
            }
            if (visiblePartIndex < 0) {
                visiblePartIndex = 0;
                newOpacity = 1.0;
            }
            for (var i = beginIndex; i < beginIndex + partGroupCount; ++i) {
                var partsIndex = this._partGroups.at(i).partIndex;
                if (visiblePartIndex == i) {
                    model.setPartOpacityByIndex(partsIndex, newOpacity);
                }
                else {
                    var opacity = model.getPartOpacityByIndex(partsIndex);
                    var a1 = void 0;
                    if (newOpacity < phi) {
                        a1 = (newOpacity * (phi - 1)) / phi + 1.0;
                    }
                    else {
                        a1 = ((1 - newOpacity) * phi) / (1.0 - phi);
                    }
                    var backOpacity = (1.0 - a1) * (1.0 - newOpacity);
                    if (backOpacity > backOpacityThreshold) {
                        a1 = 1.0 - backOpacityThreshold / (1.0 - newOpacity);
                    }
                    if (opacity > a1) {
                        opacity = a1;
                    }
                    model.setPartOpacityByIndex(partsIndex, opacity);
                }
            }
        };
        return CubismPose;
    }());
    Live2DCubismFramework.CubismPose = CubismPose;
    var PartData = (function () {
        function PartData(v) {
            this.parameterIndex = 0;
            this.partIndex = 0;
            this.link = new csmVector();
            if (v != undefined) {
                this.partId = v.partId;
                for (var ite = v.link.begin(); ite.notEqual(v.link.end()); ite.preIncrement()) {
                    this.link.pushBack(ite.ptr().clone());
                }
            }
        }
        PartData.prototype.assignment = function (v) {
            this.partId = v.partId;
            for (var ite = v.link.begin(); ite.notEqual(v.link.end()); ite.preIncrement()) {
                this.link.pushBack(ite.ptr().clone());
            }
            return this;
        };
        PartData.prototype.initialize = function (model) {
            this.parameterIndex = model.getParameterIndex(this.partId);
            this.partIndex = model.getPartIndex(this.partId);
            model.setParameterValueByIndex(this.parameterIndex, 1);
        };
        PartData.prototype.clone = function () {
            var clonePartData = new PartData();
            clonePartData.partId = this.partId;
            clonePartData.parameterIndex = this.parameterIndex;
            clonePartData.partIndex = this.partIndex;
            clonePartData.link = new csmVector();
            for (var ite = this.link.begin(); ite.notEqual(this.link.end()); ite.increment()) {
                clonePartData.link.pushBack(ite.ptr().clone());
            }
            return clonePartData;
        };
        return PartData;
    }());
    Live2DCubismFramework.PartData = PartData;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismpose.js.map