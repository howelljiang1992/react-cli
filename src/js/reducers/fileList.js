import {CLEAN_BANNER_FILE, SET_BANNER_FILE, CLEAN_BANNER_FILELIST, CLEAN_FILE, GET_POS} from '../constants/Actions'
import equal from 'deep-equal'

export function fileList(state = {
    banner: []
}, action) {
    switch (action.type) {
        case CLEAN_BANNER_FILELIST:
            return Object.assign({}, state, {banner: []})
        case SET_BANNER_FILE:
            let __banner = state.banner
            __banner[action.position] = action.file
            return Object.assign({}, state, {banner: __banner})
        case CLEAN_FILE:
            let ___banner = state.banner.map((s, i) => {
                if (!equal(s, action.file)) return s
                else window.i = i
            })
            return Object.assign({}, state, {banner: ___banner})
        case GET_POS:
            state.banner.map((s, i) => {
                if (equal(s, action.file)) window.i = i
            })
            return state
        default:
            return state
    }
}
