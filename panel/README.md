[![npm version](https://badge.fury.io/js/electron-panel-window.svg)](https://badge.fury.io/js/electron-panel-window) [![CircleCI](https://circleci.com/gh/goabstract/electron-panel-window.svg?style=svg)](https://circleci.com/gh/goabstract/electron-panel-window)

# electron-panel-window

Enables creating a browser window in Electron that behaves like a [Panel](https://developer.apple.com/documentation/appkit/nspanel). Panels are typically used for auxillary windows and do not activate the application – as such they can appear ontop of other apps in the same way as Spotlight or 1Password, for example.

## Usage

Use `PanelWindow` as you would [BrowserWindow](https://electronjs.org/docs/api/browser-window). All of the methods exposed in this module **must be used** on the main process. Using the methods in a renderer process will result in your app crashing.

```javascript
import { PanelWindow } from 'electron-panel-window';

const win = new PanelWindow({
  width: 800,
  height: 600,
  show: false
})

// the window will show without activating the application
win.show();
```

You can also access the utility methods directly:

```javascript
import { remote } from 'electron';
import { makePanel, makeKeyWindow } from 'electron-panel-window';

const currentWindow = remote.getCurrentWindow();

// convert the window to an NSPanel
makePanel(currentWindow);

// focus the window without activating the application
makeKeyWindow(currentWindow);
```

## Development

To compile the extension for the first time, run 

```bash
$ yarn
$ yarn configure
$ yarn build
```

All subsequent builds only need `yarn build`. Tests run in Spectron:

```bash
$ yarn test
```

## Contributing

This project is maintained by [Abstract](https://www.goabstract.com). We are very willing to accept contributions, first please ensure there is a relavant [issue in the tracker](https://github.com/goabstract/electron-panel-window/issues) and an approach has been discussed before beginning to write code – this makes it more likely we will be able to accept your contribution and ensure nobody's time (especially yours!) is wasted.

## Details

File | Contents
-------------|----------------
`NativeExtension.cc` | Represents the top level of the module. C++ constructs that are exposed to javascript are exported here
`functions.cc` | The meat of the extension
`index.js` | The main entry point for the node dependency
`binding.gyp` | Describes the node native extension to the build system (`node-gyp`). If you add source files to the project, you should also add them to the binding file.

## License

This project is under MIT.
See [LICENSE](https://github.com/goabstract/electron-panel-window/blob/master/LICENSE)

