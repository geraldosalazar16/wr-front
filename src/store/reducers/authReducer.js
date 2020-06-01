let user = JSON.parse(sessionStorage.getItem('user'));

const initState = {
  authError: null,
  user
}

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOGIN_ERROR':
      return {
        ...state,
        authError: `Login failed. ${action.error}`,
        user: null
      }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.user,
        authError: null
      };

    case 'SIGNOUT_SUCCESS':
      return {
        ...state,
        user: null
      };

    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        signUpMessage: action.message,
        signUpError: null
      }

    case 'SIGNUP_ERROR':
      return {
        ...state,
        signUpError: action.error,
        signUpMessage: null
      }

    case 'RECOVER_PASSWORD_SUCCESS':
      return {
        ...state,
        recoverPasswordMessage: action.message,
        recoverPasswordError: null
      }

    case 'RECOVER_PASSWORD_ERROR':
      return {
        ...state,
        recoverPasswordError: action.error,
        recoverPasswordMessage: null
      }
    case 'VERIFY_ACCOUNT_SUCCESS':
      return {
        ...state,
        verifyAccountMessage: action.message,
        verifyAccountError: null
      }

    case 'VERIFY_ACCOUNT_ERROR':
      return {
        ...state,
        verifyAccountError: action.error,
        verifyAccountMessage: null
      }
    case 'CHANGE_PASSWORD_SUCCESS':
      return {
        ...state,
        changePasswordMessage: action.message,
        changePasswordError: null
      }

    case 'CHANGE_PASSWORD_ERROR':
      return {
        ...state,
        changePasswordError: action.error,
        changePasswordMessage: null
      }
    case 'CHANGE_PASSWORD_LI_SUCCESS':
      return {
        ...state,
        changePasswordLIMessage: action.message,
        changePasswordLIError: null
      }

    case 'CHANGE_PASSWORD_LI_ERROR':
      return {
        ...state,
        changePasswordLIError: action.error,
        changePasswordLIMessage: null
      }
    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        user: action.user,
        updateProfileMessage: action.message,
        updateProfileError: null
      }

    case 'UPDATE_PROFILE_ERROR':
      return {
        ...state,
        updateProfileError: action.error,
        updateProfileMessage: null,
        savedUserData: action.user
      }
    case 'AUTH_CLEAR_ERRORS':
      return {
        ...state,
        authError: null,
        signUpError: null
      }

    case 'BRANCH_USERS_LIST_SUCCESS':
      return {
        ...state,
        userBranch: action.branchesUser
      }

    case 'BRANCH_USERS_LIST_ERROR':
      return {
        ...state,
        error: action.error,
        message: null
      }

    default:
      return state
  }
};

export default authReducer;