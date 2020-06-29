/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import {LAppDelegate, lAppDelegateEvent} from './lappdelegate';
import {LAppLive2DManager} from "./lapplive2dmanager";
import {LAppModel, LoadStep} from "./lappmodel";
import {log, LAppPal} from "./lapppal";


/**
 * ブラウザロード後の処理
 */
window.onload = (): void => {
  LAppDelegate.getInstance().setLappModelEvent({
    modelCompleteSetup(){
        window["live2d"] = LAppLive2DManager.getInstance();
        eval('nload();')
    }
  })
  // create the application instance
  if (LAppDelegate.getInstance().initialize() == false) {
    return;
  }

  LAppDelegate.getInstance().run();
};

/**
 * 終了時の処理
 */
window.onbeforeunload = (): void => LAppDelegate.releaseInstance();
