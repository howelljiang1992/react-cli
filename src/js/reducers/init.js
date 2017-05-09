

export function tab(state = sessionStorage.getItem('tab') || '0', action) {
    switch (action.type) {
        case CHANGE_TAB:
        default:
            return state
    }
}
