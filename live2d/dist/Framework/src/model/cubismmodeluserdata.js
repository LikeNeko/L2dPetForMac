"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var cubismmodeluserdatajson_1 = require("./cubismmodeluserdatajson");
var csmstring_1 = require("../type/csmstring");
var csmvector_1 = require("../type/csmvector");
var live2dcubismframework_1 = require("../live2dcubismframework");
var CubismFramework = live2dcubismframework_1.Live2DCubismFramework.CubismFramework;
var csmVector = csmvector_1.Live2DCubismFramework.csmVector;
var csmString = csmstring_1.Live2DCubismFramework.csmString;
var CubismModelUserDataJson = cubismmodeluserdatajson_1.Live2DCubismFramework.CubismModelUserDataJson;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var ArtMesh = 'ArtMesh';
    var CubismModelUserDataNode = (function () {
        function CubismModelUserDataNode() {
        }
        return CubismModelUserDataNode;
    }());
    Live2DCubismFramework.CubismModelUserDataNode = CubismModelUserDataNode;
    var CubismModelUserData = (function () {
        function CubismModelUserData() {
            this._userDataNodes = new csmVector();
            this._artMeshUserDataNode = new csmVector();
        }
        CubismModelUserData.create = function (buffer, size) {
            var ret = new CubismModelUserData();
            ret.parseUserData(buffer, size);
            return ret;
        };
        CubismModelUserData.delete = function (modelUserData) {
            if (modelUserData != null) {
                modelUserData.release();
                modelUserData = null;
            }
        };
        CubismModelUserData.prototype.getArtMeshUserDatas = function () {
            return this._artMeshUserDataNode;
        };
        CubismModelUserData.prototype.parseUserData = function (buffer, size) {
            var json = new CubismModelUserDataJson(buffer, size);
            var typeOfArtMesh = CubismFramework.getIdManager().getId(ArtMesh);
            var nodeCount = json.getUserDataCount();
            for (var i = 0; i < nodeCount; i++) {
                var addNode = new CubismModelUserDataNode();
                addNode.targetId = json.getUserDataId(i);
                addNode.targetType = CubismFramework.getIdManager().getId(json.getUserDataTargetType(i));
                addNode.value = new csmString(json.getUserDataValue(i));
                this._userDataNodes.pushBack(addNode);
                if (addNode.targetType == typeOfArtMesh) {
                    this._artMeshUserDataNode.pushBack(addNode);
                }
            }
            json.release();
            json = void 0;
        };
        CubismModelUserData.prototype.release = function () {
            for (var i = 0; i < this._userDataNodes.getSize(); ++i) {
                this._userDataNodes.set(i, null);
            }
            this._userDataNodes = null;
        };
        return CubismModelUserData;
    }());
    Live2DCubismFramework.CubismModelUserData = CubismModelUserData;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmodeluserdata.js.map