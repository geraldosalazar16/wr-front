import { createStore } from 'redux';
import rootReducer from './reducers/rootReducer'
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
// import stateActions from './actions/stateActions'

// Create store with reducers and initial state
const initialState = {}
const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk)
);

// Load here initial states from API
// store.dispatch(stateActions.getStates(1));

export default store;