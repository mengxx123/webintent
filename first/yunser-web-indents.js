class ysIntent {
    constructor(action, type, data, extras) {
        this.action = action
        this.type = type
        this.data = data
        this.extras = extras

        this.init()
    }

    init() {
        let iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.id = 'webintents_channel'
    }
}

ysIntent.startActivity = function (intent, onResult, onFailure) {
    let indentOrigin = 'http://a.yunser.com'
    // let indentOrigin = 'http://localhost:8082'
    let win
    window.addEventListener('message',function(postMessage){
        console.log('on message')
        console.log(event)
        if (event.origin === indentOrigin) {
            console.log('正确的代码')
            onResult && onResult(event.data)
            // win.postMessage(intent, indentOrigin)
        }
    },false)
    let params = 'directories=no,menubar=no,status=0,location=0,fullscreen=no,width=300,height=300'
    win = window.open(indentOrigin)
    setTimeout(function  () {
        console.log('send message')
        win.postMessage(intent, indentOrigin)
    },500)
    // document.getElementById('open').addEventListener("click", function() {
    //
    //     // 要注意父页面中的setTimeout，也就是要延迟传消息，因为子页面不可能瞬间加载完成，他的onmessage事件也就没初始化成功，这时给他传消息，当然是收不到的了。
    //     setTimeout(function  () {
    //         console.log('send message')
    //         win.postMessage('data to send', 'http://a.yunser.com')
    //     },2000)
    // }, false);
}

window.ysIntent = ysIntent
