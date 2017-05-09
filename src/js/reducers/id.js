import {SET_ID, CLEAN_ID} from '../constants/Actions'

export function __id__(state = localStorage.getItem('__id__') || null, action) {
    switch (action.type) {
        case SET_ID:
            localStorage.setItem('__id__', action.id)
            return action.id
        case CLEAN_ID:
            //localStorage.removeItem('__id__')
            return null
        default:
            return state
    }
}
