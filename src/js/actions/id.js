import {SET_ID, CLEAN_ID} from '../constants/Actions'

export function setId(id) {
    console.log('action id:', id)
    return {
        type: SET_ID,
        id
    }
}

export function cleanId() {
    return {
        type: CLEAN_ID
    }
}
