import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { authHeader } from './utilsService';

const request = (method, url, data = {}) => {
    const request = axios({
        method,
        url,
        data,
        headers: authHeader()
    });
    trackPromise(request);
    return request;
}

const requestNoLoading = (method, url, data = {}) => {
    const request = axios({
        method,
        url,
        data
    });
    return request;
}

const handleResponse = (response) => {
    return response.data;
}

export {
    request,
    requestNoLoading,
    handleResponse
}