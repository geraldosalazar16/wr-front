
import {requestNoLoading, handleResponse} from './httpService'
const apiURL = process.env.REACT_APP_API_URL;

const listStates = async (countryId) => {
    const response = await requestNoLoading('post', `${apiURL}/api/state/getstates/`, {countryId});
    const result = handleResponse(response); 
    return result;
}

export {
    listStates
}