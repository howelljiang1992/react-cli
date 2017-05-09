import {SUBMIT_FORM, GET_FORM, CLEAN_RESULT, CLEAN_FORM, SUBMIT_ERROR} from '../constants/Actions'

export function submitResult(state = null, action) {
    switch (action.type) {
        case SUBMIT_FORM:
            console.log(action.data)
            return Object.assign({}, state, action.data)
        case SUBMIT_ERROR:
            return Object.assign({}, state, {retcode: -9999})
        case CLEAN_RESULT:
            console.log('clean')
            return null
        default:
            return state
    }
}

export function formValues(state = {}, action) {
    switch (action.type) {
        case GET_FORM:
            console.log(action.data)
            if (action.data.retcode !== 0) return state
            //window.renedr = true
            //console.log(window.render)
            return Object.assign({}, state, action.data.data)
        case CLEAN_FORM:
            //console.log('before clean:', state)
            console.log('clean form')
            //let _state = state
            //for (let k in _state)
            //    if (k.match(/position[0-9]/)) _state[k] = {}
            //return Object.assign({}, _state)
            return {}
        default:
            return state
    }
}
