/// live2dModel

function L2DBaseModel() {
    this.live2DModel = null;
    this.modelMatrix = null;
    this.eyeBlink = null;
    this.physics = null;
    this.pose = null;
    this.debugMode = false;
    this.initialized = false;
    this.updating = false;
    this.alpha = 1;
    this.accAlpha = 0;
    this.lipSync = false;
    this.lipSyncValue = 0;
    this.accelX = 0;
    this.accelY = 0;
    this.accelZ = 0;
    this.dragX = 0;
    this.dragY = 0;
    this.startTimeMSec = null;
    this.mainMotionManager = new L2DMotionManager();
    this.expressionManager = new L2DMotionManager();
    this.motions = {};
    this.expressions = {};
    this.isTexLoaded = false
}

var texCounter = 0;
L2DBaseModel.prototype.getModelMatrix = function () {
    return this.modelMatrix
}
L2DBaseModel.prototype.setAlpha = function (a) {
    if (a > 0.999) a = 1;
    if (a < 0.001) a = 0;
    this.alpha = a
}
L2DBaseModel.prototype.getAlpha = function () {
    return this.alpha
}
L2DBaseModel.prototype.isInitialized = function () {
    return this.initialized
}
L2DBaseModel.prototype.setInitialized = function (v) {
    this.initialized = v
}
L2DBaseModel.prototype.isUpdating = function () {
    return this.updating
}
L2DBaseModel.prototype.setUpdating = function (v) {
    this.updating = v
}
L2DBaseModel.prototype.getLive2DModel = function () {
    return this.live2DModel
}
L2DBaseModel.prototype.setLipSync = function (v) {
    this.lipSync = v
}
L2DBaseModel.prototype.setLipSyncValue = function (v) {
    this.lipSyncValue = v
}
L2DBaseModel.prototype.setAccel = function (x, y, z) {
    this.accelX = x;
    this.accelY = y;
    this.accelZ = z
}
L2DBaseModel.prototype.setDrag = function (x, y) {
    this.dragX = x;
    this.dragY = y
}
L2DBaseModel.prototype.getMainMotionManager = function () {
    return this.mainMotionManager
}
L2DBaseModel.prototype.getExpressionManager = function () {
    return this.expressionManager
}
L2DBaseModel.prototype.loadModelData = function (path, callback) {
    var pm = Live2DFramework.getPlatformManager();
    if (this.debugMode) pm.log("Load model : " + path);
    var thisRef = this;
    pm.loadLive2DModel(path, function (l2dModel) {
        thisRef.live2DModel = l2dModel;
        thisRef.live2DModel.saveParam();
        var _err = Live2D.getError();
        if (_err != 0) {
            console.error("Error : Failed to loadModelData().");
            return
        }
        thisRef.modelMatrix = new L2DModelMatrix(thisRef.live2DModel.getCanvasWidth(), thisRef.live2DModel.getCanvasHeight());
        thisRef.modelMatrix.setWidth(2);
        thisRef.modelMatrix.setCenterPosition(0, 0);
        callback(thisRef.live2DModel)
    })
}
L2DBaseModel.prototype.loadTexture = function (no, path, callback) {
    texCounter++;
    var pm = Live2DFramework.getPlatformManager();
    if (this.debugMode) pm.log("Load Texture : " + path);
    var thisRef = this;
    pm.loadTexture(this.live2DModel, no, path, function () {
        texCounter--;
        if (texCounter == 0) thisRef.isTexLoaded = true;
        if (typeof callback == "function") callback()
    })
}
L2DBaseModel.prototype.loadMotion = function (name, path, callback) {
    var pm = Live2DFramework.getPlatformManager();
    if (this.debugMode) pm.log("Load Motion : " + path);
    var motion = null;
    var thisRef = this;
    pm.loadBytes(path, function (buf) {
        motion = Live2DMotion.loadMotion(buf);
        if (name != null) {
            thisRef.motions[name] = motion
        }
        callback(motion)
    })
}
L2DBaseModel.prototype.loadExpression = function (name, path, callback) {
    var pm = Live2DFramework.getPlatformManager();
    if (this.debugMode) pm.log("Load Expression : " + path);
    var thisRef = this;
    pm.loadBytes(path, function (buf) {
        if (name != null) {
            thisRef.expressions[name] = L2DExpressionMotion.loadJson(buf)
        }
        if (typeof callback == "function") callback()
    })
}
L2DBaseModel.prototype.loadPose = function (path, callback) {
    var pm = Live2DFramework.getPlatformManager();
    if (this.debugMode) pm.log("Load Pose : " + path);
    var thisRef = this;
    try {
        pm.loadBytes(path, function (buf) {
            thisRef.pose = L2DPose.load(buf);
            if (typeof callback == "function") callback()
        })
    } catch (e) {
        console.warn(e)
    }
}
L2DBaseModel.prototype.loadPhysics = function (path) {
    var pm = Live2DFramework.getPlatformManager();
    if (this.debugMode) pm.log("Load Physics : " + path);
    var thisRef = this;
    try {
        pm.loadBytes(path, function (buf) {
            thisRef.physics = L2DPhysics.load(buf)
        })
    } catch (e) {
        console.warn(e)
    }
}
L2DBaseModel.prototype.hitTestSimple = function (drawID, testX, testY) {
    var drawIndex = this.live2DModel.getDrawDataIndex(drawID);
    if (drawIndex < 0) return false;
    var points = this.live2DModel.getTransformedPoints(drawIndex);
    var left = this.live2DModel.getCanvasWidth();
    var right = 0;
    var top = this.live2DModel.getCanvasHeight();
    var bottom = 0;
    for (var j = 0; j < points.length; j = j + 2) {
        var x = points[j];
        var y = points[j + 1];
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y
    }
    var tx = this.modelMatrix.invertTransformX(testX);
    var ty = this.modelMatrix.invertTransformY(testY);
    return (left <= tx && tx <= right && top <= ty && ty <= bottom)
}


/// L2DExpressionMotion

function L2DExpressionMotion() {
    AMotion.prototype.constructor.call(this);
    this.paramList = new Array()
}

L2DExpressionMotion.prototype = new AMotion();
L2DExpressionMotion.EXPRESSION_DEFAULT = "DEFAULT";
L2DExpressionMotion.TYPE_SET = 0;
L2DExpressionMotion.TYPE_ADD = 1;
L2DExpressionMotion.TYPE_MULT = 2;
L2DExpressionMotion.loadJson = function (buf) {
    var ret = new L2DExpressionMotion();
    var pm = Live2DFramework.getPlatformManager();
    var json = pm.jsonParseFromBytes(buf);
    ret.setFadeIn(parseInt(json.fade_in) > 0 ? parseInt(json.fade_in) : 1000);
    ret.setFadeOut(parseInt(json.fade_out) > 0 ? parseInt(json.fade_out) : 1000);
    if (json.params == null) {
        return ret
    }
    var params = json.params;
    var paramNum = params.length;
    ret.paramList = [];
    for (var i = 0; i < paramNum; i++) {
        var param = params[i];
        var paramID = param.id.toString();
        var value = parseFloat(param.val);
        var calcTypeInt = L2DExpressionMotion.TYPE_ADD;
        var calc = param.calc != null ? param.calc.toString() : "add";
        if (calc === "add") {
            calcTypeInt = L2DExpressionMotion.TYPE_ADD
        } else if (calc === "mult") {
            calcTypeInt = L2DExpressionMotion.TYPE_MULT
        } else if (calc === "set") {
            calcTypeInt = L2DExpressionMotion.TYPE_SET
        } else {
            calcTypeInt = L2DExpressionMotion.TYPE_ADD
        }
        if (calcTypeInt == L2DExpressionMotion.TYPE_ADD) {
            var defaultValue = param.def == null ? 0 : parseFloat(param.def);
            value = value - defaultValue
        } else if (calcTypeInt == L2DExpressionMotion.TYPE_MULT) {
            var defaultValue = param.def == null ? 1 : parseFloat(param.def);
            if (defaultValue == 0) defaultValue = 1;
            value = value / defaultValue
        }
        var item = new L2DExpressionParam();
        item.id = paramID;
        item.type = calcTypeInt;
        item.value = value;
        ret.paramList.push(item)
    }
    return ret
}
L2DExpressionMotion.prototype.updateParamExe = function (model, timeMSec, weight, motionQueueEnt) {
    for (var i = this.paramList.length - 1; i >= 0; --i) {
        var param = this.paramList[i];
        if (param.type == L2DExpressionMotion.TYPE_ADD) {
            model.addToParamFloat(param.id, param.value, weight)
        } else if (param.type == L2DExpressionMotion.TYPE_MULT) {
            model.multParamFloat(param.id, param.value, weight)
        } else if (param.type == L2DExpressionMotion.TYPE_SET) {
            model.setParamFloat(param.id, param.value, weight)
        }
    }
}


