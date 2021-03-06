#import <CoreServices/CoreServices.h>
#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>
#import <objc/objc-runtime.h>

#include "functions.h"
void SwizzlingMethod(Class c, SEL originSEL, SEL swizzledSEL);
//静态就交换静态,实例方法就交换实例方法
void SwizzlingMethod(Class c, SEL originSEL, SEL swizzledSEL)
{
    Method originMethod = class_getInstanceMethod(c, originSEL);
    Method swizzledMethod = nil;

    if (!originMethod)
    {// 处理为类方法
        originMethod = class_getClassMethod(c, originSEL);
        if (!originMethod)
        {
            return;
        }
        swizzledMethod = class_getClassMethod(c, swizzledSEL);
        if (!swizzledMethod)
        {
            return;
        }
    }
    else
    {// 处理实例方法
        swizzledMethod = class_getInstanceMethod(c, swizzledSEL);
        if (!swizzledMethod)
        {
            return;
        }
    }

    if(class_addMethod(c, originSEL, method_getImplementation(swizzledMethod), method_getTypeEncoding(swizzledMethod)))
    { //自身已经有了就添加不成功,直接交换即可
        class_replaceMethod(c, swizzledSEL, method_getImplementation(originMethod), method_getTypeEncoding(originMethod));
    }
    else
    {
        method_exchangeImplementations(originMethod, swizzledMethod);
    }
}

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
