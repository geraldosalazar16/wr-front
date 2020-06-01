export const displayError = (message) => {
    return {
        type: 'SHOW_MESSAGE',
        message: {
            messageText: message,
            type: 'error' // Error or success
        }
    };
}

export const displayMessage = (message) => {
    return {
        type: 'SHOW_MESSAGE',
        message: {
            messageText: message,
            type: 'success' // Error or success
        }
    };
}