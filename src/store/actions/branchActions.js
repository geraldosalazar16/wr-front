import { handleAxiosError } from '../../services/utilsService'
import authService from '../../services/authService';
import { displayError, displayMessage } from '../../services/toastService'
import branchService from "../../services/branchService";

export const list = (noMessage) => {
    return (dispatch) => {
        const user = authService.getCurrentUser();
        dispatch({ type: 'BRANCH_LIST_REQUEST' });
        branchService.listBranchs(user.userId)
            .then(result => {
                const branches = result.list.map(data => {
                    return {
                        branchId: data.id,
                        branchCode: data.code,
                        companyId: data.company_id,
                        branchName: data.name,
                        contactNo: data.contact_number,
                        address1: data.address_1,
                        address2: data.address_2,
                        address3: data.address_3,
                        subrub: data.subrub,
                        stateId: data.state_id,
                        countryId: data.country_id,
                        postalCode: data.postal_code
                    }
                })
                dispatch({
                    type: 'BRANCH_LIST_SUCCESS',
                    branches
                });
                /*
                if (!noMessage) {
                    dispatch(displayMessage('Branchs listed successfully'))
                }
                */
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'BRANCH_LIST_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const listFromUser = () => {
    return (dispatch) => {
        const user = authService.getCurrentUser();
        dispatch({ type: 'USER_BRANCH_LIST_REQUEST' });
        branchService.listBranchsFromUser(user.userId)
            .then(result => {
                const branches = result.list.map(data => {
                    return {
                        branchId: data.id,
                        branchCode: data.code,
                        companyId: data.company_id,
                        branchName: data.name,
                        contactNo: data.contact_number,
                        address1: data.address_1,
                        address2: data.address_2,
                        address3: data.address_3,
                        subrub: data.subrub,
                        stateId: data.state_id,
                        countryId: data.country_id,
                        postalCode: data.postal_code
                    }
                })
                dispatch({
                    type: 'USER_BRANCH_LIST_SUCCESS',
                    branches
                });
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'USER_BRANCH_LIST_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const create = (branch, state) => {
    return (dispatch) => {
        dispatch({ type: 'BRANCH_CREATE_REQUEST' })
        branchService.create(branch)
            .then(result => {
                const newBranch = {
                    ...branch,
                    branchId: result.branchId
                }
                dispatch({
                    type: 'BRANCH_CREATE_SUCCESS',
                    newBranch
                });
                dispatch(displayMessage('Branch created'))
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'BRANCH_CREATE_ERROR',
                    error: errorMessage,
                    branch,
                    state
                });
                dispatch(displayError(errorMessage))
            })
    }
}

export const update = (branch) => {
    return (dispatch) => {
        dispatch({ type: 'BRANCH_UPDATE_REQUEST' })
        branchService.update(branch)
            .then(result => {
                dispatch({
                    type: 'BRANCH_UPDATE_SUCCESS',
                    branch
                });
                dispatch(displayMessage('Branch updated'))
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'BRANCH_UPDATE_ERROR',
                    branch,
                    error: errorMessage
                });
                dispatch(displayError(errorMessage))
            })
    }
}

export const deleteBranch = (branch) => {
    return (dispatch) => {
        dispatch({ type: 'BRANCH_DELETE_REQUEST' })
        branchService.deleteBranch(branch)
            .then(result => {
                dispatch({
                    type: 'BRANCH_DELETE_SUCCESS',
                    branch
                });
                dispatch(displayMessage('Branch deleted'))
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'BRANCH_DELETE_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage))
            })
    }
}


export const startBranchEdit = (currentBranch) => {
    return {
        type: 'START_BRANCH_EDIT',
        currentBranch
    }
}

export const finishEditBranch = () => {
    return {
        type: 'FINISH_BRANCH_EDIT'
    }
}

export const viewDetailsBranch = (currentBranch) => {
    return (dispatch) => {
        const user = authService.getCurrentUser();
        dispatch({ type: 'VIEW_DETAILS_BRANCH_REQUEST' })
        branchService.getUsers(user.userId, currentBranch.branchId)
            .then(result => {
                const users = result.list.map(data => {
                    return {
                        userId: data.id,
                        partnerId: data.patner_id,
                        companyName: data.company_name,
                        title: data.title,
                        firstName: data.first_name,
                        lastName: data.last_name,
                        userEmail: data.email,
                        designationId: data.designation_id,
                        address1: data.address_1,
                        address2: data.address_2,
                        address3: data.address_3,
                        contactNo1: data.contact_number_1,
                        contactNo2: data.contact_number_2,
                        subrub: data.subrub,
                        stateId: data.state_id,
                        countryId: data.country_id || 1, // 1 stands for Australia, as default
                        postalCode: data.postal_code,
                        userName: data.user_name
                    }
                })
                dispatch({
                    type: 'VIEW_DETAILS_BRANCH_SUCCESS',
                    currentBranch,
                    users
                });
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'VIEW_DETAILS_BRANCH_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const listUsers = (branchId) => {
    return (dispatch) => {
        dispatch({ type: 'BRANCH_USERS_LIST_REQUEST' })
        branchService.getUsers(branchId)
            .then(result => {
                const users = result.list.map(data => {
                    return {
                        userId: data.id,
                        partnerId: data.patner_id,
                        companyName: data.company_ame,
                        title: data.title,
                        firstName: data.first_name,
                        lastName: data.last_name,
                        userEmail: data.email,
                        designationId: data.designation_id,
                        address1: data.address_1,
                        address2: data.address_2,
                        address3: data.address_3,
                        contactNo1: data.contact_number_1,
                        contactNo2: data.contact_number_2,
                        subrub: data.subrub,
                        stateId: data.state_id,
                        countryId: data.country_id || 1, // 1 stands for Australia, as default
                        postalCode: data.postal_code,
                        userName: data.user_name,
                        branchUsers: data.branch_users
                    }
                })
                dispatch({
                    type: 'BRANCH_USERS_LIST_SUCCESS',
                    users
                });
                dispatch(displayMessage('Branchs Users listed successfully'))
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'BRANCH_USERS_LIST_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const startUserCreate = (currentBranch) => {
    return {
        type: 'START_BRANCH_USER_CREATE',
        currentBranch
    }
}

export const createBranchUser = (user, state) => {
    return (dispatch) => {
        dispatch({ type: 'CREATE_BRANCH_USER_REQUEST' })
        branchService.createUser(user)
            .then(result => {
                const newUser = {
                    ...user,
                    userId: result.userId
                }
                dispatch({
                    type: 'CREATE_BRANCH_USER_SUCCESS',
                    newUser
                });
                dispatch(displayMessage('Branch user created'))
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'CREATE_BRANCH_USER_ERROR',
                    error: errorMessage,
                    user,
                    state
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const startUserEdit = (user) => {
    return {
        type: 'START_BRANCH_USER_EDIT',
        user
    }
}

export const editBranchUser = (user) => {
    return (dispatch) => {
        dispatch({ type: 'EDIT_BRANCH_USER_REQUEST' })
        branchService.editUser(user)
            .then(result => {
                dispatch({
                    type: 'EDIT_BRANCH_USER_SUCCESS',
                    user
                });
                dispatch(displayMessage('Branch user updated'))
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'EDIT_BRANCH_USER_ERROR',
                    error: errorMessage,
                    user
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const finishEditBranchUser = () => {
    return {
        type: 'FINISH_BRANCH_USER_EDIT'
    }
}

export const deleteBranchUser = user => {
    return (dispatch) => {
        dispatch({ type: 'DELETE_BRANCH_USER_REQUEST' })
        branchService.deleteUser(user)
            .then(result => {
                dispatch({
                    type: 'DELETE_BRANCH_USER_SUCCESS',
                    user
                });
                dispatch(displayMessage('Branch user deleted'))
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'DELETE_BRANCH_USER_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const clearBranchMessages = () => {
    return {
        type: 'CLEAR_BRANCH_USER_MESSAGES'
    }
}

export const clearBranchUserCreateError = () => {
    return {
        type: 'CLEAR_BRANCH_USER_CREATE_ERROR'
    }
}

export const changePasswordBranchUser = (userId, newPassword) => {
    return (dispatch) => {
        dispatch({ type: 'CHANGE_PASSWORD_BU_REQUEST' })
        authService.changePasswordLogedIn(userId, newPassword)
            .then(result => {
                dispatch({
                    type: 'CHANGE_PASSWORD_BU_SUCCESS',
                    message: result.res
                });
                dispatch(displayMessage('Password updated'))
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'CHANGE_PASSWORD_BU_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const branchUserAssign = (userList) => {
    return (dispatch) => {
        dispatch({ type: 'BRANCH_USER_ASSIGN_REQUEST' });
        const branchId = userList[0].branch_id;
        branchService.branchUserAssign(userList).then(result => {
            branchService.getUsers(branchId).then(result => {
                const users = result.list.map(data => {
                    return {
                        userId: data.id,
                        partnerId: data.patner_id,
                        companyName: data.company_ame,
                        title: data.title,
                        firstName: data.first_name,
                        lastName: data.last_name,
                        userEmail: data.email,
                        designationId: data.designation_id,
                        address1: data.address_1,
                        address2: data.address_2,
                        address3: data.address_3,
                        contactNo1: data.contact_number_1,
                        contactNo2: data.contact_number_2,
                        subrub: data.subrub,
                        stateId: data.state_id,
                        countryId: data.country_id || 1, // 1 stands for Australia, as default
                        postalCode: data.postal_code,
                        userName: data.user_name,
                        branchUsers: data.branch_users
                    }
                })
                dispatch({
                    type: 'BRANCH_USERS_LIST_SUCCESS',
                    users
                });
                dispatch({
                    type: 'BRANCH_USER_ASSIGN_SUCCESS',
                })
                dispatch(displayMessage('Users assign'));
            });
        }).catch(error => {
            const errorMessage = handleAxiosError(error)
            dispatch({
                type: 'BRANCH_USER_ASSIGN_ERROR',
                error: errorMessage
            });
            dispatch(displayError(errorMessage));
        })
    }
}

export const branchUserDelete = (userId) => {
    return (dispatch) => {
        dispatch({ type: 'BRANCH_USER_DELETE_REQUEST' });
        branchService.branchUserDelete(userId).then(result => {
            dispatch({
                type: 'BRANCH_USER_DELETE_SUCCESS',
                userId
            })
            dispatch(displayMessage('Users delete'));
        }).catch(error => {
            const errorMessage = handleAxiosError(error)
            dispatch({
                type: 'BRANCH_USER_DELETE_ERROR',
                error: errorMessage
            });
            dispatch(displayError(errorMessage));
        })
    }
}