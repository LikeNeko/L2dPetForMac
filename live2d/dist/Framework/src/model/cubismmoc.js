"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var cubismmodel_1 = require("./cubismmodel");
var CubismModel = cubismmodel_1.Live2DCubismFramework.CubismModel;
var cubismdebug_1 = require("../utils/cubismdebug");
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var CubismMoc = (function () {
        function CubismMoc(moc) {
            this._moc = moc;
            this._modelCount = 0;
        }
        CubismMoc.create = function (mocBytes) {
            var cubismMoc = null;
            var moc = Live2DCubismCore.Moc.fromArrayBuffer(mocBytes);
            if (moc) {
                cubismMoc = new CubismMoc(moc);
            }
            return cubismMoc;
        };
        CubismMoc.delete = function (moc) {
            moc._moc._release();
            moc._moc = null;
            moc = null;
        };
        CubismMoc.prototype.createModel = function () {
            var cubismModel = null;
            var model = Live2DCubismCore.Model.fromMoc(this._moc);
            if (model) {
                cubismModel = new CubismModel(model);
                cubismModel.initialize();
                ++this._modelCount;
            }
            return cubismModel;
        };
        CubismMoc.prototype.deleteModel = function (model) {
            if (model != null) {
                model.release();
                model = null;
                --this._modelCount;
            }
        };
        CubismMoc.prototype.release = function () {
            cubismdebug_1.CSM_ASSERT(this._modelCount == 0);
            this._moc._release();
            this._moc = null;
        };
        return CubismMoc;
    }());
    Live2DCubismFramework.CubismMoc = CubismMoc;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmoc.js.map