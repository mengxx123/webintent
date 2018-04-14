var app = new Vue({
    el: '#app',
    data: {
        intent: null,
        actions: [
        ]
    },
    mounted() {
        this.actions = Intents.getAllActions()
    },
    methods: {
        clearAll() {
            Intents.clearAll()
        },
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

            // TODO 这里有bug
            var intentStr = window.btoa(unescape(encodeURIComponent(JSON.stringify(intent)))).replace(/=/g, "_")

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

// window.addEventListener('load', function () {
//     var clearall = document.getElementById("clearall");
//     attachEventListener(clearall, "click", function () {
//         Intents.clearAll()
//         window.location.reload();
//     });
//
//     var actions = Intents.getAllActions();
//
//     for (var key in actions) {
//         var action = actions[key];
//         var root = IntentController.renderActionContainer(action, document.body);
//
//         IntentController.renderActions(action.actions, undefined, root);
//     }
// }, false)