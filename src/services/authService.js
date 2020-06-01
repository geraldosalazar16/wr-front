import {request, handleResponse} from './httpService'

const apiURL = process.env.REACT_APP_API_URL;

const login = async (credentials) => {
    const response = await request('post', `${apiURL}/api/auth/signin`, credentials);
    const result = handleResponse(response); 
    sessionStorage.setItem('user', JSON.stringify(result.user));
    return result;
}

const signup = async (newUser) => {
    const response = await request('post', `${apiURL}/api/user/userscreate`, newUser);
    return handleResponse(response); 
}

const signout = () => {
    sessionStorage.removeItem('user');
}

const recoverPassword = async (email) => {
    const response = await request('post', `${apiURL}/api/user/forgotpasswordlink`, {userEmail: email});
    return handleResponse(response); 
}

const verifyAccount = async (token) => {
    const response = await request('post', `${apiURL}/api/user/userverification`, {token});
    return handleResponse(response); 
}

const changePassword = async (token, password) => {
    const response = await request('post', `${apiURL}/api/user/forgotpassword`, {
        token,
        password
    });
    return handleResponse(response); 
}

const getCurrentUser = () => {
    return JSON.parse(sessionStorage.getItem('user'));
}

const updateProfile = async (user) => {
    const response = await request('post', `${apiURL}/api/user/usersprofileupdate`, user);
    return handleResponse(response); 
}

const changePasswordLogedIn = async (userId, newPassword) => {
    const response = await request('post', `${apiURL}/api/user/passwordchange`, {
        userId,
        newPassword
    });
    return handleResponse(response); 
}

const listUserBranch = async  (userId) => {
    const response = await request('post', `${apiURL}/api/user/userbrancheslist`, {
        userId
    });
    return handleResponse(response);
}

export default {
    login,
    signup,
    signout,
    recoverPassword,
    verifyAccount,
    changePassword,
    getCurrentUser,
    updateProfile,
    changePasswordLogedIn,
    listUserBranch
};