function L2DExpressionParam() {
    this.id = "";
    this.type = -1;
    this.value = null
}

/// L2DEyeBlink

function L2DEyeBlink() {
    this.nextBlinkTime = null;
    this.stateStartTime = null;
    this.blinkIntervalMsec = null;
    this.eyeState = EYE_STATE.STATE_FIRST;
    this.blinkIntervalMsec = 4000;
    this.closingMotionMsec = 100;
    this.closedMotionMsec = 50;
    this.openingMotionMsec = 150;
    this.closeIfZero = true;
    this.eyeID_L = "PARAM_EYE_L_OPEN";
    this.eyeID_R = "PARAM_EYE_R_OPEN"
}

L2DEyeBlink.prototype.calcNextBlink = function () {
    var time = UtSystem.getUserTimeMSec();
    var r = Math.random();
    return (time + r * (2 * this.blinkIntervalMsec - 1))
}
L2DEyeBlink.prototype.setInterval = function (blinkIntervalMsec) {
    this.blinkIntervalMsec = blinkIntervalMsec
}
L2DEyeBlink.prototype.setEyeMotion = function (closingMotionMsec, closedMotionMsec, openingMotionMsec) {
    this.closingMotionMsec = closingMotionMsec;
    this.closedMotionMsec = closedMotionMsec;
    this.openingMotionMsec = openingMotionMsec
}
L2DEyeBlink.prototype.updateParam = function (model) {
    var time = UtSystem.getUserTimeMSec();
    var eyeParamValue;
    var t = 0;
    switch (this.eyeState) {
        case EYE_STATE.STATE_CLOSING:
            t = (time - this.stateStartTime) / this.closingMotionMsec;
            if (t >= 1) {
                t = 1;
                this.eyeState = EYE_STATE.STATE_CLOSED;
                this.stateStartTime = time
            }
            eyeParamValue = 1 - t;
            break;
        case EYE_STATE.STATE_CLOSED:
            t = (time - this.stateStartTime) / this.closedMotionMsec;
            if (t >= 1) {
                this.eyeState = EYE_STATE.STATE_OPENING;
                this.stateStartTime = time
            }
            eyeParamValue = 0;
            break;
        case EYE_STATE.STATE_OPENING:
            t = (time - this.stateStartTime) / this.openingMotionMsec;
            if (t >= 1) {
                t = 1;
                this.eyeState = EYE_STATE.STATE_INTERVAL;
                this.nextBlinkTime = this.calcNextBlink()
            }
            eyeParamValue = t;
            break;
        case EYE_STATE.STATE_INTERVAL:
            if (this.nextBlinkTime < time) {
                this.eyeState = EYE_STATE.STATE_CLOSING;
                this.stateStartTime = time
            }
            eyeParamValue = 1;
            break;
        case EYE_STATE.STATE_FIRST:
        default:
            this.eyeState = EYE_STATE.STATE_INTERVAL;
            this.nextBlinkTime = this.calcNextBlink();
            eyeParamValue = 1;
            break
    }
    if (!this.closeIfZero) eyeParamValue = -eyeParamValue;
    model.setParamFloat(this.eyeID_L, eyeParamValue);
    model.setParamFloat(this.eyeID_R, eyeParamValue)
}
var EYE_STATE = function () {
};
EYE_STATE.STATE_FIRST = "STATE_FIRST"
EYE_STATE.STATE_INTERVAL = "STATE_INTERVAL"
EYE_STATE.STATE_CLOSING = "STATE_CLOSING"
EYE_STATE.STATE_CLOSED = "STATE_CLOSED"
EYE_STATE.STATE_OPENING = "STATE_OPENING"


/// L2DMatrix44

export function L2DMatrix44() {
    this.tr = new Float32Array(16);
    this.identity()
}

