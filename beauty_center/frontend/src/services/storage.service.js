function load(key) {
    var val = localStorage.getItem(key)
    return val ? JSON.parse(val) : null
}

function save(key, val) {
    localStorage[key] = JSON.stringify(val)
}

function remove(val) {
    localStorage.removeItem(val)
}

export const storageService = {
    load,
    save,
    remove
}
