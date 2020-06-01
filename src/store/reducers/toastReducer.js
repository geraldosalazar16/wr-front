const initState = {
    message: null,
    type: null
}

const toastReducer = (state = initState, action) => {
    switch (action.type) {
        case 'SHOW_MESSAGE':
            return {
                ...state,
                message: action.message,
            }
        case 'CLEAR_MESSAGE':
            return {
                ...state,
                message: {
                    messageText: null,
                    type: null
                }
            }
        default:
            return state;
    }
}

export default toastReducer;