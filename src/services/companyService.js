
import {requestNoLoading, handleResponse} from './httpService'
const apiURL = process.env.REACT_APP_API_URL;

const listCompanies = async () => {
    const response = await requestNoLoading('post', `${apiURL}/api/business/getbusinessinfrormation/`);
    const result = handleResponse(response); 
    return result;
}

export {
    listCompanies
}