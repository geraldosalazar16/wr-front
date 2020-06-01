export const setTab = tab => {
    return {
        type: 'SIDENAV_CHANGE',
        tab
    }
}

export const toggle = () => {
    return {
        type: 'SIDENAV_TOGGLE'
    }
}