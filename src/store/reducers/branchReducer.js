
const initState = {
    branches: [],
    users: [],
    error: null
}

const branchReducer = (state = initState, action) => {
    switch (action.type) {
        case 'BRANCH_LIST_SUCCESS':
            return {
                ...state,
                branches: action.branches,
                message: 'Branchs listed successfully',
                error: null
            }
        case 'BRANCH_LIST_ERROR':
            return {
                ...state,
                error: action.error,
                message: null
            }
        case 'USER_BRANCH_LIST_SUCCESS':
            return {
                ...state,
                branches: action.branches,
                message: 'Branchs listed successfully',
                error: null
            }
        case 'USER_BRANCH_LIST_ERROR':
            return {
                ...state,
                error: action.error,
                message: null
            }

        case 'BRANCH_CREATE_SUCCESS':
            const currentBranches = state.branches;
            currentBranches.push(action.newBranch);
            return {
                ...state,
                error: null,
                message: 'Branch created successfully',
                branches: currentBranches
            }
        case 'BRANCH_CREATE_ERROR':
            return {
                ...state,
                savedBranch: action.branch,
                error: action.error,
                message: null
            }

        case 'BRANCH_UPDATE_SUCCESS':
            // Replace old branch with the new values
            const newBranches = state.branches.map(b => b.branchId !== action.branch.branchId ? b : action.branch)
            return {
                ...state,
                currentBranch: action.branch,
                branches: newBranches,
                error: null,
                message: 'Branch updated successfully'
            }
        case 'BRANCH_UPDATE_ERROR':
            return {
                ...state,
                currentBranch: action.branch,
                error: action.error,
                message: null
            }

        case 'FINISH_BRANCH_EDIT':
            return {
                ...state,
                message: null,
                error: null
            }

        case 'BRANCH_DELETE_SUCCESS':
            // Delet branch from list
            return {
                ...state,
                branches: state.branches.filter(b => b.branchId !== action.branch.branchId),
                error: null,
                message: 'Branch deleted successfully'
            }
        case 'BRANCH_DELETE_ERROR':
            return {
                ...state,
                error: action.error,
                message: null
            }

        case 'START_BRANCH_EDIT':
            return {
                ...state,
                currentBranch: action.currentBranch
            }
        case 'VIEW_DETAILS_BRANCH_SUCCESS':
            return {
                ...state,
                detailsBranch: action.currentBranch,
                users: action.users
            }
        case 'BRANCH_USERS_LIST_SUCCESS':
            return {
                ...state,
                users: action.users,
                message: 'Branch users listed successfully',
                error: null
            }
        case 'BRANCH_USERS_LIST_ERROR':
            return {
                ...state,
                error: action.error,
                message: null
            }
        case 'START_BRANCH_USER_CREATE':
            return {
                ...state,
                currentBranch: action.currentBranch
            }
        case 'CREATE_BRANCH_USER_SUCCESS':
            const currentUsers = state.users;
            currentUsers.push(action.newUser);
            return {
                ...state,
                message: 'User created successfully',
                error: null,
                users: currentUsers
            }
        case 'CREATE_BRANCH_USER_ERROR':
            return {
                ...state,
                error: action.error,
                message: null,
                savedBranchUser: action.user,
                savedBranchUserCreateState: action.state
            }
        case 'START_BRANCH_USER_EDIT':
            return {
                ...state,
                branchUser: action.user
            }
        case 'EDIT_BRANCH_USER_ERROR':
            return {
                ...state,
                branchUser: action.user,
                error: action.error,
                message: null
            }
        case 'EDIT_BRANCH_USER_SUCCESS':
            // Replace old users with the new values
            const newUsers = state.users.map(b => b.userId !== action.user.userId ? b : action.user)
            return {
                ...state,
                error: null,
                message: 'User data updated',
                branchUser: action.user,
                users: newUsers
            }
        case 'FINISH_BRANCH_USER_EDIT':
            return {
                ...state,
                message: null,
                error: null
            }
        case 'DELETE_BRANCH_USER_ERROR':
            return {
                ...state,
                error: action.error,
                message: null
            }
        case 'DELETE_BRANCH_USER_SUCCESS':
            return {
                ...state,
                error: null,
                message: 'User deleted successfully',
                users: state.users.filter(b => b.userId !== action.user.userId),
            }
        case 'CLEAR_BRANCH_USER_MESSAGES':
            return {
                ...state,
                error: null,
                message: null
            }
        case 'CLEAR_BRANCH_USER_CREATE_ERROR':
            return {
                ...state,
                error: null,
            }
        case 'CHANGE_PASSWORD_BU_SUCCESS':
            return {
                ...state,
                message: action.message,
                error: null
            }

        case 'CHANGE_PASSWORD_BU_ERROR':
            return {
                ...state,
                error: action.error,
                message: null
            }

        case 'BRANCH_USER_ASSIGN_SUCCESS':
            return {
                ...state,
                error: null
            }

        case 'BRANCH_USER_ASSIGN_ERROR':
            return {
                ...state,
                error: action.error,
                message: null
            }

        case 'BRANCH_USER_DELETE_SUCCESS':
            console.log(state.users)
            return {
                ...state,
                users: state.users.filter(b => b.branchUsers[0].id !== action.userId),
                error: null
            }

        case 'BRANCH_USER_DELETE_ERROR':
            return {
                ...state,
                error: action.error,
                message: null
            }
        default:
            return state
    }
};

export default branchReducer;