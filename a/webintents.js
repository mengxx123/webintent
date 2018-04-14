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
(function () {
    if (!!window.Intent || !!window.WebKitIntent) return;

    var addEventListener = function (obj, type, func, capture) {
        if (!!window.addEventListener) {
            obj.addEventListener(type, func, capture);
        }
        else {
            obj.attachEvent("on" + type, func);
        }
    };

    const INTENTS_SERVER = 'https://webintents.yunser.com'
    var server = INTENTS_SERVER + "/";
    var serverSource = server + "intents.html";
    var pickerSource = server + "picker.html";
    var channels = {};
    var intents = {};

    var encodeNameTransport = function (data) {
        return window.btoa(unescape(encodeURIComponent(JSON.stringify(data))))
    };

    var decodeNameTransport = function (str) {
        return JSON.parse(decodeURIComponent(escape(window.atob(str))))
    };

    var Intents = function () {
    };

    /*
     * Starts an activity.
     */
    Intents.prototype.startActivity = function (intent, onResult, onFailure) {
        var id = "intent" + new Date().valueOf();
        var params = "width=800,height=500";
        // var params = "directories=no,menubar=no,status=0,location=0,fullscreen=yes,top=0,left=0";
        var fulls = "left=0,screenX=0,top=0,screenY=0,scrollbars=1";    //定义弹出窗口的参数
        if (window.screen) {
            var ah = screen.availHeight - 30;
            var aw = screen.availWidth - 10;
            fulls += ",height=" + ah;
            fulls += ",innerHeight=" + ah;
            fulls += ",width=" + aw;
            fulls += ",innerWidth=" + aw;
            fulls += ",resizable"
        } else {
            fulls += ",resizable"; // 对于不支持screen属性的浏览器，可以手工进行最大化。 manually
        }

        var iframe = document.getElementById("webintents_channel");
        intent._id = id;
        intent._callback = !!onResult;
        intent._error = !!onFailure
        intent.data = intent.action.data
        intents[id] = {intent: intent};

        // var iframe2 = document.createElement("iframe");
        // // iframe2.style.display = "none";
        // iframe2.src = pickerSource
        // window.pickername = '1212'
        // addEventListener(iframe2, "readystatechange", function () {
        //     console.log('readystatechange')
        // }, false);
        // addEventListener(iframe2, "load", function () {
        //     console.log('设置名称')
        //     iframe2.contentWindow.name = encodeNameTransport(intent)
        //     // if (iframe.src != serverSource) {
        //     //     iframe.src = serverSource;
        //     // }
        //     // else {
        //     //     //parseIntentsDocument();
        //     // }
        // }, false);
        // document.body.appendChild(iframe2)

        console.log('编码', intent)
        let code
        window.open(pickerSource, code = encodeNameTransport(intent), params);
        console.log(code)
        decodeNameTransport(code)
        //
        if (onResult) {
            console.log('父发送 registerCallback 消息')
            iframe.contentWindow.postMessage(
                _str({"request": "registerCallback", "id": id}),
                server);
            intents[id].callback = onResult;
        }

        if (onFailure) {
            console.log('父发送 registerErrorCallback 消息')
            iframe.contentWindow.postMessage(
                _str({"request": "registerErrorCallback", "id": id}),
                server);
            intents[id].errorCallback = onFailure;
        }
    };

    var _str = function (obj) {
        return JSON.stringify(obj);
    };

    var handler = function (e) {
        var data;
        try {
            data = JSON.parse(e.data);
            console.log('父收到消息', data)
            if (
                !!data.intent == true &&
                !!intents[data.intent._id] == true &&
                data.request &&
                data.request == "response") {
                intents[data.intent._id].callback(data.intent.data, data.intent.extras);
            }
            else if (!!data.intent == true &&
                !!intents[data.intent._id] == true &&
                data.request &&
                data.request == "errorResponse") {
                intents[data.intent._id].errorCallback(data.intent.data);
            }
            else if (data.request == "ready") {
                parseIntentsDocument();
            }
        } catch (err) {
            if (!!console && !!console.log) console.log(err);
        }
    };

    addEventListener(window, "message", handler, false);

    var loadIntentData = function (data) {
        var intent = new Intent();
        intent._id = data._id;
        intent.action = data.action;
        intent.type = data.type;
        intent.data = data.data;
        intent.extras = data.extras;
        // This will recieve the intent data.
        window.intent = intent;
    };

    var register = function (action, type, url, title, icon, disposition) {
        if (window.self != window.top) return;

        var iframe = document.getElementById("webintents_channel");
        if (!!url == false) url = document.location.toString();
        if (url.substring(0, 7) != "http://" &&
            url.substring(0, 8) != "https://") {
            if (url.substring(0, 1) == "/") {
                // absolute path
                url = window.location.protocol + "//" + window.location.host + "/" + url;
            }
            else {
                // relative path
                path = document.location.href;
                path = path.substring(0, path.lastIndexOf('/') + 1);
                url = path + url;
            }
        }

        console.log('父发送 register 消息')
        iframe.contentWindow.postMessage(
            _str({
                request: "register",
                intent: {
                    action: action,
                    type: type,
                    url: url,
                    title: title,
                    icon: icon,
                    domain: window.location.host,
                    disposition: disposition
                }
            }),
            server);
    };

    var Intent = function (action, type, data, extras) {
        var me = this;
        var closed = false;
        this.action = action;
        this.type = type;
        this.data = data;
        this.extras = extras;

        this.postResult = function (data, extras) {
            if (closed) return;

            var iframe = document.getElementById("webintents_channel");
            var returnIntent = new Intent();
            returnIntent._id = me._id;
            returnIntent.action = me.action;
            returnIntent.data = data;
            returnIntent.extras = extras;
            setTimeout(function () {
                console.log('父发送 intentResponse 消息')

                iframe.contentWindow.postMessage(
                    _str({
                        request: "intentResponse",
                        intent: returnIntent
                    }),
                    "*");
            }, 50);

            closed = true;
        };

        this.postFailure = function (data) {
            if (closed) return;

            var iframe = document.getElementById("webintents_channel");
            var returnIntent = new Intent();
            returnIntent._id = me._id;
            returnIntent.action = me.action;
            returnIntent.data = data;
            setTimeout(function () {
                console.log('父发送 intentErrorResponse 消息')
                iframe.contentWindow.postMessage(
                    _str({
                        request: "intentErrorResponse",
                        intent: returnIntent
                    }),
                    "*");
            }, 50);

            closed = true;
        };
    };

    Intent.SHARE = INTENTS_SERVER + "/share";
    Intent.SEND = INTENTS_SERVER + "/send";
    Intent.EDIT = INTENTS_SERVER + "/edit";
    Intent.VIEW = INTENTS_SERVER + "/view";
    Intent.PICK = INTENTS_SERVER + "/pick";

    var getFavIcon = function () {
        var links = document.getElementsByTagName("link");
        var link;
        for (var i = 0; link = links[i]; i++) {
            if ((link.rel == "icon" || link.rel == "shortcut") && !!link.href) {
                var url = link.href;
                if (url.substring(0, 7) != "http://" &&
                    url.substring(0, 8) != "https://") {
                    if (url.substring(0, 1) == "/") {
                        // absolute path
                        return window.location.protocol + "//" + window.location.host + "/" + url;
                    }
                    else {
                        // relative path
                        path = document.location.href;
                        path = path.substring(0, path.lastIndexOf('/') + 1);
                        url = path + url;
                    }
                }
                else {
                    return url;
                }
            }
        }

        return window.location.protocol + "//" + window.location.host + "/favicon.ico";
    };

    var parseIntentTag = function (intent) {
        var title = intent.getAttribute("title") || document.title || window.location.host;
        var href = intent.getAttribute("href") || document.location.href;
        var action = intent.getAttribute("action");
        var type = intent.getAttribute("type");
        var disposition = intent.getAttribute("disposition") || "new";
        var icon = intent.getAttribute("icon") || getFavIcon();

        if (!!action == false) return;

        register(action, type, href, title, icon, disposition);
    };

    var parseIntentsDocument = function () {
        var intents = document.getElementsByTagName("intent");
        var intent;
        for (var i = 0; intent = intents[i]; i++) {
            parseIntentTag(intent);
        }
    };

    var onIntentDOMAdded = function (e) {
        if (e.target.tagName == "INTENT") {
            parseIntentTag(e.target)
        }
    };

    var init = function () {
        var intents = new Intents();

        window.Intent = Intent;
        window.navigator.startActivity = intents.startActivity;

        if (window.name) {
            // Verify the source of the intent data.
            var verified = false;
            verified = (window.history.length == 1) ? true : false;
            //verified = (window.document.referrer == pickerSource) ?  true : false;
            if (verified) {

                loadIntentData(decodeNameTransport(window.name));
                window.name = "";
            }
        }

        if (!!window.postMessage) {
            // We can handle postMessage.
            var iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.id = "webintents_channel";

            addEventListener(iframe, "load", function () {
                if (iframe.src != serverSource) {
                    iframe.src = serverSource;
                }
                else {
                    //parseIntentsDocument();
                }
            }, false);

            // Listen to new "intent" nodes.
            var heads = document.getElementsByTagName("HEAD");
            if (heads.length > 0) {
                var head = heads[0];
                addEventListener(head, "DOMNodeInserted", onIntentDOMAdded, false);
                head.appendChild(iframe);
                iframe.src = serverSource;
            }
        }
    };

    init();
})();
