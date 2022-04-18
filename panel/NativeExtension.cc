#include "functions.h"

using v8::FunctionTemplate;

// NativeExtension。Cc代表模块的顶层。
// 向javascript公开的c++构造在这里导出

NAN_MODULE_INIT(InitAll) {
  Nan::Set(target, Nan::New("MakePanel").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(MakePanel)).ToLocalChecked());
  Nan::Set(target, Nan::New("MakeKeyWindow").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(MakeKeyWindow)).ToLocalChecked());
  // Passing target down to the next NAN_MODULE_INIT
  // MyObject::Init(target);
}

NODE_MODULE(NativeExtension, InitAll)