L2DMatrix44.mul = function (a, b, dst) {
    var c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var n = 4;
    var i, j, k;
    for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
            for (k = 0; k < n; k++) {
                c[i + j * 4] += a[i + k * 4] * b[k + j * 4]
            }
        }
    }
    for (i = 0; i < 16; i++) {
        dst[i] = c[i]
    }
}
L2DMatrix44.prototype.identity = function () {
    for (var i = 0; i < 16; i++) this.tr[i] = ((i % 5) == 0) ? 1 : 0
}
L2DMatrix44.prototype.getArray = function () {
    return this.tr
}
L2DMatrix44.prototype.getCopyMatrix = function () {
    return new Float32Array(this.tr)
}
L2DMatrix44.prototype.setMatrix = function (tr) {
    if (this.tr == null || this.tr.length != this.tr.length) return;
    for (var i = 0; i < 16; i++) this.tr[i] = tr[i]
}
L2DMatrix44.prototype.getScaleX = function () {
    return this.tr[0]
}
L2DMatrix44.prototype.getScaleY = function () {
    return this.tr[5]
}
L2DMatrix44.prototype.transformX = function (src) {
    return this.tr[0] * src + this.tr[12]
}
L2DMatrix44.prototype.transformY = function (src) {
    return this.tr[5] * src + this.tr[13]
}
L2DMatrix44.prototype.invertTransformX = function (src) {
    return (src - this.tr[12]) / this.tr[0]
}
L2DMatrix44.prototype.invertTransformY = function (src) {
    return (src - this.tr[13]) / this.tr[5]
}
L2DMatrix44.prototype.multTranslate = function (shiftX, shiftY) {
    var tr1 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, shiftX, shiftY, 0, 1];
    L2DMatrix44.mul(tr1, this.tr, this.tr)
}
L2DMatrix44.prototype.translate = function (x, y) {
    this.tr[12] = x;
    this.tr[13] = y
}
L2DMatrix44.prototype.translateX = function (x) {
    this.tr[12] = x
}
L2DMatrix44.prototype.translateY = function (y) {
    this.tr[13] = y
}
L2DMatrix44.prototype.multScale = function (scaleX, scaleY) {
    var tr1 = [scaleX, 0, 0, 0, 0, scaleY, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    L2DMatrix44.mul(tr1, this.tr, this.tr)
}
L2DMatrix44.prototype.scale = function (scaleX, scaleY) {
    this.tr[0] = scaleX;
    this.tr[5] = scaleY
}


/// L2DModelMatrix

function L2DModelMatrix(w, h) {
    L2DMatrix44.prototype.constructor.call(this);
    this.width = w;
    this.height = h
}

L2DModelMatrix.prototype = new L2DMatrix44();
L2DModelMatrix.prototype.setPosition = function (x, y) {
    this.translate(x, y)
}
L2DModelMatrix.prototype.setCenterPosition = function (x, y) {
    var w = this.width * this.getScaleX();
    var h = this.height * this.getScaleY();
    this.translate(x - w / 2, y - h / 2)
}
L2DModelMatrix.prototype.top = function (y) {
    this.setY(y)
}
L2DModelMatrix.prototype.bottom = function (y) {
    var h = this.height * this.getScaleY();
    this.translateY(y - h)
}
L2DModelMatrix.prototype.left = function (x) {
    this.setX(x)
}
L2DModelMatrix.prototype.right = function (x) {
    var w = this.width * this.getScaleX();
    this.translateX(x - w)
}
L2DModelMatrix.prototype.centerX = function (x) {
    var w = this.width * this.getScaleX();
    this.translateX(x - w / 2)
}
L2DModelMatrix.prototype.centerY = function (y) {
    var h = this.height * this.getScaleY();
    this.translateY(y - h / 2)
}
L2DModelMatrix.prototype.setX = function (x) {
    this.translateX(x)
}
L2DModelMatrix.prototype.setY = function (y) {
    this.translateY(y)
}
L2DModelMatrix.prototype.setHeight = function (h) {
    var scaleX = h / this.height;
    var scaleY = -scaleX;
    this.scale(scaleX, scaleY)
}
L2DModelMatrix.prototype.setWidth = function (w) {
    var scaleX = w / this.width;
    var scaleY = -scaleX;
    this.scale(scaleX, scaleY)
}

/// L2DMotionManager

function L2DMotionManager() {
    MotionQueueManager.prototype.constructor.call(this);
    this.currentPriority = null;
    this.reservePriority = null;
    this.super = MotionQueueManager.prototype
}

L2DMotionManager.prototype = new MotionQueueManager();
L2DMotionManager.prototype.getCurrentPriority = function () {
    return this.currentPriority
}
L2DMotionManager.prototype.getReservePriority = function () {
    return this.reservePriority
}
L2DMotionManager.prototype.reserveMotion = function (priority) {
    if (this.reservePriority >= priority) {
        return false
    }
    if (this.currentPriority >= priority) {
        return false
    }
    this.reservePriority = priority;
    return true
}
L2DMotionManager.prototype.setReservePriority = function (val) {
    this.reservePriority = val
}
L2DMotionManager.prototype.updateParam = function (model) {
    var updated = MotionQueueManager.prototype.updateParam.call(this, model);
    if (this.isFinished()) {
        this.currentPriority = 0
    }
    return updated
}
L2DMotionManager.prototype.startMotionPrio = function (motion, priority) {
    if (priority == this.reservePriority) {
        this.reservePriority = 0
    }
    this.currentPriority = priority;
    return this.startMotion(motion, false)
}


/// L2DPhysics

function L2DPhysics() {
    this.physicsList = new Array();
    this.startTimeMSec = UtSystem.getUserTimeMSec()
}

L2DPhysics.load = function (buf) {
    var ret = new L2DPhysics();
    var pm = Live2DFramework.getPlatformManager();
    var json = pm.jsonParseFromBytes(buf);
    var params = json.physics_hair;
    var paramNum = params.length;
    for (var i = 0; i < paramNum; i++) {
        var param = params[i];
        var physics = new PhysicsHair();
        var setup = param.setup;
        var length = parseFloat(setup.length);
        var resist = parseFloat(setup.regist);
        var mass = parseFloat(setup.mass);
        physics.setup(length, resist, mass);
        var srcList = param.src;
        var srcNum = srcList.length;
        for (var j = 0; j < srcNum; j++) {
            var src = srcList[j];
            var id = src.id;
            var type = PhysicsHair.Src.SRC_TO_X;
            var typeStr = src.ptype;
            if (typeStr === "x") {
                type = PhysicsHair.Src.SRC_TO_X
            } else if (typeStr === "y") {
                type = PhysicsHair.Src.SRC_TO_Y
            } else if (typeStr === "angle") {
                type = PhysicsHair.Src.SRC_TO_G_ANGLE
            } else {
                UtDebug.error("live2d", "Invalid parameter:PhysicsHair.Src")
            }
            var scale = parseFloat(src.scale);
            var weight = parseFloat(src.weight);
            physics.addSrcParam(type, id, scale, weight)
        }
        var targetList = param.targets;
        var targetNum = targetList.length;
        for (var j = 0; j < targetNum; j++) {
            var target = targetList[j];
            var id = target.id;
            var type = PhysicsHair.Target.TARGET_FROM_ANGLE;
            var typeStr = target.ptype;
            if (typeStr === "angle") {
                type = PhysicsHair.Target.TARGET_FROM_ANGLE
            } else if (typeStr === "angle_v") {
                type = PhysicsHair.Target.TARGET_FROM_ANGLE_V
            } else {
                UtDebug.error("live2d", "Invalid parameter:PhysicsHair.Target")
            }
            var scale = parseFloat(target.scale);
            var weight = parseFloat(target.weight);
            physics.addTargetParam(type, id, scale, weight)
        }
        ret.physicsList.push(physics)
    }
    return ret
}
L2DPhysics.prototype.updateParam = function (model) {
    var timeMSec = UtSystem.getUserTimeMSec() - this.startTimeMSec;
    for (var i = 0; i < this.physicsList.length; i++) {
        this.physicsList[i].update(model, timeMSec)
    }
}


/// L2DPose

function L2DPose() {
    this.lastTime = 0;
    this.lastModel = null;
    this.partsGroups = new Array()
}

L2DPose.load = function (buf) {
    var ret = new L2DPose();
    var pm = Live2DFramework.getPlatformManager();
    var json = pm.jsonParseFromBytes(buf);
    var poseListInfo = json.parts_visible;
    var poseNum = poseListInfo.length;
    for (var i_pose = 0; i_pose < poseNum; i_pose++) {
        var poseInfo = poseListInfo[i_pose];
        var idListInfo = poseInfo.group;
        var idNum = idListInfo.length;
        var partsGroup = new Array();
        for (var i_group = 0; i_group < idNum; i_group++) {
            var partsInfo = idListInfo[i_group];
            var parts = new L2DPartsParam(partsInfo.id);
            partsGroup[i_group] = parts;
            if (partsInfo.link == null) continue;
            var linkListInfo = partsInfo.link;
            var linkNum = linkListInfo.length;
            parts.link = new Array();
            for (var i_link = 0; i_link < linkNum; i_link++) {
                var linkParts = new L2DPartsParam(linkListInfo[i_link]);
                parts.link.push(linkParts)
            }
        }
        ret.partsGroups.push(partsGroup)
    }
    return ret
}
L2DPose.prototype.updateParam = function (model) {
    if (model == null) return;
    if (!(model == this.lastModel)) {
        this.initParam(model)
    }
    this.lastModel = model;
    var curTime = UtSystem.getUserTimeMSec();
    var deltaTimeSec = ((this.lastTime == 0) ? 0 : (curTime - this.lastTime) / 1000.0);
    this.lastTime = curTime;
    if (deltaTimeSec < 0) deltaTimeSec = 0;
    for (var i = 0; i < this.partsGroups.length; i++) {
        this.normalizePartsOpacityGroup(model, this.partsGroups[i], deltaTimeSec);
        this.copyOpacityOtherParts(model, this.partsGroups[i])
    }
}
L2DPose.prototype.initParam = function (model) {
    if (model == null) return;
    for (var i = 0; i < this.partsGroups.length; i++) {
        var partsGroup = this.partsGroups[i];
        for (var j = 0; j < partsGroup.length; j++) {
            partsGroup[j].initIndex(model);
            var partsIndex = partsGroup[j].partsIndex;
            var paramIndex = partsGroup[j].paramIndex;
            if (partsIndex < 0) continue;
            var v = (model.getParamFloat(paramIndex) != 0);
            model.setPartsOpacity(partsIndex, (v ? 1.0 : 0.0));
            model.setParamFloat(paramIndex, (v ? 1.0 : 0.0));
            if (partsGroup[j].link == null) continue;
            for (var k = 0; k < partsGroup[j].link.length; k++) {
                partsGroup[j].link[k].initIndex(model)
            }
        }
    }
}
L2DPose.prototype.normalizePartsOpacityGroup = function (model, partsGroup, deltaTimeSec) {
    var visibleParts = -1;
    var visibleOpacity = 1.0;
    var CLEAR_TIME_SEC = 0.5;
    var phi = 0.5;
    var maxBackOpacity = 0.15;
    for (var i = 0; i < partsGroup.length; i++) {
        var partsIndex = partsGroup[i].partsIndex;
        var paramIndex = partsGroup[i].paramIndex;
        if (partsIndex < 0) continue;
        if (model.getParamFloat(paramIndex) != 0) {
            if (visibleParts >= 0) {
                break
            }
            visibleParts = i;
            visibleOpacity = model.getPartsOpacity(partsIndex);
            visibleOpacity += deltaTimeSec / CLEAR_TIME_SEC;
            if (visibleOpacity > 1) {
                visibleOpacity = 1
            }
        }
    }
    if (visibleParts < 0) {
        visibleParts = 0;
        visibleOpacity = 1
    }
    for (var i = 0; i < partsGroup.length; i++) {
        var partsIndex = partsGroup[i].partsIndex;
        if (partsIndex < 0) continue;
        if (visibleParts == i) {
            model.setPartsOpacity(partsIndex, visibleOpacity)
        } else {
            var opacity = model.getPartsOpacity(partsIndex);
            var a1;
            if (visibleOpacity < phi) {
                a1 = visibleOpacity * (phi - 1) / phi + 1
            } else {
                a1 = (1 - visibleOpacity) * phi / (1 - phi)
            }
            var backOp = (1 - a1) * (1 - visibleOpacity);
            if (backOp > maxBackOpacity) {
                a1 = 1 - maxBackOpacity / (1 - visibleOpacity)
            }
            if (opacity > a1) {
                opacity = a1
            }
            model.setPartsOpacity(partsIndex, opacity)
        }
    }
}
L2DPose.prototype.copyOpacityOtherParts = function (model, partsGroup) {
    for (var i_group = 0; i_group < partsGroup.length; i_group++) {
        var partsParam = partsGroup[i_group];
        if (partsParam.link == null) continue;
        if (partsParam.partsIndex < 0) continue;
        var opacity = model.getPartsOpacity(partsParam.partsIndex);
        for (var i_link = 0; i_link < partsParam.link.length; i_link++) {
            var linkParts = partsParam.link[i_link];
            if (linkParts.partsIndex < 0) continue;
            model.setPartsOpacity(linkParts.partsIndex, opacity)
        }
    }
}


/// L2DPartsParam

function L2DPartsParam(id) {
    this.paramIndex = -1;
    this.partsIndex = -1;
    this.link = null;
    this.id = id
}

L2DPartsParam.prototype.initIndex = function (model) {
    this.paramIndex = model.getParamIndex("VISIBLE:" + this.id);
    this.partsIndex = model.getPartsDataIndex(PartsDataID.getID(this.id));
    model.setParamFloat(this.paramIndex, 1)
}


/// L2DTargetPoint

export function L2DTargetPoint() {
    this.EPSILON = 0.01;
    this.faceTargetX = 0;
    this.faceTargetY = 0;
    this.faceX = 0;
    this.faceY = 0;
    this.faceVX = 0;
    this.faceVY = 0;
    this.lastTimeSec = 0
}

L2DTargetPoint.FRAME_RATE = 30;
L2DTargetPoint.prototype.setPoint = function (x, y) {
    this.faceTargetX = x;
    this.faceTargetY = y
}
L2DTargetPoint.prototype.getX = function () {
    return this.faceX
}
L2DTargetPoint.prototype.getY = function () {
    return this.faceY
}
L2DTargetPoint.prototype.update = function () {
    var TIME_TO_MAX_SPEED = 0.15;
    var FACE_PARAM_MAX_V = 40.0 / 7.5;
    var MAX_V = FACE_PARAM_MAX_V / L2DTargetPoint.FRAME_RATE;
    if (this.lastTimeSec == 0) {
        this.lastTimeSec = UtSystem.getUserTimeMSec();
        return
    }
    var curTimeSec = UtSystem.getUserTimeMSec();
    var deltaTimeWeight = (curTimeSec - this.lastTimeSec) * L2DTargetPoint.FRAME_RATE / 1000.0;
    this.lastTimeSec = curTimeSec;
    var FRAME_TO_MAX_SPEED = TIME_TO_MAX_SPEED * L2DTargetPoint.FRAME_RATE;
    var MAX_A = deltaTimeWeight * MAX_V / FRAME_TO_MAX_SPEED;
    var dx = (this.faceTargetX - this.faceX);
    var dy = (this.faceTargetY - this.faceY);
    if (Math.abs(dx) <= this.EPSILON && Math.abs(dy) <= this.EPSILON) return;
    var d = Math.sqrt(dx * dx + dy * dy);
    var vx = MAX_V * dx / d;
    var vy = MAX_V * dy / d;
    var ax = vx - this.faceVX;
    var ay = vy - this.faceVY;
    var a = Math.sqrt(ax * ax + ay * ay);
    if (a < -MAX_A || a > MAX_A) {
        ax *= MAX_A / a;
        ay *= MAX_A / a;
        a = MAX_A
    }
    this.faceVX += ax;
    this.faceVY += ay;
    {
        var max_v = 0.5 * (Math.sqrt(MAX_A * MAX_A + 16 * MAX_A * d - 8 * MAX_A * d) - MAX_A);
        var cur_v = Math.sqrt(this.faceVX * this.faceVX + this.faceVY * this.faceVY);
        if (cur_v > max_v) {
            this.faceVX *= max_v / cur_v;
            this.faceVY *= max_v / cur_v
        }
    }
    this.faceX += this.faceVX;
    this.faceY += this.faceVY
}


/// L2DViewMatrix

export function L2DViewMatrix() {
    L2DMatrix44.prototype.constructor.call(this);
    this.screenLeft = null;
    this.screenRight = null;
    this.screenTop = null;
    this.screenBottom = null;
    this.maxLeft = null;
    this.maxRight = null;
    this.maxTop = null;
    this.maxBottom = null;
    this.max = Number.MAX_VALUE;
    this.min = 0
}

L2DViewMatrix.prototype = new L2DMatrix44();
L2DViewMatrix.prototype.getMaxScale = function () {
    return this.max
}
L2DViewMatrix.prototype.getMinScale = function () {
    return this.min
}
L2DViewMatrix.prototype.setMaxScale = function (v) {
    this.max = v
}
L2DViewMatrix.prototype.setMinScale = function (v) {
    this.min = v
}
L2DViewMatrix.prototype.isMaxScale = function () {
    return this.getScaleX() == this.max
}
L2DViewMatrix.prototype.isMinScale = function () {
    return this.getScaleX() == this.min
}
L2DViewMatrix.prototype.adjustTranslate = function (shiftX, shiftY) {
    if (this.tr[0] * this.maxLeft + (this.tr[12] + shiftX) > this.screenLeft) shiftX = this.screenLeft - this.tr[0] * this.maxLeft - this.tr[12];
    if (this.tr[0] * this.maxRight + (this.tr[12] + shiftX) < this.screenRight) shiftX = this.screenRight - this.tr[0] * this.maxRight - this.tr[12];
    if (this.tr[5] * this.maxTop + (this.tr[13] + shiftY) < this.screenTop) shiftY = this.screenTop - this.tr[5] * this.maxTop - this.tr[13];
    if (this.tr[5] * this.maxBottom + (this.tr[13] + shiftY) > this.screenBottom) shiftY = this.screenBottom - this.tr[5] * this.maxBottom - this.tr[13];
    var tr1 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, shiftX, shiftY, 0, 1];
    L2DMatrix44.mul(tr1, this.tr, this.tr)
}
L2DViewMatrix.prototype.adjustScale = function (cx, cy, scale) {
    var targetScale = scale * this.tr[0];
    if (targetScale < this.min) {
        if (this.tr[0] > 0) scale = this.min / this.tr[0]
    } else if (targetScale > this.max) {
        if (this.tr[0] > 0) scale = this.max / this.tr[0]
    }
    var tr1 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, cx, cy, 0, 1];
    var tr2 = [scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    var tr3 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -cx, -cy, 0, 1];
    L2DMatrix44.mul(tr3, this.tr, this.tr);
    L2DMatrix44.mul(tr2, this.tr, this.tr);
    L2DMatrix44.mul(tr1, this.tr, this.tr)
}
L2DViewMatrix.prototype.setScreenRect = function (left, right, bottom, top) {
    this.screenLeft = left;
    this.screenRight = right;
    this.screenTop = top;
    this.screenBottom = bottom
}
L2DViewMatrix.prototype.setMaxScreenRect = function (left, right, bottom, top) {
    this.maxLeft = left;
    this.maxRight = right;
    this.maxTop = top;
    this.maxBottom = bottom
}
L2DViewMatrix.prototype.getScreenLeft = function () {
    return this.screenLeft
}
L2DViewMatrix.prototype.getScreenRight = function () {
    return this.screenRight
}
L2DViewMatrix.prototype.getScreenBottom = function () {
    return this.screenBottom
}
L2DViewMatrix.prototype.getScreenTop = function () {
    return this.screenTop
}
L2DViewMatrix.prototype.getMaxLeft = function () {
    return this.maxLeft
}
L2DViewMatrix.prototype.getMaxRight = function () {
    return this.maxRight
}
L2DViewMatrix.prototype.getMaxBottom = function () {
    return this.maxBottom
}
L2DViewMatrix.prototype.getMaxTop = function () {
    return this.maxTop
}


