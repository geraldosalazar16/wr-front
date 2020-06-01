import stateService from '../../services/stateService'
import {handleAxiosError} from '../../services/utilsService'
/*
const getStates = (countryId) => {
	return (dispatch) => {
        stateService.list(countryId)
        .then(result => {
            dispatch({
                type: 'GET_STATES_SUCCESS',
                states: result
            });
        })
        .catch(error => {
            const errorMessage = handleAxiosError(error)
            dispatch({
                type: 'GET_STATES_ERROR',
                error: errorMessage
            });
        })
	}
}

export default {
    getStates
}
*/