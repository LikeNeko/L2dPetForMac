
let applescript = require("applescript");

let scripts = {
    state: "input volume of (get volume settings) & output volume of (get volume settings) & output muted of (get volume settings)",
    volumeState: "output volume of (get volume settings)",
    inputState: "input volume of (get volume settings)",
    outputState: "output volume of (get volume settings)",
    muteState: "output muted of (get volume settings)",
    setOutput: "set volume output volume %s --100%",
    setInput: "set volume input volume %s --100%",
    increase: "set volume output volume (output volume of (get volume settings) + 10) --100%",
    decrease: "set volume output volume (output volume of (get volume settings) - 10) --100%",
    mute: "set volume with output muted",
    unmute: "set volume without output muted"
};

let exec = function (script, callback) {
    if (!callback) callback = function () {};
    applescript.execString(script, callback);
};

let getScript = function (scriptName, param) {
    let script = scripts[scriptName];
    if (typeof param !== "undefined") script = script.replace("%s", param);
    return script;
};
let Volume = {};
Volume.state = function (callback) {
    return exec(getScript("state"), callback);
};

Volume.volumeState = function (callback) {
    return exec(getScript("volumeState"), callback);
};

Volume.inputState = function (callback) {
    return exec(getScript("inputState"), callback);
};

Volume.outputState = function (callback) {
    return exec(getScript("outputState"), callback);
};

Volume.muteState = function (callback) {
    return exec(getScript("muteState"), callback);
};

Volume.setOutput = function (volume, callback) {
    return exec(getScript("setOutput", volume), callback);
};

Volume.setInput = function (volume, callback) {
    return exec(getScript("setInput", volume), callback);
};

Volume.increase = function (callback) {
    return exec(getScript("increase"), callback);
};

Volume.decrease = function (callback) {
    return exec(getScript("decrease"), callback);
};

Volume.mute = function (callback) {
    return exec(getScript("mute"), callback);
};

Volume.unmute = function (callback) {
    return exec(getScript("unmute"), callback);
};
module.exports = {
    Volume
}