/// Live2DFramework

function Live2DFramework() {
}

Live2DFramework.platformManager = null;
Live2DFramework.getPlatformManager = function () {
    return Live2DFramework.platformManager
}
Live2DFramework.setPlatformManager = function (platformManager) {
    Live2DFramework.platformManager = platformManager
}


/// MatrixStack

export function MatrixStack() {
}

MatrixStack.matrixStack = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
MatrixStack.depth = 0;
MatrixStack.currentMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
MatrixStack.tmp = new Array(16);
MatrixStack.reset = function () {
    this.depth = 0
}
MatrixStack.loadIdentity = function () {
    for (var i = 0; i < 16; i++) {
        this.currentMatrix[i] = (i % 5 == 0) ? 1 : 0
    }
}
MatrixStack.push = function () {
    var offset = this.depth * 16;
    var nextOffset = (this.depth + 1) * 16;
    if (this.matrixStack.length < nextOffset + 16) {
        this.matrixStack.length = nextOffset + 16
    }
    for (var i = 0; i < 16; i++) {
        this.matrixStack[nextOffset + i] = this.currentMatrix[i]
    }
    this.depth++
}
MatrixStack.pop = function () {
    this.depth--;
    if (this.depth < 0) {
        myError("Invalid matrix stack.");
        this.depth = 0
    }
    var offset = this.depth * 16;
    for (var i = 0; i < 16; i++) {
        this.currentMatrix[i] = this.matrixStack[offset + i]
    }
}
MatrixStack.getMatrix = function () {
    return this.currentMatrix
}
MatrixStack.multMatrix = function (matNew) {
    var i, j, k;
    for (i = 0; i < 16; i++) {
        this.tmp[i] = 0
    }
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            for (k = 0; k < 4; k++) {
                this.tmp[i + j * 4] += this.currentMatrix[i + k * 4] * matNew[k + j * 4]
            }
        }
    }
    for (i = 0; i < 16; i++) {
        this.currentMatrix[i] = this.tmp[i]
    }
}


