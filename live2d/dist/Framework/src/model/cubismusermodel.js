"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = void 0;
var live2dcubismframework_1 = require("../live2dcubismframework");
var cubismmotionmanager_1 = require("../motion/cubismmotionmanager");
var cubismtargetpoint_1 = require("../math/cubismtargetpoint");
var cubismmodelmatrix_1 = require("../math/cubismmodelmatrix");
var cubismmoc_1 = require("./cubismmoc");
var cubismmotion_1 = require("../motion/cubismmotion");
var cubismexpressionmotion_1 = require("../motion/cubismexpressionmotion");
var cubismpose_1 = require("../effect/cubismpose");
var cubismmodeluserdata_1 = require("./cubismmodeluserdata");
var cubismphysics_1 = require("../physics/cubismphysics");
var cubismbreath_1 = require("../effect/cubismbreath");
var cubismeyeblink_1 = require("../effect/cubismeyeblink");
var cubismrenderer_webgl_1 = require("../rendering/cubismrenderer_webgl");
var cubismdebug_1 = require("../utils/cubismdebug");
var CubismRenderer_WebGL = cubismrenderer_webgl_1.Live2DCubismFramework.CubismRenderer_WebGL;
var CubismEyeBlink = cubismeyeblink_1.Live2DCubismFramework.CubismEyeBlink;
var CubismBreath = cubismbreath_1.Live2DCubismFramework.CubismBreath;
var Constant = live2dcubismframework_1.Live2DCubismFramework.Constant;
var CubismPhysics = cubismphysics_1.Live2DCubismFramework.CubismPhysics;
var CubismModelUserData = cubismmodeluserdata_1.Live2DCubismFramework.CubismModelUserData;
var CubismPose = cubismpose_1.Live2DCubismFramework.CubismPose;
var CubismExpressionMotion = cubismexpressionmotion_1.Live2DCubismFramework.CubismExpressionMotion;
var CubismMotion = cubismmotion_1.Live2DCubismFramework.CubismMotion;
var CubismMoc = cubismmoc_1.Live2DCubismFramework.CubismMoc;
var CubismModelMatrix = cubismmodelmatrix_1.Live2DCubismFramework.CubismModelMatrix;
var CubismTargetPoint = cubismtargetpoint_1.Live2DCubismFramework.CubismTargetPoint;
var CubismMotionManager = cubismmotionmanager_1.Live2DCubismFramework.CubismMotionManager;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var CubismUserModel = (function () {
        function CubismUserModel() {
            this.loadMotion = function (buffer, size, name, onFinishedMotionHandler) { return CubismMotion.create(buffer, size, onFinishedMotionHandler); };
            this._moc = null;
            this._model = null;
            this._motionManager = null;
            this._expressionManager = null;
            this._eyeBlink = null;
            this._breath = null;
            this._modelMatrix = null;
            this._pose = null;
            this._dragManager = null;
            this._physics = null;
            this._modelUserData = null;
            this._initialized = false;
            this._updating = false;
            this._opacity = 1.0;
            this._lipsync = true;
            this._lastLipSyncValue = 0.0;
            this._dragX = 0.0;
            this._dragY = 0.0;
            this._accelerationX = 0.0;
            this._accelerationY = 0.0;
            this._accelerationZ = 0.0;
            this._debugMode = false;
            this._renderer = null;
            this._motionManager = new CubismMotionManager();
            this._motionManager.setEventCallback(CubismUserModel.cubismDefaultMotionEventCallback, this);
            this._expressionManager = new CubismMotionManager();
            this._dragManager = new CubismTargetPoint();
        }
        CubismUserModel.prototype.isInitialized = function () {
            return this._initialized;
        };
        CubismUserModel.prototype.setInitialized = function (v) {
            this._initialized = v;
        };
        CubismUserModel.prototype.isUpdating = function () {
            return this._updating;
        };
        CubismUserModel.prototype.setUpdating = function (v) {
            this._updating = v;
        };
        CubismUserModel.prototype.setDragging = function (x, y) {
            this._dragManager.set(x, y);
        };
        CubismUserModel.prototype.setAcceleration = function (x, y, z) {
            this._accelerationX = x;
            this._accelerationY = y;
            this._accelerationZ = z;
        };
        CubismUserModel.prototype.getModelMatrix = function () {
            return this._modelMatrix;
        };
        CubismUserModel.prototype.setOpacity = function (a) {
            this._opacity = a;
        };
        CubismUserModel.prototype.getOpacity = function () {
            return this._opacity;
        };
        CubismUserModel.prototype.loadModel = function (buffer) {
            this._moc = CubismMoc.create(buffer);
            this._model = this._moc.createModel();
            this._model.saveParameters();
            if (this._moc == null || this._model == null) {
                cubismdebug_1.CubismLogError('Failed to CreateModel().');
                return;
            }
            this._modelMatrix = new CubismModelMatrix(this._model.getCanvasWidth(), this._model.getCanvasHeight());
        };
        CubismUserModel.prototype.loadExpression = function (buffer, size, name) {
            return CubismExpressionMotion.create(buffer, size);
        };
        CubismUserModel.prototype.loadPose = function (buffer, size) {
            this._pose = CubismPose.create(buffer, size);
        };
        CubismUserModel.prototype.loadUserData = function (buffer, size) {
            this._modelUserData = CubismModelUserData.create(buffer, size);
        };
        CubismUserModel.prototype.loadPhysics = function (buffer, size) {
            this._physics = CubismPhysics.create(buffer, size);
        };
        CubismUserModel.prototype.isHit = function (drawableId, pointX, pointY) {
            var drawIndex = this._model.getDrawableIndex(drawableId);
            if (drawIndex < 0) {
                return false;
            }
            var count = this._model.getDrawableVertexCount(drawIndex);
            var vertices = this._model.getDrawableVertices(drawIndex);
            var left = vertices[0];
            var right = vertices[0];
            var top = vertices[1];
            var bottom = vertices[1];
            for (var j = 1; j < count; ++j) {
                var x = vertices[Constant.vertexOffset + j * Constant.vertexStep];
                var y = vertices[Constant.vertexOffset + j * Constant.vertexStep + 1];
                if (x < left) {
                    left = x;
                }
                if (x > right) {
                    right = x;
                }
                if (y < top) {
                    top = y;
                }
                if (y > bottom) {
                    bottom = y;
                }
            }
            var tx = this._modelMatrix.invertTransformX(pointX);
            var ty = this._modelMatrix.invertTransformY(pointY);
            return left <= tx && tx <= right && top <= ty && ty <= bottom;
        };
        CubismUserModel.prototype.getModel = function () {
            return this._model;
        };
        CubismUserModel.prototype.getRenderer = function () {
            return this._renderer;
        };
        CubismUserModel.prototype.createRenderer = function () {
            if (this._renderer) {
                this.deleteRenderer();
            }
            this._renderer = new CubismRenderer_WebGL();
            this._renderer.initialize(this._model);
        };
        CubismUserModel.prototype.deleteRenderer = function () {
            if (this._renderer != null) {
                this._renderer.release();
                this._renderer = null;
            }
        };
        CubismUserModel.prototype.motionEventFired = function (eventValue) {
            cubismdebug_1.CubismLogInfo('{0}', eventValue.s);
        };
        CubismUserModel.cubismDefaultMotionEventCallback = function (caller, eventValue, customData) {
            var model = customData;
            if (model != null) {
                model.motionEventFired(eventValue);
            }
        };
        CubismUserModel.prototype.release = function () {
            if (this._motionManager != null) {
                this._motionManager.release();
                this._motionManager = null;
            }
            if (this._expressionManager != null) {
                this._expressionManager.release();
                this._expressionManager = null;
            }
            if (this._moc != null) {
                this._moc.deleteModel(this._model);
                this._moc.release();
                this._moc = null;
            }
            this._modelMatrix = null;
            CubismPose.delete(this._pose);
            CubismEyeBlink.delete(this._eyeBlink);
            CubismBreath.delete(this._breath);
            this._dragManager = null;
            CubismPhysics.delete(this._physics);
            CubismModelUserData.delete(this._modelUserData);
            this.deleteRenderer();
        };
        return CubismUserModel;
    }());
    Live2DCubismFramework.CubismUserModel = CubismUserModel;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismusermodel.js.map