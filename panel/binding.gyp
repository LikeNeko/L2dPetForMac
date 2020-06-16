{
    "targets": [
        {
            "target_name": "NativeExtension",
            "sources": [ "NativeExtension.cc" ],
            "include_dirs" : [
 	 			      "<!(node -e \"require('nan')\")"
			      ],
            "link_settings": {
              "conditions":[
                  ["OS=='linux'", {
                      "sources": [
                        "functions_linux.cc"
                      ]
                  }],
                  ["OS=='win'", {
                      "sources": [
                        "functions_win.cc"
                      ]
                  }],
                  ['OS=="mac"', {
                      "sources": [
                          "functions_mac.cc"
                      ],
                      "libraries": [
                          'Foundation.framework',
                          'AppKit.framework',
                          'ScriptingBridge.framework'
                      ]
                  }
              ]]
            },
            "xcode_settings": {
                "OTHER_CFLAGS": [
                    "-x objective-c++ -stdlib=libc++"
                ]
            }
        }
    ],
}