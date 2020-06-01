const initState = {
    statesError: null,
    states: []
}

const stateReducer = (state = initState, action) => {
    switch(action.type){
      case 'GET_STATES_SUCCESS':
        return {
          ...state,
          states: action.states
        }
  
      case 'GET_STATES_ERROR':
        return {
            ...state,
            statesError: action.error
        }
  
      default:
        return state
    }
};
  
export default stateReducer;