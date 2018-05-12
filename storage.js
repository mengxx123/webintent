const storage = {
    set (key, value) {
        console.log('set', key, value)
        if (value === undefined || value === null) {
            localStorage.setItem(key, null)
            return
        }
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            localStorage.setItem(key, JSON.stringify({
                _type: typeof value,
                value: value
            }))
        } else {
            localStorage.setItem(key, JSON.stringify(value))
        }
    },
    get (key, defaultValue) {
        // console.log('storage get ' + key)
        let item = localStorage.getItem(key)
        if (item === null) {
            return defaultValue || null
        }
        let ret = JSON.parse(item)
        if (ret && typeof ret === 'object') {
            if (ret._type === 'string' || ret._type === 'number' || ret._type === 'boolean') {
                return ret.value
            }
        }
        return ret
    },
    setItem (key, value) {
        this.set(key, value)
        return this
    },
    getItem (key) {
        return this.get(key)
    }
}

var encodeNameTransport = function (data) {
    return window.btoa(unescape(encodeURIComponent(JSON.stringify(data))))
};

var decodeNameTransport = function (str) {
    return JSON.parse(decodeURIComponent(escape(window.atob(str))))
};