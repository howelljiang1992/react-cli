import {SET_CONTENT} from '../constants/Actions'

export function setContent(content) {
    console.log('actions:', content)
    return {
        type: SET_CONTENT,
        content
    }
}