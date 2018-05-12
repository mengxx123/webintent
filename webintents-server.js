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


var id;
var callbacks = {
    asd: 'asd' + new Date().getTime()
};
var errorCallbacks = {};

let ownerWindow = window.parent

window.attachEventListener = function (obj, type, func, capture) {
    if (!!obj.addEventListener) {
        obj.addEventListener(type, func, capture);
    }
    else if (!!obj.attachEvent) {
        obj.attachEvent("on" + type, func);
    }
};

// Intent manager
var Intents = new (function () {

    this.getAllActions = function (it) {
        var allActions = ACTIONS;
        if (it.action.action) {
            let arr = it.action.action.split('/')
            let type = arr[arr.length - 1]
            let arr2 = []
           
            allActions = allActions.filter(function (a) {
                console.log('变量', a)
                return a._type === type || type === '?'
            })
            console.log(type, allActions)
        }
            
        // for (var key in localStorage) {
        //     var actions = JSON.parse(localStorage[key]);
        
        //     if (!!actions.actions && actions.actions instanceof Array) {
        //         allActions.push({key: key, actions: actions.actions});
        //     }
        // }

        // TODO 从本地存储读取
        return allActions
    };

    this.getActions = function (intent) {
        if (!intent) {
            throw "No intent";
        }
        if (!intent.action) {
            throw "No action to resolve";
        }
        // hack
        intent.type = intent.action.type

        console.log('获取 getActions',intent )
        var actionData = localStorage[intent.action] || "{}";
        var actions = JSON.parse(actionData);

        if (actions instanceof Array) {
            actions = {"actions": actions};
        }
        else if (!!actions.actions == false) {
            actions = {"actions": []};
        }

        actions = {
            actions: this.getAllActions(intent)
        }
        var action;
        var filteredActions = {"actions": []};
        // Find the actions that are of the correct type.
        for (var i = 0; action = actions.actions[i]; i++) {
            var actiontype = action.type;

            var actionOffset = actiontype.indexOf("/*");
            var actionEnd = (actionOffset == -1) ? actiontype.length : actionOffset;

            var intentOffset = intent.type.indexOf("/*");
            var intentEnd = (intentOffset == -1) ? intent.type.length : intentOffset;

            var matchType = actiontype.substr(0, actionEnd + 1);
            var intentType = intent.type.substr(0, intentEnd);
            console.log('匹配' + matchType, intentType)
            if (intentType.indexOf(matchType) === 0 ||
                matchType.indexOf(intentType) === 0 ||
                action.type === "*" ||
                intent.type === "*" ||
                !intent.type) {
                filteredActions.actions.push(action);
                console.log('成功')
            } else {
                console.log('不成功')
            }
        }

        return filteredActions;
    };

    this.clearAll = function () {
        localStorage.clear();
    };

    this.addAction = function (intent) {
        if (!!intent == false) throw "No intent";
        if (!!intent.action == false) throw "No action to resolve";

        var actionData = localStorage[intent.action] || "{}";
        var actions = JSON.parse(actionData);

        if (actions instanceof Array) {
            // Upgrade existing intents to new format.
            actions = {"actions": actions};
        }
        else if (!!actions.actions == false) {
            actions = {"actions": []};
        }

        var action;
        var found = false;

        // Replace an existing action.
        for (var i = 0; action = actions.actions[i]; i++) {
            if (intent.action == action.action && intent.url == action.url && intent.type == action.type) {
                actions.actions[i] = intent;
                found = true;
                break;
            }
        }
        // Add a new action
        if (found == false) {
            actions.actions.push(intent);
        }

        localStorage[intent.action] = JSON.stringify(actions);
    };

    this.verify = function (intent) {
        return true;
    };
})();

try {
    if (window.parent.opener && window.parent.opener.Intents) {
        verified = window.parent.opener.Intents.verify();
        // The picker has said it is legit. (TODO), so close the window.
        if (verified) window.parent.opener.close();
    }
}
catch (e) {
    if (!!console && !!console.log) {
        console.log(e);
    }
}

