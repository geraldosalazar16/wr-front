
const initState = {
    users: [],
    employeelist: [],
    error: null
}

const employeeReducer = (state = initState, action) => {
    switch (action.type) {
        
        case 'EMPLOYEE_LIST_SUCCESS':
            console.log(action.employees);
            return {
                ...state,
                employeelist: action.employees,
                message: 'Employee listed successfully',
                error: null
            }
        case 'EMPLOYEE_LIST_ERROR':
            return {
                ...state,
                error: action.error,
                message: null
            }
        case 'START_EMPLOYEE_CREATE':
            return {
                ...state,
                currentBranch: action.currentBranch
            }
        case 'CREATE_EMPLOYEE_SUCCESS':
            const currentEmployees = state.employeelist;
            currentEmployees.push(action.newUser);
            return {
                ...state,
                message: 'Employee created successfully',
                error: null,
                employeelist: currentEmployees
            }
        case 'CREATE_EMPLOYEE_ERROR':
            return {
                ...state,
                error: action.error,
                message: null,
                savedBranchUser: action.user,
                savedBranchUserCreateState: action.state
            }
        case 'START_EMPLOYEE_EDIT':
            return {
                ...state,
                branchUser: action.user
            }
        case 'EDIT_EMPLOYEE_ERROR':
            return {
                ...state,
                branchUser: action.user,
                error: action.error,
                message: null
            }
        case 'EDIT_EMPLOYEE_SUCCESS':
            // Replace old users with the new values
            return {
                ...state,
                error: null,
                message: 'Employee data updated',
                branchUser: action.user,
                users: [...state.employeelist].map(b => b.userId !== action.user.userId ? b : action.user)
            }
        case 'FINISH_EMPLOYEE_EDIT':
            return {
                ...state,
                message: null,
                error: null
            }
        case 'DELETE_EMPLOYEE_ERROR':
            return {
                ...state,
                error: action.error,
                message: null
            }
        case 'DELETE_EMPLOYEE_SUCCESS':
            return {
                ...state,
                error: null,
                message: 'Employee deleted successfully',
                employeelist: [...state.employeelist].filter(b => b.userId !== action.user.userId),
            } 
        default:
            return state
    }
};

export default employeeReducer;