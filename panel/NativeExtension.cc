#include "functions.h"

using v8::FunctionTemplate;

// NativeExtension.cc represents the top level of the module.
// C++ constructs that are exposed to javascript are exported here

NAN_MODULE_INIT(InitAll) {
  Nan::Set(target, Nan::New("MakePanel").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(MakePanel)).ToLocalChecked());
  Nan::Set(target, Nan::New("MakeKeyWindow").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(MakeKeyWindow)).ToLocalChecked());
  // Passing target down to the next NAN_MODULE_INIT
  // MyObject::Init(target);
}

NODE_MODULE(NativeExtension, InitAll)
