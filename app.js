import koa from 'koa'
import React from 'react'
import ReactDomServer from 'react-dom/server'
const app = koa()

import Demo from './src/js/components/Footer'
// logger

app.use(function *(next){
    var start = new Date
    yield next
    var ms = new Date - start
    console.log('%s %s - %s', this.method, this.url, ms)
})

// response

app.use(function *(){
    this.body = ReactDomServer.renderToString(<Demo />)
})

app.listen(3000)
