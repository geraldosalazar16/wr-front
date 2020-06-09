import employeeService from '../../services/employeeService'
import { handleAxiosError } from '../../services/utilsService'
import authService from '../../services/authService';
import { displayError, displayMessage } from '../../services/toastService'

export const listUsers = (userId) => {
    return (dispatch) => {
       // dispatch({type: 'EMPLOYEE_LIST_REQUEST'})
        employeeService.getUsersEmployees(userId)
            .then(result => {
                
                const employees = result.list.map((data, index) => {
                    console.log('user', data)
                    return {
                        index,
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
                        userName: data.user_name
                    }
                })
                dispatch({
                    type: 'EMPLOYEE_LIST_SUCCESS',
                    employees
                });
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'EMPLOYEE_LIST_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const startUserCreate = (currentBranch) => {
    return {
        type: 'START_EMPLOYEE_CREATE',
        currentBranch
    }
}

export const createBranchUser = (user, state) => {
    return (dispatch) => {
        dispatch({type: 'CREATE_EMPLOYEE_REQUEST'})
        employeeService.createUser(user)
            .then(result => {
                const newUser = {
                    ...user,
                    userId: result.userId
                }
                dispatch({
                    type: 'CREATE_EMPLOYEE_SUCCESS',
                    newUser
                });
                //dispatch(displayMessage('Employee created'))
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'CREATE_EMPLOYEE_ERROR',
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
        type: 'START_EMPLOYEE_EDIT',
        user
    }
}

export const editBranchUser = (user) => {
    return (dispatch) => {
        dispatch({type: 'EDIT_EMPLOYEE_REQUEST'})
        employeeService.editUser(user)
            .then(result => {
                dispatch({
                    type: 'EDIT_EMPLOYEE_SUCCESS',
                    user
                });
                //dispatch(displayMessage('Employee updated'))
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'EDIT_EMPLOYEE_ERROR',
                    error: errorMessage,
                    user
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const finishEditBranchUser = () => {
    return {
        type: 'FINISH_EMPLOYEE_EDIT'
    }
}

export const deleteBranchUser = user => {
    return (dispatch) => {
        dispatch({type: 'DELETE_EMPLOYEE_REQUEST'})
        employeeService.deleteUser(user)
            .then(result => {
                dispatch({
                    type: 'DELETE_EMPLOYEE_SUCCESS',
                    user
                });
                //dispatch(displayMessage('Employee deleted'))
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'DELETE_EMPLOYEE_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const clearBranchMessages = () => {
    return {
        type: 'CLEAR_EMPLOYEE_MESSAGES'
    }
}

export const clearBranchUserCreateError = () => {
    return {
        type: 'CLEAR_EMPLOYEE_CREATE_ERROR'
    }
}

export const changePasswordBranchUser = (userId, newPassword) => {
    return (dispatch) => {
        dispatch({type: 'CHANGE_PASSWORD_EMP_REQUEST'})
        authService.changePasswordLogedIn(userId, newPassword)
        .then(result => {
            dispatch({
                type: 'CHANGE_PASSWORD_EMP_SUCCESS',
                message: result.res
            });
            //dispatch(displayMessage('Password updated'))
        })
        .catch(error => {
            const errorMessage = handleAxiosError(error)
            dispatch({
                type: 'CHANGE_PASSWORD_EMP_ERROR',
                error: errorMessage
            });
            dispatch(displayError(errorMessage));
        })
	}
}