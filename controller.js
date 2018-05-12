/**
 * 参考：https://github.com/PaulKinlan/webintents
 */

var app = new Vue({
    el: '#app',
    data: {
        intent: null,
        actions: [
        ]
    },
    mounted() {
    },
    methods: {
        selectAction(action) {
            if (this.intent) {
                this.launch(this.intent, action.disposition, action.url)
            }
        },
        openUri(uri) {
            window.open(uri)
        },
        launch(intent, disposition, href) {
            console.log('launch ==========')
            console.log(intent)


            console.log('launch规范')
            var intentStr = encodeNameTransport(intent)

            if (intent && !!intent._callback == false) {
                // There is no callback so remove any reference to the intent.
                console.log('controller launch removeItem')
                localStorage.removeItem(intent._id)
            }

            if (disposition == "inline") {
                var iframe = document.getElementById("inline")
                iframe.contentWindow.name = intentStr
                iframe.src = href
                iframe.style.display = "block"
            }
            else {
                window.name = ""
                window.open(href, intentStr)
            }

            return false
        }
    }
})

var IntentController = new (function () {

    var intent

    this.setIntent = function (i) {
        intent = i
        app.$data.intent = i
    }

    this.getIntent = function () {
        return intent
    }

    this.renderActions = function (actions, intent, root) {
        app.$data.actions = actions
        app.$data.intent = intent
    }
})()

