import {requestNoLoading, handleResponse} from './httpService'
const apiURL = process.env.REACT_APP_API_URL;

const getDesignations = async (partnerGroup) => {
    let route = `${apiURL}/api/designation/getdesignations`;
    const response = await requestNoLoading('post', route, {partnerId: partnerGroup});
    return handleResponse(response);
}

export {
    getDesignations
}

