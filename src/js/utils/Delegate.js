let cbArr = []

export default (element, targetSelector, type, handler) => {
    cbArr = cbArr.filter((item) => {
        element.removeEventListener(type, item.callback, false)
        return item.element !== element
    })
    element.addEventListener(type, cb, false)
    function cb(event) {
        let targets = Array.prototype.slice.call(element.querySelectorAll(targetSelector))
        let target = event.target
        if (targets.indexOf(target) != -1) {
            return handler.apply(target, arguments)
        }
    }

    cbArr.push({
        element: element,
        callback: cb
    })
}
