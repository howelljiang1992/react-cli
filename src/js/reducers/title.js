import {SET_TITLE} from '../constants/Actions'

export function title(state = '添加', action) {
    switch (action.type) {
        case SET_TITLE:
            return action.title
        default:
            return state
    }
}
