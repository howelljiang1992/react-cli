import {CHANGE_TAB} from '../constants/Actions'

export function tab(state = sessionStorage.getItem('tab') || '0', action) {
    switch (action.type) {
        case CHANGE_TAB:
            sessionStorage.setItem('tab', action.tab)
            return action.tab
        default:
            return state
    }
}
