"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var csmstring_1 = require("../type/csmstring");
var csmString = csmstring_1.Live2DCubismFramework.csmString;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var CubismId = (function () {
        function CubismId(id) {
            if (typeof id === 'string') {
                this._id = new csmString(id);
                return;
            }
            this._id = id;
        }
        CubismId.prototype.getString = function () {
            return this._id;
        };
        CubismId.prototype.isEqual = function (c) {
            if (typeof c === 'string') {
                return this._id.isEqual(c);
            }
            else if (c instanceof csmString) {
                return this._id.isEqual(c.s);
            }
            else if (c instanceof CubismId) {
                return this._id.isEqual(c._id.s);
            }
            return false;
        };
        CubismId.prototype.isNotEqual = function (c) {
            if (typeof c == 'string') {
                return !this._id.isEqual(c);
            }
            else if (c instanceof csmString) {
                return !this._id.isEqual(c.s);
            }
            else if (c instanceof CubismId) {
                return !this._id.isEqual(c._id.s);
            }
            return false;
        };
        return CubismId;
    }());
    Live2DCubismFramework.CubismId = CubismId;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismid.js.map