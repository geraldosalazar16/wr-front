const initState = {
    designations: [],
    error: null
}
  
const designationsReducer = (state = initState, action) => {
    switch(action.type){
        case 'DESIGNATIONS_LIST_SUCCESS':
            return {
                designations: action.designations
            }
        case 'DESIGNATIONS_LIST_ERROR':
            return Object.assign({}, state, {error: action.errorMessage});

        default:
            return state
    }
  };
  
  export default designationsReducer;