/// ModelSettingJson

function ModelSettingJson() {
    this.NAME = "name";
    this.ID = "id";
    this.MODEL = "model";
    this.TEXTURES = "textures";
    this.HIT_AREAS = "hit_areas";
    this.PHYSICS = "physics";
    this.POSE = "pose";
    this.EXPRESSIONS = "expressions";
    this.MOTION_GROUPS = "motions";
    this.SOUND = "sound";
    this.FADE_IN = "fade_in";
    this.FADE_OUT = "fade_out";
    this.LAYOUT = "layout";
    this.INIT_PARAM = "init_param";
    this.INIT_PARTS_VISIBLE = "init_parts_visible";
    this.VALUE = "val";
    this.FILE = "file";
    this.json = {}
}

ModelSettingJson.prototype.loadModelSetting = function (path, callback) {
    var thisRef = this;

    var pm = Live2DFramework.getPlatformManager();
    pm.loadBytes(path, function (buf) {
        var str = String.fromCharCode.apply(null, new Uint8Array(buf));
        thisRef.json = JSON.parse(str);
        callback()
    })
};
ModelSettingJson.prototype.getTextureFile = function (n) {
    if (this.json[this.TEXTURES] == null || this.json[this.TEXTURES][n] == null) return null;
    return this.json[this.TEXTURES][n]
}
ModelSettingJson.prototype.getModelFile = function () {
    return this.json[this.MODEL]
};
ModelSettingJson.prototype.getTextureNum = function () {
    if (this.json[this.TEXTURES] == null) return 0;
    return this.json[this.TEXTURES].length
}
ModelSettingJson.prototype.getHitAreaNum = function () {
    if (this.json[this.HIT_AREAS] == null) return 0;
    return this.json[this.HIT_AREAS].length
}
ModelSettingJson.prototype.getHitAreaID = function (n) {
    if (this.json[this.HIT_AREAS] == null || this.json[this.HIT_AREAS][n] == null) return null;
    return this.json[this.HIT_AREAS][n][this.ID]
}
ModelSettingJson.prototype.getHitAreaName = function (n) {
    if (this.json[this.HIT_AREAS] == null || this.json[this.HIT_AREAS][n] == null) return null;
    return this.json[this.HIT_AREAS][n][this.NAME]
}
ModelSettingJson.prototype.getPhysicsFile = function () {
    return this.json[this.PHYSICS]
}
ModelSettingJson.prototype.getPoseFile = function () {
    return this.json[this.POSE]
}
ModelSettingJson.prototype.getExpressionNum = function () {
    return (this.json[this.EXPRESSIONS] == null) ? 0 : this.json[this.EXPRESSIONS].length
}
ModelSettingJson.prototype.getExpressionFile = function (n) {
    if (this.json[this.EXPRESSIONS] == null) return null;
    return this.json[this.EXPRESSIONS][n][this.FILE]
}
ModelSettingJson.prototype.getExpressionName = function (n) {
    if (this.json[this.EXPRESSIONS] == null) return null;
    return this.json[this.EXPRESSIONS][n][this.NAME]
}
ModelSettingJson.prototype.getLayout = function () {
    return this.json[this.LAYOUT]
}
ModelSettingJson.prototype.getInitParamNum = function () {
    return (this.json[this.INIT_PARAM] == null) ? 0 : this.json[this.INIT_PARAM].length
}
ModelSettingJson.prototype.getMotionNum = function (name) {
    if (this.json[this.MOTION_GROUPS] == null || this.json[this.MOTION_GROUPS][name] == null) return 0;
    return this.json[this.MOTION_GROUPS][name].length
}
ModelSettingJson.prototype.getMotionFile = function (name, n) {
    if (this.json[this.MOTION_GROUPS] == null || this.json[this.MOTION_GROUPS][name] == null || this.json[this.MOTION_GROUPS][name][n] == null) return null;
    return this.json[this.MOTION_GROUPS][name][n][this.FILE]
}
ModelSettingJson.prototype.getMotionSound = function (name, n) {
    if (this.json[this.MOTION_GROUPS] == null || this.json[this.MOTION_GROUPS][name] == null || this.json[this.MOTION_GROUPS][name][n] == null || this.json[this.MOTION_GROUPS][name][n][this.SOUND] == null) return null;
    return this.json[this.MOTION_GROUPS][name][n][this.SOUND]
}
ModelSettingJson.prototype.getMotionFadeIn = function (name, n) {
    if (this.json[this.MOTION_GROUPS] == null || this.json[this.MOTION_GROUPS][name] == null || this.json[this.MOTION_GROUPS][name][n] == null || this.json[this.MOTION_GROUPS][name][n][this.FADE_IN] == null) return 1000;
    return this.json[this.MOTION_GROUPS][name][n][this.FADE_IN]
}
ModelSettingJson.prototype.getMotionFadeOut = function (name, n) {
    if (this.json[this.MOTION_GROUPS] == null || this.json[this.MOTION_GROUPS][name] == null || this.json[this.MOTION_GROUPS][name][n] == null || this.json[this.MOTION_GROUPS][name][n][this.FADE_OUT] == null) return 1000;
    return this.json[this.MOTION_GROUPS][name][n][this.FADE_OUT]
}
ModelSettingJson.prototype.getInitParamID = function (n) {
    if (this.json[this.INIT_PARAM] == null || this.json[this.INIT_PARAM][n] == null) return null;
    return this.json[this.INIT_PARAM][n][this.ID]
}
ModelSettingJson.prototype.getInitParamValue = function (n) {
    if (this.json[this.INIT_PARAM] == null || this.json[this.INIT_PARAM][n] == null) return NaN;
    return this.json[this.INIT_PARAM][n][this.VALUE]
}
ModelSettingJson.prototype.getInitPartsVisibleNum = function () {
    return (this.json[this.INIT_PARTS_VISIBLE] == null) ? 0 : this.json[this.INIT_PARTS_VISIBLE].length
}
ModelSettingJson.prototype.getInitPartsVisibleID = function (n) {
    if (this.json[this.INIT_PARTS_VISIBLE] == null || this.json[this.INIT_PARTS_VISIBLE][n] == null) return null;
    return this.json[this.INIT_PARTS_VISIBLE][n][this.ID]
}
ModelSettingJson.prototype.getInitPartsVisibleValue = function (n) {
    if (this.json[this.INIT_PARTS_VISIBLE] == null || this.json[this.INIT_PARTS_VISIBLE][n] == null) return NaN;
    return this.json[this.INIT_PARTS_VISIBLE][n][this.VALUE]
}


