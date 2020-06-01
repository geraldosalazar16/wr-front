import { combineReducers } from 'redux'
import authReducer from './authReducer'
import loadingReducer from './loadingReducer'
import branchReducer from './branchReducer'
import designationsReducer from './designationsReducer'
import loginTabsReducer from './loginTabsReducer'
import stateReducer from './stateReducer'
import sidenavReducer from './sidenavReducer'
import customerReducer from './customerReducer'
import toastReducer from './toastReducer'
import employeeReducer from './employeeReducer'

const rootReducer = combineReducers({
    auth: authReducer,
    loading: loadingReducer,
    branch: branchReducer,
    designations: designationsReducer,
    loginTab: loginTabsReducer,
    states: stateReducer,
    sidenav: sidenavReducer,
    customer: customerReducer,
    toast: toastReducer,
    employee: employeeReducer
});

export default rootReducer;