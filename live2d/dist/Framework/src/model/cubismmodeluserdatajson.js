"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var cubismjson_1 = require("../utils/cubismjson");
var live2dcubismframework_1 = require("../live2dcubismframework");
var CubismFramework = live2dcubismframework_1.Live2DCubismFramework.CubismFramework;
var CubismJson = cubismjson_1.Live2DCubismFramework.CubismJson;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var Meta = 'Meta';
    var UserDataCount = 'UserDataCount';
    var TotalUserDataSize = 'TotalUserDataSize';
    var UserData = 'UserData';
    var Target = 'Target';
    var Id = 'Id';
    var Value = 'Value';
    var CubismModelUserDataJson = (function () {
        function CubismModelUserDataJson(buffer, size) {
            this._json = CubismJson.create(buffer, size);
        }
        CubismModelUserDataJson.prototype.release = function () {
            CubismJson.delete(this._json);
        };
        CubismModelUserDataJson.prototype.getUserDataCount = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(UserDataCount)
                .toInt();
        };
        CubismModelUserDataJson.prototype.getTotalUserDataSize = function () {
            return this._json
                .getRoot()
                .getValueByString(Meta)
                .getValueByString(TotalUserDataSize)
                .toInt();
        };
        CubismModelUserDataJson.prototype.getUserDataTargetType = function (i) {
            return this._json
                .getRoot()
                .getValueByString(UserData)
                .getValueByIndex(i)
                .getValueByString(Target)
                .getRawString();
        };
        CubismModelUserDataJson.prototype.getUserDataId = function (i) {
            return CubismFramework.getIdManager().getId(this._json
                .getRoot()
                .getValueByString(UserData)
                .getValueByIndex(i)
                .getValueByString(Id)
                .getRawString());
        };
        CubismModelUserDataJson.prototype.getUserDataValue = function (i) {
            return this._json
                .getRoot()
                .getValueByString(UserData)
                .getValueByIndex(i)
                .getValueByString(Value)
                .getRawString();
        };
        return CubismModelUserDataJson;
    }());
    Live2DCubismFramework.CubismModelUserDataJson = CubismModelUserDataJson;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmodeluserdatajson.js.map