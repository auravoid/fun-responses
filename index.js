const got = require('got')
exports.joke = async function () {
    const {body} = await got("https://api.voidprojects.dev/api/joke")
    let {data} = JSON.parse(body)
    return data
}
exports.pickup = async function () {
    const {body} = await got("https://api.voidprojects.dev/api/pickup")
    let {data} = JSON.parse(body)
    return data
}
exports.topic = async function () {
    const {body} = await got("https://api.voidprojects.dev/api/topic")
    let {data} = JSON.parse(body)
    return data
}
exports.roast = async function () {
    const {body} = await got("https://api.voidprojects.dev/api/roast")
    let {data} = JSON.parse(body)
    return data
}
exports.toast = async function () {
    const {body} = await got("https://api.voidprojects.dev/api/toast")
    let {data} = JSON.parse(body)
    return data
}
