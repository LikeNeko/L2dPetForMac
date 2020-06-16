#import <CoreServices/CoreServices.h>
#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>
#import <objc/objc-runtime.h>

#include "functions.h"

@interface PROPanel : NSWindow
@end

@implementation PROPanel
- (BOOL)needsPanelToBecomeKey {
  return YES;
}
- (BOOL)acceptsFirstResponder {
  return YES;
}
@end

NAN_METHOD(MakePanel) {
  v8::Local<v8::Object> handleBuffer = info[0].As<v8::Object>();
  v8::Isolate* isolate = info.GetIsolate();
  v8::HandleScope scope(isolate);

  char* buffer = node::Buffer::Data(handleBuffer);
  NSView* mainContentView = *reinterpret_cast<NSView**>(buffer);

  if (!mainContentView)
      return info.GetReturnValue().Set(false);

  // Convert the NSWindow class to NSPanel
//  object_setClass(mainContentView.window, [PROPanel class]);

  // Ensure that the window is a "non activating panel" which means it won't activate the application
  // when it becomes key.
//  mainContentView.window.styleMask |= NSWindowStyleMaskNonactivatingPanel;

  // Ensure that the window can display over the top of fullscreen apps
  [mainContentView.window setCollectionBehavior: NSWindowCollectionBehaviorStationary];
  [mainContentView.window setLevel:NSScreenSaverWindowLevel];
//  [mainContentView.window setOpaque:NO];
//  [mainContentView.window setBackgroundColor:[NSColor clearColor]];
//  [mainContentView.window setStyleMask:NSBorderlessWindowMask];
//  [mainContentView.window setAcceptsMouseMovedEvents:YES];
//  [mainContentView.window setMovableByWindowBackground:YES];
  // [mainContentView.window setFloatingPanel:YES];
  return info.GetReturnValue().Set(true);
}

NAN_METHOD(MakeKeyWindow) {
  v8::Local<v8::Object> handleBuffer = info[0].As<v8::Object>();
  v8::Isolate* isolate = info.GetIsolate();
  v8::HandleScope scope(isolate);

  char* buffer = node::Buffer::Data(handleBuffer);
  NSView* mainContentView = *reinterpret_cast<NSView**>(buffer);

  if (!mainContentView)
      return info.GetReturnValue().Set(false);

    [mainContentView.window makeKeyWindow];
//    [mainContentView.window setCollectionBehavior: NSWindowCollectionBehaviorStationary];
    //  [mainContentView.window setLevel:NSScreenSaverWindowLevel];
//    [mainContentView.window setOpaque:NO];
//    [mainContentView.window setBackgroundColor:[NSColor clearColor]];
//    [mainContentView.window setStyleMask:NSBorderlessWindowMask];
    //  [mainContentView.window setAcceptsMouseMovedEvents:YES];
    //  [mainContentView.window setMovableByWindowBackground:YES];
    return info.GetReturnValue().Set(true);
}