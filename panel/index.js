var BrowserWindow = require('electron').BrowserWindow;

var NativeExtension = require('bindings')('NativeExtension');

class PanelWindow extends BrowserWindow {
  constructor(options) {
    super(options);
    NativeExtension.MakePanel(this.getNativeWindowHandle());
  }

  show() {
    super.showInactive();
    NativeExtension.MakeKeyWindow(this.getNativeWindowHandle());
  }
}

module.exports = {
  PanelWindow,
  makeKeyWindow: function(window) {
    return NativeExtension.MakeKeyWindow(window.getNativeWindowHandle());
  },
  makePanel: function(window) {
    return NativeExtension.MakePanel(window.getNativeWindowHandle());
  }
}