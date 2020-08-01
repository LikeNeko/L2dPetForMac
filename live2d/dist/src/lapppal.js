"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LAppPal = void 0;
var LAppPal = (function () {
    function LAppPal() {
    }
    LAppPal.loadFileAsBytes = function (filePath, callback) {
        fetch(filePath)
            .then(function (response) { return response.arrayBuffer(); })
            .then(function (arrayBuffer) { return callback(arrayBuffer, arrayBuffer.byteLength); });
    };
    LAppPal.getDeltaTime = function () {
        return this.s_deltaTime;
    };
    LAppPal.updateTime = function () {
        this.s_currentFrame = Date.now();
        this.s_deltaTime = (this.s_currentFrame - this.s_lastFrame) / 1000;
        this.s_lastFrame = this.s_currentFrame;
    };
    LAppPal.printMessage = function (message) {
        console.log(message);
    };
    LAppPal.log = function (any, tag) {
        if (tag === void 0) { tag = "info"; }
        window.log(any, tag);
    };
    LAppPal.getName = function (fun) {
        return typeof fun === 'function' ?
            undefined :
            fun.name || /function (.+)\(/.exec(fun + '')[1];
    };
    LAppPal.lastUpdate = Date.now();
    LAppPal.s_currentFrame = 0.0;
    LAppPal.s_lastFrame = 0.0;
    LAppPal.s_deltaTime = 0.0;
    return LAppPal;
}());
exports.LAppPal = LAppPal;
//# sourceMappingURL=lapppal.js.map