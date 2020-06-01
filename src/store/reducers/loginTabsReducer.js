const initialState = {
    tab: 'login'
}

const loginTabsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_TAB':
            return {
                tab: action.tab
            };
        default:
            return state;
    }
}

export default loginTabsReducer;