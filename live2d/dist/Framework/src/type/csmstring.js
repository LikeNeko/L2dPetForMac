"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var csmString = (function () {
        function csmString(s) {
            this.s = s;
        }
        csmString.prototype.append = function (c, length) {
            this.s += length !== undefined ? c.substr(0, length) : c;
            return this;
        };
        csmString.prototype.expansion = function (length, v) {
            for (var i = 0; i < length; i++) {
                this.append(v);
            }
            return this;
        };
        csmString.prototype.getBytes = function () {
            return encodeURIComponent(this.s).replace(/%../g, 'x').length;
        };
        csmString.prototype.getLength = function () {
            return this.s.length;
        };
        csmString.prototype.isLess = function (s) {
            return this.s < s.s;
        };
        csmString.prototype.isGreat = function (s) {
            return this.s > s.s;
        };
        csmString.prototype.isEqual = function (s) {
            return this.s == s;
        };
        csmString.prototype.isEmpty = function () {
            return this.s.length == 0;
        };
        return csmString;
    }());
    Live2DCubismFramework.csmString = csmString;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=csmstring.js.map