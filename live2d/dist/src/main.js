"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lappdelegate_1 = require("./lappdelegate");
var lapplive2dmanager_1 = require("./lapplive2dmanager");
window.onload = function () {
    lappdelegate_1.LAppDelegate.getInstance().setLappModelEvent({
        modelCompleteSetup: function () {
            window["live2d"] = lapplive2dmanager_1.LAppLive2DManager.getInstance();
            window['nload']();
        }
    });
    if (lappdelegate_1.LAppDelegate.getInstance().initialize() == false) {
        return;
    }
    lappdelegate_1.LAppDelegate.getInstance().run();
};
window.onbeforeunload = function () { return lappdelegate_1.LAppDelegate.releaseInstance(); };
//# sourceMappingURL=main.js.map