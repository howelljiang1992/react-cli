export default obj => {
    let form = new FormData()
    for (let k in obj) {
        if (!obj[k]) continue
        //if (Array.isArray(obj[k]))
        if (typeof obj[k] === 'object') form.append(k, JSON.stringify(obj[k]))
        else form.append(k, obj[k])
    }
    return form
}
