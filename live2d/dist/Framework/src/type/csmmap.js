"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var cubismdebug_1 = require("../utils/cubismdebug");
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var csmPair = (function () {
        function csmPair(key, value) {
            this.first = key == undefined ? null : key;
            this.second = value == undefined ? null : value;
        }
        return csmPair;
    }());
    Live2DCubismFramework.csmPair = csmPair;
    var csmMap = (function () {
        function csmMap(size) {
            if (size != undefined) {
                if (size < 1) {
                    this._keyValues = [];
                    this._dummyValue = null;
                    this._size = 0;
                }
                else {
                    this._keyValues = new Array(size);
                    this._size = size;
                }
            }
            else {
                this._keyValues = [];
                this._dummyValue = null;
                this._size = 0;
            }
        }
        csmMap.prototype.release = function () {
            this.clear();
        };
        csmMap.prototype.appendKey = function (key) {
            this.prepareCapacity(this._size + 1, false);
            this._keyValues[this._size] = new csmPair(key);
            this._size += 1;
        };
        csmMap.prototype.getValue = function (key) {
            var found = -1;
            for (var i = 0; i < this._size; i++) {
                if (this._keyValues[i].first == key) {
                    found = i;
                    break;
                }
            }
            if (found >= 0) {
                return this._keyValues[found].second;
            }
            else {
                this.appendKey(key);
                return this._keyValues[this._size - 1].second;
            }
        };
        csmMap.prototype.setValue = function (key, value) {
            var found = -1;
            for (var i = 0; i < this._size; i++) {
                if (this._keyValues[i].first == key) {
                    found = i;
                    break;
                }
            }
            if (found >= 0) {
                this._keyValues[found].second = value;
            }
            else {
                this.appendKey(key);
                this._keyValues[this._size - 1].second = value;
            }
        };
        csmMap.prototype.isExist = function (key) {
            for (var i = 0; i < this._size; i++) {
                if (this._keyValues[i].first == key) {
                    return true;
                }
            }
            return false;
        };
        csmMap.prototype.clear = function () {
            this._keyValues = void 0;
            this._keyValues = null;
            this._keyValues = [];
            this._size = 0;
        };
        csmMap.prototype.getSize = function () {
            return this._size;
        };
        csmMap.prototype.prepareCapacity = function (newSize, fitToSize) {
            if (newSize > this._keyValues.length) {
                if (this._keyValues.length == 0) {
                    if (!fitToSize && newSize < csmMap.DefaultSize)
                        newSize = csmMap.DefaultSize;
                    this._keyValues.length = newSize;
                }
                else {
                    if (!fitToSize && newSize < this._keyValues.length * 2)
                        newSize = this._keyValues.length * 2;
                    this._keyValues.length = newSize;
                }
            }
        };
        csmMap.prototype.begin = function () {
            var ite = new iterator(this, 0);
            return ite;
        };
        csmMap.prototype.end = function () {
            var ite = new iterator(this, this._size);
            return ite;
        };
        csmMap.prototype.erase = function (ite) {
            var index = ite._index;
            if (index < 0 || this._size <= index) {
                return ite;
            }
            this._keyValues.splice(index, 1);
            --this._size;
            var ite2 = new iterator(this, index);
            return ite2;
        };
        csmMap.prototype.dumpAsInt = function () {
            for (var i = 0; i < this._size; i++) {
                cubismdebug_1.CubismLogDebug('{0} ,', this._keyValues[i]);
                cubismdebug_1.CubismLogDebug('\n');
            }
        };
        csmMap.DefaultSize = 10;
        return csmMap;
    }());
    Live2DCubismFramework.csmMap = csmMap;
    var iterator = (function () {
        function iterator(v, idx) {
            this._map = v != undefined ? v : new csmMap();
            this._index = idx != undefined ? idx : 0;
        }
        iterator.prototype.set = function (ite) {
            this._index = ite._index;
            this._map = ite._map;
            return this;
        };
        iterator.prototype.preIncrement = function () {
            ++this._index;
            return this;
        };
        iterator.prototype.preDecrement = function () {
            --this._index;
            return this;
        };
        iterator.prototype.increment = function () {
            var iteold = new iterator(this._map, this._index++);
            this._map = iteold._map;
            this._index = iteold._index;
            return this;
        };
        iterator.prototype.decrement = function () {
            var iteold = new iterator(this._map, this._index);
            this._map = iteold._map;
            this._index = iteold._index;
            return this;
        };
        iterator.prototype.ptr = function () {
            return this._map._keyValues[this._index];
        };
        iterator.prototype.notEqual = function (ite) {
            return this._index != ite._index || this._map != ite._map;
        };
        return iterator;
    }());
    Live2DCubismFramework.iterator = iterator;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=csmmap.js.map