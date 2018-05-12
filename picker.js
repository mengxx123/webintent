/*
 Copyright 2011 Google Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
attachEventListener(window, "load", function () {
    var intent
    if (window.name) {
        console.log('什么鬼')
        intent = decodeNameTransport(window.name);
    } else {
        console.log('调试模式')
        // 方便调试
        intent = {
            // action: {
            //     action: "http://webintent.yunser.com/edit",
            //     type: "text/plain",
            //     data: "This is a text这是正文"
            // },
            action: {
                action: "http://webintent.yunser.com/edit",
                type: "image/*",
                data: "data:image/png;base64,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"
            },
            _callback: true,
            _error: true,
            _id: "intent1523640974525"
        }
    }
    console.log('lala')
    console.log(window.name);
    console.log(window.parent.pickername)
    console.log('获取的intent', intent)
    window.name = "";

    data = {};
    data.request = "startActivity";
    data.origin = window.name;
    data.intent = intent;

    var timestamp = (new Date()).valueOf();
    var dispatcher = new MessageDispatcher();
    dispatcher.startActivity(data, timestamp);

    // var suggestions = document.getElementById("suggestions");
    // suggestions.src = "/suggestions.html?action=" + intent.action.action + "&type=" + intent.action.type;

    // var suggestions2 = document.getElementById("suggestions2");
    // suggestions2.innerText = suggestions.src

    // 全屏
    // window.resizeTo(300, 300);
}, false);
