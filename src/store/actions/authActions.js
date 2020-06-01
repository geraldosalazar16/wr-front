import authService from '../../services/authService'
import {handleAxiosError} from '../../services/utilsService'
import {displayError, displayMessage} from '../../services/toastService'
import branchService from "../../services/branchService";

export const login = (credentials) => {
    return (dispatch) => {
        dispatch({type: 'LOGIN_REQUEST'});
        authService.login(credentials)
            .then(result => {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    user: result.user
                });
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'LOGIN_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const signOut = () => {
    authService.signout();
    return (dispatch) => {
        dispatch({type: 'SIGNOUT_SUCCESS'});
    }
}

export const signUp = (newUser) => {
    console.log(newUser);
    return (dispatch) => {
        dispatch({type: 'SIGNUP_REQUEST'});
        authService.signup(newUser)
            .then(result => {
                dispatch({
                    type: 'SIGNUP_SUCCESS',
                    message: result.res
                });
                dispatch(displayMessage(result.res));
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'SIGNUP_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const recoverPassword = (email) => {
    return (dispatch) => {
        dispatch({type: 'RECOVER_PASSWORD_REQUEST'});
        authService.recoverPassword(email)
            .then(result => {
                dispatch({
                    type: 'RECOVER_PASSWORD_SUCCESS',
                    message: result.res
                });
                dispatch(displayMessage(result.res));
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'RECOVER_PASSWORD_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const verifyAccount = (token) => {
    return (dispatch) => {
        dispatch({type: 'VERIFY_ACCOUNT_REQUEST'});
        authService.verifyAccount(token)
            .then(result => {
                dispatch({
                    type: 'VERIFY_ACCOUNT_SUCCESS',
                    message: result.res
                });
                dispatch(displayMessage(result.res));
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'VERIFY_ACCOUNT_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const changePassword = (token, newPassword) => {
    return (dispatch) => {
        dispatch({type: 'CHANGE_PASSWORD_REQUEST'});
        authService.changePassword(token, newPassword)
            .then(result => {
                dispatch({
                    type: 'CHANGE_PASSWORD_SUCCESS',
                    message: result.res
                });
                dispatch(displayMessage(result.res));
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'CHANGE_PASSWORD_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const updateProfileBranchUser = (user) => {
    return (dispatch) => {
        dispatch({type: 'UPDATE_PROFILE_REQUEST'});
        branchService.editUser(user)
            .then(result => {
                const currentUserData = JSON.parse(sessionStorage.getItem('user'));
                const newUserData = Object.assign(currentUserData, user);
                sessionStorage.setItem('user', JSON.stringify(newUserData));
                dispatch({
                    type: 'UPDATE_PROFILE_SUCCESS',
                    message: 'Profile data updated',
                    user: newUserData
                });
                dispatch(displayMessage('Profile data updated'));
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'UPDATE_PROFILE_ERROR',
                    error: errorMessage,
                    user
                });
                dispatch(displayError(errorMessage));
            })

    }
}

export const updateProfile = (user) => {
    return (dispatch) => {
        dispatch({type: 'UPDATE_PROFILE_REQUEST'});
        authService.updateProfile(user)
            .then(result => {
                const currentUserData = JSON.parse(sessionStorage.getItem('user'));
                const newUserData = Object.assign(currentUserData, user);
                sessionStorage.setItem('user', JSON.stringify(newUserData));
                dispatch({
                    type: 'UPDATE_PROFILE_SUCCESS',
                    message: result.res,
                    user
                });
                dispatch(displayMessage(result.res));
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'UPDATE_PROFILE_ERROR',
                    error: errorMessage,
                    user
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const changePasswordLogedIn = (userId, newPassword) => {
    return (dispatch) => {
        dispatch({type: 'CHANGE_PASSWORD_LI_REQUEST'});
        authService.changePasswordLogedIn(userId, newPassword)
            .then(result => {
                dispatch({
                    type: 'CHANGE_PASSWORD_LI_SUCCESS',
                    message: result.res
                });
                dispatch(displayMessage(result.res));
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'CHANGE_PASSWORD_LI_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const clearErrors = () => {
    return {
        type: 'AUTH_CLEAR_ERRORS'
    }
}

export const listUserBranch = (userId) => {
    return (dispatch) => {
        dispatch({type: 'BRANCH_USERS_LIST_REQUEST'})
        authService.listUserBranch(userId).then(
            result => {
                const branchesUser = result.list.map(data => {
                    return {
                        id: data.id,
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
                    type: 'BRANCH_USERS_LIST_SUCCESS',
                    branchesUser
                });
            }
        ).catch(error => {
            const errorMessage = handleAxiosError(error);
            dispatch({
                type: 'BRANCH_USERS_LIST_ERROR',
                error: errorMessage
            });
            dispatch(displayError(errorMessage));
        })
    }
}