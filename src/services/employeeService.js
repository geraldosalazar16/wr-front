import {request, handleResponse} from './httpService'
const apiURL = process.env.REACT_APP_API_URL;
//const apiURL = "http://localhost:4000";

export const getUsersEmployees = async (partnerId) => {
    let route = `${apiURL}/api/user/companyuserslist`;
    const response = await request('post', route, {partnerId});
    return handleResponse(response);
}

const createUser = async (newUser) => {
    const response = await request('post', `${apiURL}/api/user/branchusercreate`, newUser);
    return handleResponse(response); 
}

const editUser = async (user) => {
    const response = await request('post', `${apiURL}/api/user/branchuserupdate`, user);
    return handleResponse(response); 
}

const deleteUser = async ({userId}) => {
    const response = await request('post', `${apiURL}/api/user/deleteuser`, {
        userId,
        userStatus: 0
    });
    return handleResponse(response); 
}

export default {
    getUsersEmployees,
    createUser,
    editUser,
    deleteUser
}

