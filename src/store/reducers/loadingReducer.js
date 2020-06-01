const initialState = {
    activeRequests: [],
    isLoading: false,
    loadingMessage: 'Loading...'
}
const loadingReducer = (state = initialState, action) => {
    const { type } = action;
    if (type.includes('REQUEST')) {
        const currentRequests = state.activeRequests;
        currentRequests.push({
            type
        });
        return {
            ...state,
            activeRequests: currentRequests,
            isLoading: true
        }   
    } else {
        // Search for the request
        const parts = type.split('_');
        parts.pop();
        const requestName = parts.join('_');
        const requestIndex = state.activeRequests.findIndex(r => r.type === `${requestName}_REQUEST`);
        let currentRequests = state.activeRequests;
        if (requestIndex > -1) {
            currentRequests = state.activeRequests;
            currentRequests.splice(requestIndex, 1);
        }
        return {
            ...state,
            activeRequests: currentRequests,
            isLoading: currentRequests.length > 0
        } 
    }
}

export default loadingReducer;