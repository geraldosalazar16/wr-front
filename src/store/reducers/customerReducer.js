const initState = {
    customers: [],
    error: null
}

const customerReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CUSTOMER_LIST_SUCCESS':
            return {
                ...state,
                customers: action.customers,
                message: 'Customers listed successfully',
                error: null
            }
        case 'CUSTOMER_LIST_ERROR':
            return {
                ...state,
                error: action.error,
                message: null
            }
        case 'BRANCH_CUSTOMER_LIST_SUCCESS':
            return {
                ...state,
                customers: action.customers,
                message: 'Customers listed successfully',
                error: null
            }
        case 'BRANCH_CUSTOMER_LIST_ERROR':
            return {
                ...state,
                error: action.error,
                message: null
            }
        case 'START_CREATING_CUSTOMER':
            return {
                ...state,
                action: 'create'
            }
        case 'CUSTOMER_CREATE_SUCCESS':
            return {
                ...state,
                error: null,
                message: 'Customer created successfully',
            }
        case 'CUSTOMER_CREATE_ERROR':
            return {
                ...state,
                customerCreated: action.customer,
                error: action.error,
                message: null
            }
        case 'START_CUSTOMER_EDIT_SUCCESS':
            return {
                ...state,
                error: null,
                message: null,
                currentCustomer: action.currentCustomer,
                listContacts: action.listContacts
            }
        case 'FINISH_CUSTOMER_EDIT':
            return {
                ...state,
                message: null,
                error: null
            }
        case 'CUSTOMER_UPDATE_SUCCESS':
            // Replace old branch with the new values
            return {
                ...state,
                currentCustomer: action.customer,
                listContacts: action.listContacts,
                customers: state.customers.map(c => c.id !== action.customer.id ? c : action.customer),
                error: null,
                message: 'Customer updated successfully'
            }
        case 'CUSTOMER_UPDATE_ERROR':
            return {
                ...state,
                currentCustomer: action.customer,
                error: action.error,
                message: null
            }
        case 'DELETE_CUSTOMER_ERROR':
            return {
                ...state,
                error: action.error,
                message: null
            }
        case 'DELETE_CUSTOMER_SUCCESS':
            return {
                ...state,
                error: null,
                message: 'User deleted',
                customers: state.customers.filter(c => c.id !== action.customer.id),
            }
        case 'UPLOAD_CUSTOMER_SUCCESS':
            return {
                ...state,
                error: null,
                message: 'File upload success',
            }
        case 'UPLOAD_CUSTOMER_ERROR':
            return {
                ...state,
                error: action.error,
                message: null
            }
        case 'CUSTOMER_USERID_SUCCESS':
            return {
                ...state,
                error: null,
                message: null,
                customers: action.customers,
                listContacts: action.listContacts,
                currentCustomer: action.currentCustomer
            }
        case 'CUSTOMER_USERID_ERROR':
            return {
                ...state,
                error: null,
                message: null,
                customers: action.customers
            }
        case 'ADD_CUSTOMER_CONTACT':
            return {
                ...state,
                listContacts: [...state.listContacts, action.contact]
            }
        case 'EDIT_CUSTOMER_CONTACT':
            const oldContacts = [...state.listContacts];
            const index = oldContacts.findIndex(c => c.id === action.contact.id)
            oldContacts.splice(index, 1, action.contact)
            return {
                ...state,
                listContacts: oldContacts
            }
        case 'DELETE_CUSTOMER_CONTACT':
            const contactsBeforeDelete = [...state.listContacts];
            const indexToRemove = contactsBeforeDelete.findIndex(c => c.id === action.contact.id)
            contactsBeforeDelete.splice(indexToRemove, 1);
            return {
                ...state,
                listContacts: contactsBeforeDelete
            }
        default:
            return state
    }
};

export default customerReducer;