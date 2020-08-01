"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var csmvector_1 = require("../type/csmvector");
var cubismid_1 = require("./cubismid");
var CubismId = cubismid_1.Live2DCubismFramework.CubismId;
var csmVector = csmvector_1.Live2DCubismFramework.csmVector;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var CubismIdManager = (function () {
        function CubismIdManager() {
            this._ids = new csmVector();
        }
        CubismIdManager.prototype.release = function () {
            for (var i = 0; i < this._ids.getSize(); ++i) {
                this._ids.set(i, void 0);
            }
            this._ids = null;
        };
        CubismIdManager.prototype.registerIds = function (ids) {
            for (var i = 0; i < ids.length; i++) {
                this.registerId(ids[i]);
            }
        };
        CubismIdManager.prototype.registerId = function (id) {
            var result = null;
            if ('string' == typeof id) {
                if ((result = this.findId(id)) != null) {
                    return result;
                }
                result = new CubismId(id);
                this._ids.pushBack(result);
            }
            else {
                return this.registerId(id.s);
            }
            return result;
        };
        CubismIdManager.prototype.getId = function (id) {
            return this.registerId(id);
        };
        CubismIdManager.prototype.isExist = function (id) {
            if ('string' == typeof id) {
                return this.findId(id) != null;
            }
            return this.isExist(id.s);
        };
        CubismIdManager.prototype.findId = function (id) {
            for (var i = 0; i < this._ids.getSize(); ++i) {
                if (this._ids
                    .at(i)
                    .getString()
                    .isEqual(id)) {
                    return this._ids.at(i);
                }
            }
            return null;
        };
        return CubismIdManager;
    }());
    Live2DCubismFramework.CubismIdManager = CubismIdManager;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismidmanager.js.map