/// PlatformManager

function PlatformManager() {
}

PlatformManager.prototype.loadBytes = function (path, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", path, true);
    request.responseType = "arraybuffer";
    request.onload = function () {
        switch (request.status) {
            case 200:
                callback(request.response);
                break;
            default:
                console.error("Failed to load (" + request.status + ") : " + path);
                break
        }
    }
    request.send(null)
}
PlatformManager.prototype.loadString = function (path) {
    this.loadBytes(path, function (buf) {
        return buf
    })
}
PlatformManager.prototype.loadLive2DModel = function (path, callback) {
    var model = null;
    this.loadBytes(path, function (buf) {
        model = Live2DModelWebGL.loadModel(buf);
        callback(model)
    })
}
PlatformManager.prototype.loadTexture = function (model, no, path, callback) {
    var loadedImage = new Image();
    loadedImage.src = path;
    var thisRef = this;
    loadedImage.onload = function () {
        var canvas = document.getElementById(LAppDefine.CANVAS_ID);

        var gl = canvas.getContext("webgl", {
            premultipliedAlpha: true
        });
        var texture = gl.createTexture();
        if (!texture) {
            console.error("Failed to generate gl texture name.");
            return -1
        }
        if (model.isPremultipliedAlpha() == false) {
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1)
        }
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, loadedImage);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        model.setTexture(no, texture);
        texture = null;
        if (typeof callback == "function") callback()
    };
    loadedImage.onerror = function () {
        console.error("Failed to load image : " + path)
    }
}
PlatformManager.prototype.jsonParseFromBytes = function (buf) {
    var jsonStr;
    var bomCode = new Uint8Array(buf, 0, 3);
    if (bomCode[0] == 239 && bomCode[1] == 187 && bomCode[2] == 191) {
        jsonStr = String.fromCharCode.apply(null, new Uint8Array(buf, 3))
    } else {
        jsonStr = String.fromCharCode.apply(null, new Uint8Array(buf))
    }
    var jsonObj = JSON.parse(jsonStr);
    return jsonObj
};
PlatformManager.prototype.log = function (txt) {
    console.log(txt)
}


/// LAppModel

function LAppModel() {
    L2DBaseModel.prototype.constructor.call(this);
    this.modelHomeDir = "";
    this.modelSetting = null;
    this.tmpMatrix = [];
    this.gl = null;
    this.texPath = "";
    this.modelPath = "";
    this.countOfTexure = -1
}

