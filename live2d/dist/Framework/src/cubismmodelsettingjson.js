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
var live2dcubismframework_1 = require("./live2dcubismframework");
var icubismmodelsetting_1 = require("./icubismmodelsetting");
var cubismjson_1 = require("./utils/cubismjson");
var csmvector_1 = require("./type/csmvector");
var csmVector = csmvector_1.Live2DCubismFramework.csmVector;
var CubismFramework = live2dcubismframework_1.Live2DCubismFramework.CubismFramework;
var CubismJson = cubismjson_1.Live2DCubismFramework.CubismJson;
var ICubismModelSetting = icubismmodelsetting_1.Live2DCubismFramework.ICubismModelSetting;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var Version = 'Version';
    var FileReferences = 'FileReferences';
    var Groups = 'Groups';
    var Layout = 'Layout';
    var HitAreas = 'HitAreas';
    var Moc = 'Moc';
    var Textures = 'Textures';
    var Physics = 'Physics';
    var Pose = 'Pose';
    var Expressions = 'Expressions';
    var Motions = 'Motions';
    var UserData = 'UserData';
    var Name = 'Name';
    var FilePath = 'File';
    var Id = 'Id';
    var Ids = 'Ids';
    var Target = 'Target';
    var Idle = 'Idle';
    var TapBody = 'TapBody';
    var PinchIn = 'PinchIn';
    var PinchOut = 'PinchOut';
    var Shake = 'Shake';
    var FlickHead = 'FlickHead';
    var Parameter = 'Parameter';
    var SoundPath = 'Sound';
    var FadeInTime = 'FadeInTime';
    var FadeOutTime = 'FadeOutTime';
    var CenterX = 'CenterX';
    var CenterY = 'CenterY';
    var X = 'X';
    var Y = 'Y';
    var Width = 'Width';
    var Height = 'Height';
    var LipSync = 'LipSync';
    var EyeBlink = 'EyeBlink';
    var InitParameter = 'init_param';
    var InitPartsVisible = 'init_parts_visible';
    var Val = 'val';
    var FrequestNode;
    (function (FrequestNode) {
        FrequestNode[FrequestNode["FrequestNode_Groups"] = 0] = "FrequestNode_Groups";
        FrequestNode[FrequestNode["FrequestNode_Moc"] = 1] = "FrequestNode_Moc";
        FrequestNode[FrequestNode["FrequestNode_Motions"] = 2] = "FrequestNode_Motions";
        FrequestNode[FrequestNode["FrequestNode_Expressions"] = 3] = "FrequestNode_Expressions";
        FrequestNode[FrequestNode["FrequestNode_Textures"] = 4] = "FrequestNode_Textures";
        FrequestNode[FrequestNode["FrequestNode_Physics"] = 5] = "FrequestNode_Physics";
        FrequestNode[FrequestNode["FrequestNode_Pose"] = 6] = "FrequestNode_Pose";
        FrequestNode[FrequestNode["FrequestNode_HitAreas"] = 7] = "FrequestNode_HitAreas";
    })(FrequestNode || (FrequestNode = {}));
    var CubismModelSettingJson = (function (_super) {
        __extends(CubismModelSettingJson, _super);
        function CubismModelSettingJson(buffer, size) {
            var _this = _super.call(this) || this;
            _this._json = CubismJson.create(buffer, size);
            if (_this._json) {
                _this._jsonValue = new csmVector();
                _this._jsonValue.pushBack(_this._json.getRoot().getValueByString(Groups));
                _this._jsonValue.pushBack(_this._json
                    .getRoot()
                    .getValueByString(FileReferences)
                    .getValueByString(Moc));
                _this._jsonValue.pushBack(_this._json
                    .getRoot()
                    .getValueByString(FileReferences)
                    .getValueByString(Motions));
                _this._jsonValue.pushBack(_this._json
                    .getRoot()
                    .getValueByString(FileReferences)
                    .getValueByString(Expressions));
                _this._jsonValue.pushBack(_this._json
                    .getRoot()
                    .getValueByString(FileReferences)
                    .getValueByString(Textures));
                _this._jsonValue.pushBack(_this._json
                    .getRoot()
                    .getValueByString(FileReferences)
                    .getValueByString(Physics));
                _this._jsonValue.pushBack(_this._json
                    .getRoot()
                    .getValueByString(FileReferences)
                    .getValueByString(Pose));
                _this._jsonValue.pushBack(_this._json.getRoot().getValueByString(HitAreas));
            }
            return _this;
        }
        CubismModelSettingJson.prototype.release = function () {
            CubismJson.delete(this._json);
            this._jsonValue = null;
        };
        CubismModelSettingJson.prototype.GetJson = function () {
            return this._json;
        };
        CubismModelSettingJson.prototype.getModelFileName = function () {
            if (!this.isExistModelFile()) {
                return '';
            }
            return this._jsonValue.at(FrequestNode.FrequestNode_Moc).getRawString();
        };
        CubismModelSettingJson.prototype.getTextureCount = function () {
            if (!this.isExistTextureFiles()) {
                return 0;
            }
            return this._jsonValue.at(FrequestNode.FrequestNode_Textures).getSize();
        };
        CubismModelSettingJson.prototype.getTextureDirectory = function () {
            return this._jsonValue
                .at(FrequestNode.FrequestNode_Textures)
                .getRawString();
        };
        CubismModelSettingJson.prototype.getTextureFileName = function (index) {
            return this._jsonValue
                .at(FrequestNode.FrequestNode_Textures)
                .getValueByIndex(index)
                .getRawString();
        };
        CubismModelSettingJson.prototype.getHitAreasCount = function () {
            if (!this.isExistHitAreas()) {
                return 0;
            }
            return this._jsonValue.at(FrequestNode.FrequestNode_HitAreas).getSize();
        };
        CubismModelSettingJson.prototype.getHitAreaId = function (index) {
            return CubismFramework.getIdManager().getId(this._jsonValue
                .at(FrequestNode.FrequestNode_HitAreas)
                .getValueByIndex(index)
                .getValueByString(Id)
                .getRawString());
        };
        CubismModelSettingJson.prototype.getHitAreaName = function (index) {
            return this._jsonValue
                .at(FrequestNode.FrequestNode_HitAreas)
                .getValueByIndex(index)
                .getValueByString(Name)
                .getRawString();
        };
        CubismModelSettingJson.prototype.getPhysicsFileName = function () {
            if (!this.isExistPhysicsFile()) {
                return '';
            }
            return this._jsonValue
                .at(FrequestNode.FrequestNode_Physics)
                .getRawString();
        };
        CubismModelSettingJson.prototype.getPoseFileName = function () {
            if (!this.isExistPoseFile()) {
                return '';
            }
            return this._jsonValue.at(FrequestNode.FrequestNode_Pose).getRawString();
        };
        CubismModelSettingJson.prototype.getExpressionCount = function () {
            if (!this.isExistExpressionFile()) {
                return 0;
            }
            return this._jsonValue
                .at(FrequestNode.FrequestNode_Expressions)
                .getSize();
        };
        CubismModelSettingJson.prototype.getExpressionName = function (index) {
            return this._jsonValue
                .at(FrequestNode.FrequestNode_Expressions)
                .getValueByIndex(index)
                .getValueByString(Name)
                .getRawString();
        };
        CubismModelSettingJson.prototype.getExpressionFileName = function (index) {
            return this._jsonValue
                .at(FrequestNode.FrequestNode_Expressions)
                .getValueByIndex(index)
                .getValueByString(FilePath)
                .getRawString();
        };
        CubismModelSettingJson.prototype.getMotionGroupCount = function () {
            if (!this.isExistMotionGroups()) {
                return 0;
            }
            return this._jsonValue
                .at(FrequestNode.FrequestNode_Motions)
                .getKeys()
                .getSize();
        };
        CubismModelSettingJson.prototype.getMotionGroupName = function (index) {
            if (!this.isExistMotionGroups()) {
                return null;
            }
            return this._jsonValue
                .at(FrequestNode.FrequestNode_Motions)
                .getKeys()
                .at(index);
        };
        CubismModelSettingJson.prototype.getMotionCount = function (groupName) {
            if (!this.isExistMotionGroupName(groupName)) {
                return 0;
            }
            return this._jsonValue
                .at(FrequestNode.FrequestNode_Motions)
                .getValueByString(groupName)
                .getSize();
        };
        CubismModelSettingJson.prototype.getMotionFileName = function (groupName, index) {
            if (!this.isExistMotionGroupName(groupName)) {
                return '';
            }
            return this._jsonValue
                .at(FrequestNode.FrequestNode_Motions)
                .getValueByString(groupName)
                .getValueByIndex(index)
                .getValueByString(FilePath)
                .getRawString();
        };
        CubismModelSettingJson.prototype.getMotionSoundFileName = function (groupName, index) {
            if (!this.isExistMotionSoundFile(groupName, index)) {
                return '';
            }
            return this._jsonValue
                .at(FrequestNode.FrequestNode_Motions)
                .getValueByString(groupName)
                .getValueByIndex(index)
                .getValueByString(SoundPath)
                .getRawString();
        };
        CubismModelSettingJson.prototype.getMotionFadeInTimeValue = function (groupName, index) {
            if (!this.isExistMotionFadeIn(groupName, index)) {
                return -1.0;
            }
            return this._jsonValue
                .at(FrequestNode.FrequestNode_Motions)
                .getValueByString(groupName)
                .getValueByIndex(index)
                .getValueByString(FadeInTime)
                .toFloat();
        };
        CubismModelSettingJson.prototype.getMotionFadeOutTimeValue = function (groupName, index) {
            if (!this.isExistMotionFadeOut(groupName, index)) {
                return -1.0;
            }
            return this._jsonValue
                .at(FrequestNode.FrequestNode_Motions)
                .getValueByString(groupName)
                .getValueByIndex(index)
                .getValueByString(FadeOutTime)
                .toFloat();
        };
        CubismModelSettingJson.prototype.getUserDataFile = function () {
            if (!this.isExistUserDataFile()) {
                return '';
            }
            return this._json
                .getRoot()
                .getValueByString(FileReferences)
                .getValueByString(UserData)
                .getRawString();
        };
        CubismModelSettingJson.prototype.getLayoutMap = function (outLayoutMap) {
            var map = this._json
                .getRoot()
                .getValueByString(Layout)
                .getMap();
            if (map == null) {
                return false;
            }
            var ret = false;
            for (var ite = map.begin(); ite.notEqual(map.end()); ite.preIncrement()) {
                outLayoutMap.setValue(ite.ptr().first, ite.ptr().second.toFloat());
                ret = true;
            }
            return ret;
        };
        CubismModelSettingJson.prototype.getEyeBlinkParameterCount = function () {
            if (!this.isExistEyeBlinkParameters()) {
                return 0;
            }
            var num = 0;
            for (var i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); i++) {
                var refI = this._jsonValue
                    .at(FrequestNode.FrequestNode_Groups)
                    .getValueByIndex(i);
                if (refI.isNull() || refI.isError()) {
                    continue;
                }
                if (refI.getValueByString(Name).getRawString() == EyeBlink) {
                    num = refI
                        .getValueByString(Ids)
                        .getVector()
                        .getSize();
                    break;
                }
            }
            return num;
        };
        CubismModelSettingJson.prototype.getEyeBlinkParameterId = function (index) {
            if (!this.isExistEyeBlinkParameters()) {
                return null;
            }
            for (var i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); i++) {
                var refI = this._jsonValue
                    .at(FrequestNode.FrequestNode_Groups)
                    .getValueByIndex(i);
                if (refI.isNull() || refI.isError()) {
                    continue;
                }
                if (refI.getValueByString(Name).getRawString() == EyeBlink) {
                    return CubismFramework.getIdManager().getId(refI
                        .getValueByString(Ids)
                        .getValueByIndex(index)
                        .getRawString());
                }
            }
            return null;
        };
        CubismModelSettingJson.prototype.getLipSyncParameterCount = function () {
            if (!this.isExistLipSyncParameters()) {
                return 0;
            }
            var num = 0;
            for (var i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); i++) {
                var refI = this._jsonValue
                    .at(FrequestNode.FrequestNode_Groups)
                    .getValueByIndex(i);
                if (refI.isNull() || refI.isError()) {
                    continue;
                }
                if (refI.getValueByString(Name).getRawString() == LipSync) {
                    num = refI
                        .getValueByString(Ids)
                        .getVector()
                        .getSize();
                    break;
                }
            }
            return num;
        };
        CubismModelSettingJson.prototype.getLipSyncParameterId = function (index) {
            if (!this.isExistLipSyncParameters()) {
                return null;
            }
            for (var i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); i++) {
                var refI = this._jsonValue
                    .at(FrequestNode.FrequestNode_Groups)
                    .getValueByIndex(i);
                if (refI.isNull() || refI.isError()) {
                    continue;
                }
                if (refI.getValueByString(Name).getRawString() == LipSync) {
                    return CubismFramework.getIdManager().getId(refI
                        .getValueByString(Ids)
                        .getValueByIndex(index)
                        .getRawString());
                }
            }
            return null;
        };
        CubismModelSettingJson.prototype.isExistModelFile = function () {
            var node = this._jsonValue.at(FrequestNode.FrequestNode_Moc);
            return !node.isNull() && !node.isError();
        };
        CubismModelSettingJson.prototype.isExistTextureFiles = function () {
            var node = this._jsonValue.at(FrequestNode.FrequestNode_Textures);
            return !node.isNull() && !node.isError();
        };
        CubismModelSettingJson.prototype.isExistHitAreas = function () {
            var node = this._jsonValue.at(FrequestNode.FrequestNode_HitAreas);
            return !node.isNull() && !node.isError();
        };
        CubismModelSettingJson.prototype.isExistPhysicsFile = function () {
            var node = this._jsonValue.at(FrequestNode.FrequestNode_Physics);
            return !node.isNull() && !node.isError();
        };
        CubismModelSettingJson.prototype.isExistPoseFile = function () {
            var node = this._jsonValue.at(FrequestNode.FrequestNode_Pose);
            return !node.isNull() && !node.isError();
        };
        CubismModelSettingJson.prototype.isExistExpressionFile = function () {
            var node = this._jsonValue.at(FrequestNode.FrequestNode_Expressions);
            return !node.isNull() && !node.isError();
        };
        CubismModelSettingJson.prototype.isExistMotionGroups = function () {
            var node = this._jsonValue.at(FrequestNode.FrequestNode_Motions);
            return !node.isNull() && !node.isError();
        };
        CubismModelSettingJson.prototype.isExistMotionGroupName = function (groupName) {
            var node = this._jsonValue
                .at(FrequestNode.FrequestNode_Motions)
                .getValueByString(groupName);
            return !node.isNull() && !node.isError();
        };
        CubismModelSettingJson.prototype.isExistMotionSoundFile = function (groupName, index) {
            var node = this._jsonValue
                .at(FrequestNode.FrequestNode_Motions)
                .getValueByString(groupName)
                .getValueByIndex(index)
                .getValueByString(SoundPath);
            return !node.isNull() && !node.isError();
        };
        CubismModelSettingJson.prototype.isExistMotionFadeIn = function (groupName, index) {
            var node = this._jsonValue
                .at(FrequestNode.FrequestNode_Motions)
                .getValueByString(groupName)
                .getValueByIndex(index)
                .getValueByString(FadeInTime);
            return !node.isNull() && !node.isError();
        };
        CubismModelSettingJson.prototype.isExistMotionFadeOut = function (groupName, index) {
            var node = this._jsonValue
                .at(FrequestNode.FrequestNode_Motions)
                .getValueByString(groupName)
                .getValueByIndex(index)
                .getValueByString(FadeOutTime);
            return !node.isNull() && !node.isError();
        };
        CubismModelSettingJson.prototype.isExistUserDataFile = function () {
            var node = this._json
                .getRoot()
                .getValueByString(FileReferences)
                .getValueByString(UserData);
            return !node.isNull() && !node.isError();
        };
        CubismModelSettingJson.prototype.isExistEyeBlinkParameters = function () {
            if (this._jsonValue.at(FrequestNode.FrequestNode_Groups).isNull() ||
                this._jsonValue.at(FrequestNode.FrequestNode_Groups).isError()) {
                return false;
            }
            for (var i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); ++i) {
                if (this._jsonValue
                    .at(FrequestNode.FrequestNode_Groups)
                    .getValueByIndex(i)
                    .getValueByString(Name)
                    .getRawString() == EyeBlink) {
                    return true;
                }
            }
            return false;
        };
        CubismModelSettingJson.prototype.isExistLipSyncParameters = function () {
            if (this._jsonValue.at(FrequestNode.FrequestNode_Groups).isNull() ||
                this._jsonValue.at(FrequestNode.FrequestNode_Groups).isError()) {
                return false;
            }
            for (var i = 0; i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize(); ++i) {
                if (this._jsonValue
                    .at(FrequestNode.FrequestNode_Groups)
                    .getValueByIndex(i)
                    .getValueByString(Name)
                    .getRawString() == LipSync) {
                    return true;
                }
            }
            return false;
        };
        return CubismModelSettingJson;
    }(ICubismModelSetting));
    Live2DCubismFramework.CubismModelSettingJson = CubismModelSettingJson;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmodelsettingjson.js.map