var MessageDispatcher = function () {

    this.register = function (data, timestamp, e) {
        Intents.addAction(data.intent);
    };

    this.startActivity = function (data, timestamp, e) {
        var actions = Intents.getActions(data.intent);
        console.log('get All action', actions)
        // TODO
        var intentData = {
            id: data.intent._id,
            intent: data.intent,
            timestamp: timestamp
        };

        localStorage[data.intent._id] = JSON.stringify(intentData);
        IntentController.setIntent(data.intent);
        IntentController.renderActions(actions.actions, data.intent);
    };

    this.registerCallback = function (data, timestamp, e) {
        console.log('registerCallback********' + data.id)
        callbacks[data.id] = {};

        console.log('callbacks after add', callbacks)

        if (!!window.onstorage == false) {
            // We are going to have to set up something that polls.
            var timer = setInterval(function () {
                var intentStr = localStorage.getItem(data.id);
                if (!!intentStr) {
                    var intentObj = JSON.parse(intentStr);
                    if (intentObj.request == "sendResponse") {
                        console.log('send message 1', intentStr)
                        window.postMessage(intentStr, "*");
                        clearInterval(timer);
                    }
                }
            }, 1000);
        }
    };

    this.registerErrorCallback = function (data, timestamp, e) {
        errorCallbacks[data.id] = {};

        if (!!window.onstorage == false) {
            // We are going to have to set up something that polls.
            var timer = setInterval(function () {
                var intentStr = localStorage.getItem(data.id);
                if (!!intentStr) {
                    var intentObj = JSON.parse(intentStr);
                    if (intentObj.request == "sendErrorResponse") {
                        console.log('send message 2', intentStr)
                        window.postMessage(intentStr, "*");
                        clearInterval(timer);
                    }
                }
            }, 1000);
        }
    };

    this.requestData = function (data, timestamp, e) {
        if (e.origin == "http://registry.a.yunser.com") {
            var intentObj = IntentController.getIntent();
            var response = {
                request: "dataResponse",
                data: intentObj
            };
            console.log('send message 3', JSON.stringify(response), e.origin)
            e.source.postMessage(JSON.stringify(response), e.origin);
        }
    };

    /*
     * The service has sent a response, route it back to the correct frame.
     */
    this.intentResponse = function (data, timestamp, e) {
        var id = data.intent._id;
        var intentData = {
            "request": "sendResponse",
            intent: data.intent,
            timestamp: timestamp
        };
        localStorage[id] = JSON.stringify(intentData);
    };

    /*
     * The service has said there has been an error, route it back to the correct frame.
     */
    this.intentErrorResponse = function (data, timestamp, e) {
        var id = data.intent._id;
        var intentData = {
            "request": "sendErrorReponse",
            intent: data.intent,
            timestampe: timestamp
        };
        localStorage[id] = JSON.stringify(intentData);
    };

    /*
     * The correct frame has recieved the response, route it back to the parent app.
     */
    this.sendResponse = function (data, timestamp, e) {
        console.log('sendResponse callback haha', data)
        console.log('callbacks', callbacks)
        // TODO
        // if (!!callbacks[data.intent._id] == false) {
        //     return;
        // }
        console.log('2222222222222222222222223333333333333333')
        localStorage.removeItem(data.intent._id);
        var message = JSON.stringify({intent: data.intent, request: "response"});
        console.log('send message 4', message)
        console.log(window.aaa)
        console.log(window.opener)
        if (window.opener) {
            window.opener.postMessage(
                message,
                "*"
            );
        } else {
            console.log('opener 不存在')
            console.log(window.parent)
            window.parent.postMessage(
                message,
                "*"
            );
        }


    };

    /*
     * The correct frame has recieved the error response, route it back to the parent app.
     */
    this.sendErrorResponse = function (data, timestamp, e) {
        if (!!errorCallbacks[data.intent._id] == false) {
            return;
        }
        localStorage.removeItem(data.intent._id);
        var message = JSON.stringify({intent: data.intent, request: "errorResponse"});
        console.log('send message 5', message)
        window.parent.postMessage(
            message,
            "*"
        );
    };
};

var MessageHandler = function () {

    var dispatcher = new MessageDispatcher();
    this.handler = function (e) {
        var data;
        if (!!e.data) {
            data = JSON.parse(e.data);
        }
        else {
            var vals = localStorage[e.key];
            try {
                data = JSON.parse(vals);
            } catch (ex) {
                return;
            }
        }
        console.log('MessageHandler')
        console.log(data)
        if (data.origin && data.origin !== window.name ||
            data.process && data.process == false) {
            console.log('no dispatcher')
            // If there is an intended origin, then enforce it, or the system says not to listen to the event.
            return;
        }
        console.log('dispatcher ' + data.request + '?', dispatcher)
        var timestamp = (new Date()).valueOf();

        if (dispatcher[data.request]) {
            console.log('dispatch', data)
            dispatcher[data.request](data, timestamp, e);
        }
    };
}

var msgHandler = new MessageHandler();
;

attachEventListener(window, "message", msgHandler.handler, false);
attachEventListener(window, "storage", msgHandler.handler, false);
attachEventListener(document, "storage", msgHandler.handler, false);
attachEventListener(window, "load", function () {
    // Tell the app we are loaded.
    var message = JSON.stringify({request: "ready"});
    console.log('send ready message, Tell the app we are loaded', message)
    window.parent.postMessage(message, "*");
}, false); 