LAppModel.prototype = new L2DBaseModel();
var motionModel;
LAppModel.prototype.load = function (gl, modelSettingPath, callback) {
    this.setUpdating(true);
    this.setInitialized(false);
    this.gl = gl;
    this.modelPath = modelSettingPath;
    this.modelHomeDir = modelSettingPath.substring(0, modelSettingPath.lastIndexOf("/") + 1);
    this.modelSetting = new ModelSettingJson();
    var thisRef = this;
    this.modelSetting.loadModelSetting(modelSettingPath, function () {
        var path = thisRef.modelHomeDir + thisRef.modelSetting.getModelFile();
        thisRef.loadModelData(path, function (model) {
            console.log(thisRef.modelSetting);
            for (var i = 0; i < thisRef.modelSetting.getTextureNum(); i++) {
                var p = i;
                if (LAppDefine.NAME == '药水制作师小萝莉') p = LAppDefine.THIS_TEXURE;
                var texPaths = thisRef.modelHomeDir + thisRef.modelSetting.getTextureFile(p);
                thisRef.loadTexture(i, texPaths, function () {
                    if (thisRef.isTexLoaded) {
                        if (thisRef.modelSetting.getExpressionNum() > 0) {
                            thisRef.expressions = {};
                            for (var j = 0; j < thisRef.modelSetting.getExpressionNum(); j++) {
                                var expName = thisRef.modelSetting.getExpressionName(j);
                                var expFilePath = thisRef.modelHomeDir + thisRef.modelSetting.getExpressionFile(j);
                                thisRef.loadExpression(expName, expFilePath)
                            }
                        } else {
                            thisRef.expressionManager = null;
                            thisRef.expressions = {}
                        }
                        if (thisRef.eyeBlink == null) {
                            thisRef.eyeBlink = new L2DEyeBlink()
                        }
                        if (thisRef.modelSetting.getPhysicsFile() != null) {
                            thisRef.loadPhysics(thisRef.modelHomeDir + thisRef.modelSetting.getPhysicsFile())
                        } else {
                            thisRef.physics = null
                        }
                        if (thisRef.modelSetting.getPoseFile() != null) {
                            thisRef.loadPose(thisRef.modelHomeDir + thisRef.modelSetting.getPoseFile(), function () {
                                thisRef.pose.updateParam(thisRef.live2DModel)
                            })
                        } else {
                            thisRef.pose = null
                        }
                        if (thisRef.modelSetting.getLayout() != null) {
                            var layout = thisRef.modelSetting.getLayout();
                            if (layout["width"] != null) thisRef.modelMatrix.setWidth(layout["width"]);
                            if (layout["height"] != null) thisRef.modelMatrix.setHeight(layout["height"]);
                            if (layout["x"] != null) thisRef.modelMatrix.setX(layout["x"]);
                            if (layout["y"] != null) thisRef.modelMatrix.setY(layout["y"]);
                            if (layout["center_x"] != null) thisRef.modelMatrix.centerX(layout["center_x"]);
                            if (layout["center_y"] != null) thisRef.modelMatrix.centerY(layout["center_y"]);
                            if (layout["top"] != null) thisRef.modelMatrix.top(layout["top"]);
                            if (layout["bottom"] != null) thisRef.modelMatrix.bottom(layout["bottom"]);
                            if (layout["left"] != null) thisRef.modelMatrix.left(layout["left"]);
                            if (layout["right"] != null) thisRef.modelMatrix.right(layout["right"])
                        }
                        for (var j = 0; j < thisRef.modelSetting.getInitParamNum(); j++) {
                            thisRef.live2DModel.setParamFloat(thisRef.modelSetting.getInitParamID(j), thisRef.modelSetting.getInitParamValue(j))
                        }
                        for (var j = 0; j < thisRef.modelSetting.getInitPartsVisibleNum(); j++) {
                            thisRef.live2DModel.setPartsOpacity(thisRef.modelSetting.getInitPartsVisibleID(j), thisRef.modelSetting.getInitPartsVisibleValue(j))
                        }
                        thisRef.live2DModel.saveParam();
                        thisRef.preloadMotionGroup(LAppDefine.MOTION_GROUP_IDLE);
                        thisRef.mainMotionManager.stopAllMotions();
                        thisRef.setUpdating(false);
                        thisRef.setInitialized(true);
                        if (typeof callback == "function") callback()
                    }
                })
                if (LAppDefine.IS_START_TEXURE_CHANGE && LAppDefine.NAME == '药水制作师小萝莉') {
                    break;
                }
            }
        })
    });
    motionModel = this
};
LAppModel.prototype.release = function (gl) {
    var pm = Live2DFramework.getPlatformManager();
    gl.deleteTexture(pm.texture)
}
LAppModel.prototype.changeModelTexure = function (gl) {
    this.setUpdating(true);
    this.setInitialized(false);
    motionModel.countOfTexure++;
    var no = motionModel.countOfTexure;
    var modelSettingPath = motionModel.modelPath;
    this.modelHomeDir = modelSettingPath.substring(0, modelSettingPath.lastIndexOf("/") + 1);
    this.modelSetting = new ModelSettingJson();
    var thisRef = this;
    this.modelSetting.loadModelSetting(modelSettingPath, function () {
        var path = thisRef.modelHomeDir + thisRef.modelSetting.getModelFile();
        thisRef.loadModelData(path, function (model) {
            if (thisRef.modelSetting.getTextureNum() == 1) {
                return
            }
            if (LAppDefine.TEXURE_CHANGE_MODE == 'random') {
                no = parseInt(Math.random() * (thisRef.modelSetting.getTextureNum() - 1))
            }
            if (no >= thisRef.modelSetting.getTextureNum()) {
                motionModel.countOfTexure = 1;
                no = 1;
            }
            var texPaths = thisRef.modelHomeDir + thisRef.modelSetting.getTextureFile(no);
            thisRef.loadTexture(0, texPaths, function () {
                if (thisRef.isTexLoaded) {
                    db.set("now_texure", no).write();
                    if (thisRef.modelSetting.getExpressionNum() > 0) {
                        thisRef.expressions = {};
                        for (var j = 0; j < thisRef.modelSetting.getExpressionNum(); j++) {
                            var expName = thisRef.modelSetting.getExpressionName(j);
                            var expFilePath = thisRef.modelHomeDir + thisRef.modelSetting.getExpressionFile(j);
                            thisRef.loadExpression(expName, expFilePath)
                        }
                    } else {
                        thisRef.expressionManager = null;
                        thisRef.expressions = {}
                    }
                    if (thisRef.eyeBlink == null) {
                        thisRef.eyeBlink = new L2DEyeBlink()
                    }
                    if (thisRef.modelSetting.getPhysicsFile() != null) {
                        thisRef.loadPhysics(thisRef.modelHomeDir + thisRef.modelSetting.getPhysicsFile())
                    } else {
                        thisRef.physics = null
                    }
                    if (thisRef.modelSetting.getPoseFile() != null) {
                        thisRef.loadPose(thisRef.modelHomeDir + thisRef.modelSetting.getPoseFile(), function () {
                            thisRef.pose.updateParam(thisRef.live2DModel)
                        })
                    } else {
                        thisRef.pose = null
                    }
                    if (thisRef.modelSetting.getLayout() != null) {
                        var layout = thisRef.modelSetting.getLayout();
                        if (layout["width"] != null) thisRef.modelMatrix.setWidth(layout["width"]);
                        if (layout["height"] != null) thisRef.modelMatrix.setHeight(layout["height"]);
                        if (layout["x"] != null) thisRef.modelMatrix.setX(layout["x"]);
                        if (layout["y"] != null) thisRef.modelMatrix.setY(layout["y"]);
                        if (layout["center_x"] != null) thisRef.modelMatrix.centerX(layout["center_x"]);
                        if (layout["center_y"] != null) thisRef.modelMatrix.centerY(layout["center_y"]);
                        if (layout["top"] != null) thisRef.modelMatrix.top(layout["top"]);
                        if (layout["bottom"] != null) thisRef.modelMatrix.bottom(layout["bottom"]);
                        if (layout["left"] != null) thisRef.modelMatrix.left(layout["left"]);
                        if (layout["right"] != null) thisRef.modelMatrix.right(layout["right"])
                    }
                    for (var j = 0; j < thisRef.modelSetting.getInitParamNum(); j++) {
                        thisRef.live2DModel.setParamFloat(thisRef.modelSetting.getInitParamID(j), thisRef.modelSetting.getInitParamValue(j))
                    }
                    for (var j = 0; j < thisRef.modelSetting.getInitPartsVisibleNum(); j++) {
                        thisRef.live2DModel.setPartsOpacity(thisRef.modelSetting.getInitPartsVisibleID(j), thisRef.modelSetting.getInitPartsVisibleValue(j))
                    }
                    thisRef.live2DModel.saveParam();
                    thisRef.preloadMotionGroup(LAppDefine.MOTION_GROUP_IDLE);
                    thisRef.mainMotionManager.stopAllMotions();
                    thisRef.setUpdating(false);
                    thisRef.setInitialized(true);
                    if (typeof callback == "function") callback()
                }
            })
        })
    })
}
LAppModel.prototype.preloadMotionGroup = function (name) {
    var thisRef = this;
    for (var i = 0; i < this.modelSetting.getMotionNum(name); i++) {
        var file = this.modelSetting.getMotionFile(name, i);
        this.loadMotion(file, this.modelHomeDir + file, function (motion) {
            motion.setFadeIn(thisRef.modelSetting.getMotionFadeIn(name, i));
            motion.setFadeOut(thisRef.modelSetting.getMotionFadeOut(name, i))
        })
    }
}
LAppModel.prototype.update = function () {
    if (this.live2DModel == null) {
        if (LAppDefine.DEBUG_LOG) console.error("Failed to update.");
        return
    }
    var timeMSec = UtSystem.getUserTimeMSec() - this.startTimeMSec;
    var timeSec = timeMSec / 1000.0;
    var t = timeSec * 2 * Math.PI;
    if (this.mainMotionManager.isFinished()) {
        this.startRandomMotion(LAppDefine.MOTION_GROUP_IDLE, LAppDefine.PRIORITY_IDLE)
    }
    this.live2DModel.loadParam();
    var update = this.mainMotionManager.updateParam(this.live2DModel);
    if (!update) {
        if (this.eyeBlink != null) {
            this.eyeBlink.updateParam(this.live2DModel)
        }
    }
    this.live2DModel.saveParam();
    if (this.expressionManager != null && this.expressions != null && !this.expressionManager.isFinished()) {
        this.expressionManager.updateParam(this.live2DModel)
    }
    this.live2DModel.addToParamFloat("PARAM_ANGLE_X", this.dragX * 30, 1);
    this.live2DModel.addToParamFloat("PARAM_ANGLE_Y", this.dragY * 30, 1);
    this.live2DModel.addToParamFloat("PARAM_ANGLE_Z", (this.dragX * this.dragY) * -30, 1);
    this.live2DModel.addToParamFloat("PARAM_BODY_ANGLE_X", this.dragX * 10, 1);
    this.live2DModel.addToParamFloat("PARAM_EYE_BALL_X", this.dragX, 1);
    this.live2DModel.addToParamFloat("PARAM_EYE_BALL_Y", this.dragY, 1);
    this.live2DModel.addToParamFloat("PARAM_ANGLE_X", Number((15 * Math.sin(t / 6.5345))), 0.5);
    this.live2DModel.addToParamFloat("PARAM_ANGLE_Y", Number((8 * Math.sin(t / 3.5345))), 0.5);
    this.live2DModel.addToParamFloat("PARAM_ANGLE_Z", Number((10 * Math.sin(t / 5.5345))), 0.5);
    this.live2DModel.addToParamFloat("PARAM_BODY_ANGLE_X", Number((4 * Math.sin(t / 15.5345))), 0.5);
    this.live2DModel.setParamFloat("PARAM_BREATH", Number((0.5 + 0.5 * Math.sin(t / 3.2345))), 1);
    if (this.physics != null) {
        this.physics.updateParam(this.live2DModel)
    }
    if (this.lipSync == null) {
        this.live2DModel.setParamFloat("PARAM_MOUTH_OPEN_Y", this.lipSyncValue)
    }
    if (this.pose != null) {
        this.pose.updateParam(this.live2DModel)
    }
    this.live2DModel.update()
};
LAppModel.prototype.setRandomExpression = function () {
    var tmp = [];
    for (var name in this.expressions) {
        tmp.push(name)
    }
    var no = parseInt(Math.random() * tmp.length);
    this.setExpression(tmp[no])
}
LAppModel.prototype.startRandomMotion = function (name, priority) {
    var max = this.modelSetting.getMotionNum(name);
    var no = parseInt(Math.random() * max);
    this.startMotion(name, no, priority)
}
LAppModel.prototype.startAppointMotion = function (name, priority, no) {
    var max = motionModel.modelSetting.getMotionNum(name);
    if (no != undefined && typeof (no) == 'number' && no <= max) {
        motionModel.startMotion(name, no, priority)
    } else {
        no = parseInt(Math.random() * max);
        motionModel.startMotion(name, no, priority)
    }
}
LAppModel.prototype.startMotion = function (name, no, priority) {
    var motionName = this.modelSetting.getMotionFile(name, no);
    if (motionName == null || motionName == "") {
        if (LAppDefine.DEBUG_LOG) console.error("Failed to motion.");
        return
    }
    if (priority == LAppDefine.PRIORITY_FORCE) {
        this.mainMotionManager.setReservePriority(priority)
    } else if (!this.mainMotionManager.reserveMotion(priority)) {
        if (LAppDefine.DEBUG_LOG) console.log("Motion is running.");
        return
    }
    var thisRef = this;
    var motion;
    if (this.motions[name] == null) {
        this.loadMotion(null, this.modelHomeDir + motionName, function (mtn) {
            motion = mtn;
            thisRef.setFadeInFadeOut(name, no, priority, motion)
        })
    } else {
        motion = this.motions[name];
        thisRef.setFadeInFadeOut(name, no, priority, motion)
    }
}
LAppModel.prototype.setFadeInFadeOut = function (name, no, priority, motion) {
    var motionName = this.modelSetting.getMotionFile(name, no);
    motion.setFadeIn(this.modelSetting.getMotionFadeIn(name, no));
    motion.setFadeOut(this.modelSetting.getMotionFadeOut(name, no));
    if (LAppDefine.DEBUG_LOG) console.log("Start motion : " + motionName);
    if (this.modelSetting.getMotionSound(name, no) == null) {
        this.mainMotionManager.startMotionPrio(motion, priority)
    } else {
        if (!LAppDefine.IS_PLAY_AUDIO) return;
        var soundName = this.modelSetting.getMotionSound(name, no);
        var snd = document.getElementById(LAppDefine.AUDIO_ID);
        snd.src = this.modelHomeDir + soundName;
        if (LAppDefine.DEBUG_LOG) console.log("Start sound : " + soundName);
        musicPlay(true);
        this.mainMotionManager.startMotionPrio(motion, priority)
    }
}
LAppModel.prototype.setExpression = function (name) {
    if (name == undefined) return;
    var motion = this.expressions[name];
    if (LAppDefine.DEBUG_LOG) console.log("Expression : " + name);
    this.expressionManager.startMotion(motion, false)
}
LAppModel.prototype.draw = function (gl) {
    MatrixStack.push();
    MatrixStack.multMatrix(this.modelMatrix.getArray());
    this.tmpMatrix = MatrixStack.getMatrix();
    this.live2DModel.setMatrix(this.tmpMatrix);
    this.live2DModel.draw();
    MatrixStack.pop()
};
LAppModel.prototype.hitTest = function (id, testX, testY) {
    var len = this.modelSetting.getHitAreaNum();
    for (var i = 0; i < len; i++) {
        if (id == this.modelSetting.getHitAreaName(i)) {
            var drawID = this.modelSetting.getHitAreaID(i);
            return this.hitTestSimple(drawID, testX, testY)
        }
    }
    return false
}


