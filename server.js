var jsonServer = require('json-server')
var server = jsonServer.create()
var router = jsonServer.router('src/json/json-server.json')
var middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)
server.listen(8001, function () {
    console.log('JSON Server is running')
})
