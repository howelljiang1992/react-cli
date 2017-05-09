import {CHANGE_TAB} from '../constants/Actions'

export function setTab(tab) {
    return {
        type: CHANGE_TAB,
        tab
    }
}