import {SET_TITLE} from '../constants/Actions'

export function setTitle(title) {
    console.log('set title:', title)
    return {
        type: SET_TITLE,
        title
    }
}