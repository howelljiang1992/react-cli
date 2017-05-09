import {GET_USERINFO} from '../constants/Actions'

export function userInfo(state = {
    name: '',
    authorize: 0
}, action) {
    switch (action.type) {
        case GET_USERINFO:
       // alert(action.data.username)
            if (action.data.retcode !== 0) return
            return  Object.assign({}, state, {name: action.data.username})
        default:
            return state
    }
}
