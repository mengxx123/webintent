var encodeNameTransport = function (data) {
    return window.btoa(unescape(encodeURIComponent(JSON.stringify(data))))
};

var decodeNameTransport = function (str) {
    return JSON.parse(decodeURIComponent(escape(window.atob(str))))
};
class IntentEx {

    constructor(cb, errorCallback) {
        try {
            this._init(cb)
        } catch (e) {
            console.error(e)
            errorCallback && errorCallback()
        }
    }

    _init(cb) {
        this.dataCallback = cb
        window.aaa = 'edit'
        function getActionName(name) {
            let arr = name.split('/')
            return arr[arr.length - 1]
        }
        
        console.log('呵呵')
        console.log(window.name)
        console.log(decodeNameTransport(window.name))
        this.intent = decodeNameTransport(window.name)

        this.dataCallback && this.dataCallback(this.intent.action.data)

        let origin = 'https://webintents.yunser.com'
        window.addEventListener('message',function(event) {
            console.log('edit on message')
            console.log(event)
            // 通过origin属性判断消息来源地址
            origin = event.origin
            if (event.origin === 'http://a.com') {
                console.log(event.data);
                console.log(event.source);
            }
            let intent = event.data.action

            console.log(event.data.action)
            let actionName = getActionName(intent.action)
            console.log('actionName', actionName)
            if (intent.type !== 'text/plain') {
                console.log('不支持的类型')
                // document.getElementById('tip').innerText = '不支持的类型'
                return
            }
            console.log('二次回调', intent.data)
            // this.dataCallback && this.dataCallback(intent.data)
        },false);

        let owner = window.opener || window.parent

        function sendResponse(data) {
            console.log('edit finish')
            console.log(this.intent)
            this.intent.action.data = data
            let sendObj = {
                request: 'sendResponse',
                intent: this.intent
        //        data: data,
            }
            sendObj.intent.data = data
            owner.postMessage(JSON.stringify(sendObj), origin)
            owner.window.close()
        }
        this.sendResponse = sendResponse
    }

    onData(cb) {
        this.dataCallback = cb
    }


}

window.IntentEx = IntentEx