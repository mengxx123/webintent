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
var encodeNameTransport = function (data) {
    return window.btoa(unescape(encodeURIComponent(JSON.stringify(data))))
};

var decodeNameTransport = function (str) {
    return JSON.parse(decodeURIComponent(escape(window.atob(str))))
};

// var decodeNameTransport = function (str) {
//     try {
//         return JSON.parse(window.atob(str.replace(/_/g, "=")));
//     } catch (e) {
//         return '';
//     }
// };
// let b = atob('我')
// console.log('测试ab')
// console.log(btoa(b))

attachEventListener(window, "load", function () {
    var intent
    if (window.name) {
        console.log('什么鬼')
        intent = decodeNameTransport(window.name);
    } else {
        console.log('调试模式')
        // 方便调试
        intent = {
            action: {
                action: "http://webintent.yunser.com/edit",
                type: "text/plain",
                data: "This is a text这是正文"
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
    // suggestions.src = "//registry.a.yunser.com/suggestions.html?action=" + intent.action.action + "&type=" + intent.action.type;

    // var suggestions2 = document.getElementById("suggestions2");
    // suggestions2.innerText = suggestions.src

    // 全屏
    // window.resizeTo(300, 300);
}, false);
