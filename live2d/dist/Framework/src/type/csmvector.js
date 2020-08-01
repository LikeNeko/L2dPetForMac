"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var csmVector = (function () {
        function csmVector(initialCapacity) {
            if (initialCapacity === void 0) { initialCapacity = 0; }
            if (initialCapacity < 1) {
                this._ptr = [];
                this._capacity = 0;
                this._size = 0;
            }
            else {
                this._ptr = new Array(initialCapacity);
                this._capacity = initialCapacity;
                this._size = 0;
            }
        }
        csmVector.prototype.at = function (index) {
            return this._ptr[index];
        };
        csmVector.prototype.set = function (index, value) {
            this._ptr[index] = value;
        };
        csmVector.prototype.get = function (offset) {
            if (offset === void 0) { offset = 0; }
            var ret = new Array();
            for (var i = offset; i < this._size; i++) {
                ret.push(this._ptr[i]);
            }
            return ret;
        };
        csmVector.prototype.pushBack = function (value) {
            if (this._size >= this._capacity) {
                this.prepareCapacity(this._capacity == 0 ? csmVector.s_defaultSize : this._capacity * 2);
            }
            this._ptr[this._size++] = value;
        };
        csmVector.prototype.clear = function () {
            this._ptr.length = 0;
            this._size = 0;
        };
        csmVector.prototype.getSize = function () {
            return this._size;
        };
        csmVector.prototype.assign = function (newSize, value) {
            var curSize = this._size;
            if (curSize < newSize) {
                this.prepareCapacity(newSize);
            }
            for (var i = 0; i < newSize; i++) {
                this._ptr[i] = value;
            }
            this._size = newSize;
        };
        csmVector.prototype.resize = function (newSize, value) {
            if (value === void 0) { value = null; }
            this.updateSize(newSize, value, true);
        };
        csmVector.prototype.updateSize = function (newSize, value, callPlacementNew) {
            if (value === void 0) { value = null; }
            if (callPlacementNew === void 0) { callPlacementNew = true; }
            var curSize = this._size;
            if (curSize < newSize) {
                this.prepareCapacity(newSize);
                if (callPlacementNew) {
                    for (var i = this._size; i < newSize; i++) {
                        if (typeof value == 'function') {
                            this._ptr[i] = JSON.parse(JSON.stringify(new value()));
                        }
                        else {
                            this._ptr[i] = value;
                        }
                    }
                }
                else {
                    for (var i = this._size; i < newSize; i++) {
                        this._ptr[i] = value;
                    }
                }
            }
            else {
                var sub = this._size - newSize;
                this._ptr.splice(this._size - sub, sub);
            }
            this._size = newSize;
        };
        csmVector.prototype.insert = function (position, begin, end) {
            var dstSi = position._index;
            var srcSi = begin._index;
            var srcEi = end._index;
            var addCount = srcEi - srcSi;
            this.prepareCapacity(this._size + addCount);
            var addSize = this._size - dstSi;
            if (addSize > 0) {
                for (var i = 0; i < addSize; i++) {
                    this._ptr.splice(dstSi + i, 0, null);
                }
            }
            for (var i = srcSi; i < srcEi; i++, dstSi++) {
                this._ptr[dstSi] = begin._vector._ptr[i];
            }
            this._size = this._size + addCount;
        };
        csmVector.prototype.remove = function (index) {
            if (index < 0 || this._size <= index) {
                return false;
            }
            this._ptr.splice(index, 1);
            --this._size;
            return true;
        };
        csmVector.prototype.erase = function (ite) {
            var index = ite._index;
            if (index < 0 || this._size <= index) {
                return ite;
            }
            this._ptr.splice(index, 1);
            --this._size;
            var ite2 = new iterator(this, index);
            return ite2;
        };
        csmVector.prototype.prepareCapacity = function (newSize) {
            if (newSize > this._capacity) {
                if (this._capacity == 0) {
                    this._ptr = new Array(newSize);
                    this._capacity = newSize;
                }
                else {
                    this._ptr.length = newSize;
                    this._capacity = newSize;
                }
            }
        };
        csmVector.prototype.begin = function () {
            var ite = this._size == 0 ? this.end() : new iterator(this, 0);
            return ite;
        };
        csmVector.prototype.end = function () {
            var ite = new iterator(this, this._size);
            return ite;
        };
        csmVector.prototype.getOffset = function (offset) {
            var newVector = new csmVector();
            newVector._ptr = this.get(offset);
            newVector._size = this.get(offset).length;
            newVector._capacity = this.get(offset).length;
            return newVector;
        };
        csmVector.s_defaultSize = 10;
        return csmVector;
    }());
    Live2DCubismFramework.csmVector = csmVector;
    var iterator = (function () {
        function iterator(v, index) {
            this._vector = v != undefined ? v : null;
            this._index = index != undefined ? index : 0;
        }
        iterator.prototype.set = function (ite) {
            this._index = ite._index;
            this._vector = ite._vector;
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
            var iteold = new iterator(this._vector, this._index++);
            this._vector = iteold._vector;
            this._index = iteold._index;
            return this;
        };
        iterator.prototype.decrement = function () {
            var iteold = new iterator(this._vector, this._index--);
            this._vector = iteold._vector;
            this._index = iteold._index;
            return this;
        };
        iterator.prototype.ptr = function () {
            return this._vector._ptr[this._index];
        };
        iterator.prototype.substitution = function (ite) {
            this._index = ite._index;
            this._vector = ite._vector;
            return this;
        };
        iterator.prototype.notEqual = function (ite) {
            return this._index != ite._index || this._vector != ite._vector;
        };
        return iterator;
    }());
    Live2DCubismFramework.iterator = iterator;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=csmvector.js.map