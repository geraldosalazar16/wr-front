import {getDesignations} from '../../services/designationService'
import {handleAxiosError} from '../../services/utilsService'

export const getDesignationsAction = (partnerGroup) => {
	return (dispatch) => {
        getDesignations(partnerGroup)
        .then(result => {
            dispatch({
                type: 'DESIGNATIONS_LIST_SUCCESS',
                designations: result
            });
        })
        .catch(error => {
            const errorMessage = handleAxiosError(error)
            dispatch({
                type: 'DESIGNATIONS_LIST_ERROR',
                error: errorMessage
            });
        })
	}
}