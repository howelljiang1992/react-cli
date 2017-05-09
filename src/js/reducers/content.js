import {SET_CONTENT} from '../constants/Actions'

export function content(state = '', action) {
    switch (action.type) {
        case SET_CONTENT:
            console.log('reducer update content:', action.content)
            localStorage.setItem('content', action.content)
            return action.content
        default:
            return state
    }
}
