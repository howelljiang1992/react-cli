import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {initStore} from './store/index'
import BreadcrumbRouter from './containers/BreadcrumbRouter'
import '../less/index'
import fetchDefaults from 'fetch-defaults'

const store = initStore(applyMiddleware(thunkMiddleware))

window.Fetch = fetchDefaults(fetch, '', {
    credentials: "same-origin",
    headers: {
        "Accept": "application/json"
    }
})

window.onscroll = () => {
    setTimeout(() => {
        document.body.style.marginTop = 0
    }, 0)
}

render(
    <Provider store={store}>
        <BreadcrumbRouter />
    </Provider>,
    document.querySelector('#app')
)
