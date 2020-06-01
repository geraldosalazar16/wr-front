import authService from './authService'

const handleResponse = (response) => {
    return response.data
}

const handleAxiosError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) { // Unauthorized
            authService.signout();
            return error.response.data.message || 'Access denied from server. Pleaso login again';
        } else if (error.response.status === 400) { // Bad request
            return error.response.data.res || error.response.data.err || 'Some parameters where not correct in your request';
        } else if (error.response.status === 422) { // Bad entity
            return error.response.data.errors[0].msg || 'Some parameters where not correct in your request';
        } else if (error.response.status === 404) { // Not found
            return error.response.data.res || 'Some parameters where not correct in your request';
        } else {
            return error.response.data.res || 'The server failed to fullfill the request';
        }
      } else if (error.request) {
          return 'No response from server';
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
      } else {
        // Something happened in setting up the request that triggered an Error
        return error.message;
      }
}

const authHeader = () => {
    // return authorization header with jwt token
    let user = JSON.parse(sessionStorage.getItem('user'));

    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token };
    } else {
        return {};
    }
}

/**
 * Given a date, normalize the format it will be displayed to the user
 * @param {string|object} date String representation of a date or a JS Date object
 */
const prettifyDate = (date) => {
    const jsDate = typeof(date) === 'object' ? date : new Date(date);
    const month = [];
    month[0] = 'Jan';
    month[1] = 'Feb';
    month[2] = 'Mar';
    month[3] = 'Apr';
    month[4] = 'May';
    month[5] = 'Jun';
    month[6] = 'Jul';
    month[7] = 'Aug';
    month[8] = 'Sep';
    month[9] = 'Oct';
    month[10] = 'Nov';
    month[11] = 'Dec';

    const day = jsDate.getDate();
    const strMonth = month[jsDate.getMonth()];
    const year = jsDate.getFullYear();
    return `${strMonth} ${day} ${year}`;
}

/**
 * Given a JS date, transforms it into a mysql string date
 * @param {object} jsDate 
 */
const mySQLDate = (jsDate) => {
    jsDate = typeof (jsDate) === 'string' ? new Date(jsDate) : jsDate;
    const year = jsDate.getFullYear();
    let month = jsDate.getMonth();
    month = month + 1;
    if (month < 10) {
        month = `0${month}`
    }
    let day = jsDate.getDate();
    if (day < 10) {
        day = `0${day}`
    }
    const formatedDate = `${year}-${month}-${day}`;
    return formatedDate;
}

export {
    handleResponse,
    handleAxiosError,
    authHeader,
    prettifyDate,
    mySQLDate
};