/// LAppLive2DManager

export function LAppLive2DManager() {
    this.models = [];
    this.count = -1;
    this.reloadFlg = false;
    Live2D.init();
    Live2DFramework.setPlatformManager(new PlatformManager)
}

LAppLive2DManager.prototype.createModel = function () {
    var model = new LAppModel();
    this.models.push(model);
    return model
}
LAppLive2DManager.prototype.changeTexure = function (gl) {
    if (this.reloadFlg) {
        this.reloadFlg = false;
        this.releaseModel(0, gl);
        this.createModel();
        this.models[0].changeModelTexure(gl)
    }
}
LAppLive2DManager.prototype.changeModel = function (gl) {
    if (this.reloadFlg) {
        this.reloadFlg = false;
        debugger
        var no = parseInt(this.count % LAppDefine.MODELS.length);
        console.log("no== " + no);
        var thisRef = this;
        var releaseNo = no - 1;
        if (no == 0) {
            releaseNo = LAppDefine.MODELS.length - 1
        }
        if (LAppDefine.MODELS[releaseNo].length >= 2) {
            this.releaseModel(1, gl)
        }
        this.releaseModel(0, gl);
        if (LAppDefine.MODELS[no].length >= 2) {
            this.releaseModel(0, gl);
            this.createModel();
            this.models[0].load(gl, LAppDefine.MODELS[no][0], function () {
                thisRef.createModel();
                thisRef.models[1].load(gl, LAppDefine.MODELS[no][1])
            })
        } else {
            this.createModel();
            this.models[0].load(gl, LAppDefine.MODELS[no][0])
        }
    }
};
LAppLive2DManager.prototype.getModel = function (no) {
    if (no >= this.models.length) return null;
    return this.models[no]
};
LAppLive2DManager.prototype.releaseModel = function (no, gl) {
    if (this.models.length <= no) return;
    this.models[no].release(gl);
    delete this.models[no];
    this.models.splice(no, 1)
};
LAppLive2DManager.prototype.numModels = function () {
    return this.models.length
};
LAppLive2DManager.prototype.setDrag = function (x, y) {
    for (var i = 0; i < this.models.length; i++) {
        this.models[i].setDrag(x, y)
    }
}
LAppLive2DManager.prototype.maxScaleEvent = function () {
    if (LAppDefine.DEBUG_LOG) console.log("Max scale event.");
    for (var i = 0; i < this.models.length; i++) {
        this.models[i].startRandomMotion(LAppDefine.MOTION_GROUP_PINCH_IN, LAppDefine.PRIORITY_NORMAL)
    }
}
LAppLive2DManager.prototype.minScaleEvent = function () {
    if (LAppDefine.DEBUG_LOG) console.log("Min scale event.");
    for (var i = 0; i < this.models.length; i++) {
        this.models[i].startRandomMotion(LAppDefine.MOTION_GROUP_PINCH_OUT, LAppDefine.PRIORITY_NORMAL)
    }
}
LAppLive2DManager.prototype.tapEvent = function (x, y) {
    if (LAppDefine.DEBUG_LOG) console.log("tapEvent view x:" + x + " y:" + y);
    for (var i = 0; i < this.models.length; i++) {
        if (this.models[i].hitTest(LAppDefine.HIT_AREA_HEAD, x, y)) {
            if (LAppDefine.DEBUG_LOG) console.log("Tap face.");
            this.models[i].setRandomExpression()
        } else if (this.models[i].hitTest(LAppDefine.HIT_AREA_BODY, x, y)) {
            if (LAppDefine.DEBUG_LOG) console.log("Tap body." + " models[" + i + "]");
            this.models[i].startRandomMotion(LAppDefine.MOTION_GROUP_TAP_BODY, LAppDefine.PRIORITY_NORMAL)
        }
    }
    return true
};

