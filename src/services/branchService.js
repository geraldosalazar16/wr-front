import {request, handleResponse} from './httpService'
const apiURL = process.env.REACT_APP_API_URL;

const create = async (branch) => {
    let route = `${apiURL}/api/branch/branchcreate`;
    const response = await request('post', route, branch);
    return handleResponse(response);
}

const listBranchs = async (partnerId) => {
    let route = `${apiURL}/api/branch/brancheslist`;
    const response = await request('post', route, {partnerId});
    return handleResponse(response);
}

const listBranchsFromUser = async (userId) => {
    let route = `${apiURL}/api/user/userbrancheslist`;
    const response = await request('post', route, {userId});
    return handleResponse(response);
}

const update = async (branch) => {
    let route = `${apiURL}/api/branch/branchupdate`;
    const response = await request('post', route, branch);
    return handleResponse(response);
}

const deleteBranch = async ({branchId}) => {
    let route = `${apiURL}/api/branch/branchdelete`;
    const response = await request('post', route, {
        branchId
    });
    return handleResponse(response);
}

const changestatusBranch = async ({branchId}) => {
    let route = `${apiURL}/api/branch/branchstatuschange`;
    const response = await request('post', route, {
        branchId,
        status: 0
    });
    return handleResponse(response);
}

const getUsers = async (branchId) => {
    let route = `${apiURL}/api/branch/branchuserslist`;
    const response = await request('post', route, {
        branchId
    });
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

const changestatusUser = async ({userId}) => {
    const response = await request('post', `${apiURL}/api/user/userstatuschange`, {
        userId,
        userStatus: 0
    });
    return handleResponse(response); 
}

const deleteUser = async ({userId}) => {
    const response = await request('post', `${apiURL}/api/user/deleteuser`, {
        userId
    });
    return handleResponse(response); 
}

const branchUserAssign = async (userList) => {
    const response = await request('post', `${apiURL}/api/branch/branchuserassign`, {
        usersList: userList
    });
    return handleResponse(response);
}

const branchUserDelete = async (userId) => {
    const response = await request('post', `${apiURL}/api/branch/branchuserdelete`, {
        branchUserId: userId
    });
    return handleResponse(response);
}

export default {
    create,
    update,
    deleteBranch,
    listBranchs,
    listBranchsFromUser,
    getUsers,
    createUser,
    editUser,
    deleteUser,
    changestatusUser,
    changestatusBranch,
    branchUserAssign,
    branchUserDelete
}

