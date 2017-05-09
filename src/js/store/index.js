import { createStore } from 'redux'
import reducer from '../reducers/index'


export function initStore(initialState) {
    return createStore(reducer, initialState)
    //以下这段用于配置chrome中的redux插件
    //return createStore(
    //    reducer,
    //    initialState,
    //    window.devToolsExtension && window.devToolsExtension()
    //)
}
