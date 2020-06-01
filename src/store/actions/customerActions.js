import customerService from '../../services/customerService'
import { handleAxiosError } from '../../services/utilsService'
import authService from '../../services/authService'
import { displayError, displayMessage } from '../../services/toastService'
import { prettifyDate } from '../../services/utilsService'

export const list = () => {
    return (dispatch) => {
        dispatch({ type: 'CUSTOMER_LIST_REQUEST' })
        const user = authService.getCurrentUser();
        let promise;
        /**
         * Head office user should be able to see all customers of all branchs
         * Branch user should be able to see customer he created, so we must provide 
         * userId, partnerId and branchId
         */
        if (user.roleId === 3) {
            promise = customerService.listByBranch(user.partnerId, user.branchId);
        } else {
            promise = customerService.listByPartner(user.userId);
        }
        promise
            .then(result => {
                const customers = result.list.map((data, index) => {
                    return {
                        index,
                        active: data.active,
                        branchId: data.branch_id,
                        partnerId: data.company_id,
                        countryId: data.country_id,
                        countryName: data.countryName,
                        createdAt: data.created_at,
                        createdBy: data.created_by,
                        dob: new Date(data.date_of_birth),
                        sequenceId: data.sequence_id,
                        customerId: data.customer_id,
                        id: data.id,
                        name: data.name,
                        firstName: data.first_name,
                        lastName: data.last_name,
                        email: data.email,
                        contactNo: data.contact_number,
                        image: data.image,
                        customerTitle: data.title,
                        gender: data.gender,
                        noOfProperties: data.no_of_properties,
                        wrSubscription: data.wr_subscription,
                        contactsList: data.contact_list
                    }
                })
                dispatch({
                    type: 'CUSTOMER_LIST_SUCCESS',
                    customers
                });
                // dispatch(displayMessage('Customers listed successfully'))
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'CUSTOMER_LIST_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const listByBranch = (branchId) => {
    return (dispatch) => {
        dispatch({ type: 'BRANCH_CUSTOMER_LIST_REQUEST' })
        customerService.listByBranch(branchId).then(result => {
            const customers = result.list.map((data, index) => {
                return {
                    index,
                    active: data.active,
                    branchId: data.branch_id,
                    partnerId: data.company_id,
                    countryId: data.country_id,
                    countryName: data.countryName,
                    createdAt: data.created_at,
                    createdBy: data.created_by,
                    dob: new Date(data.date_of_birth),
                    sequenceId: data.sequence_id,
                    customerId: data.customer_id,
                    id: data.id,
                    name: data.name,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    email: data.email,
                    contactNo: data.contact_number,
                    image: data.image,
                    customerTitle: data.title,
                    gender: data.gender,
                    noOfProperties: data.no_of_properties,
                    wrSubscription: data.wr_subscription,
                    contactsList: data.contact_list
                }
            })
            dispatch({
                type: 'BRANCH_CUSTOMER_LIST_SUCCESS',
                customers
            });
            // dispatch(displayMessage('Customers listed successfully'))
        })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'BRANCH_CUSTOMER_LIST_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const startCreatingCustomer = () => {
    return {
        type: 'START_CREATING_CUSTOMER',
    }
}

export const create = (customer) => {
    return (dispatch) => {
        dispatch({ type: 'CUSTOMER_CREATE_REQUEST' })
        const user = authService.getCurrentUser();
        customer.partnerId = user.partnerId;
        customerService.create(customer)
            .then(result => {
                const newCustomer = {
                    ...customer,
                    id: result.id
                }
                dispatch({
                    type: 'CUSTOMER_CREATE_SUCCESS',
                    newCustomer
                });
                const user = authService.getCurrentUser();
                let promise;
                /**
                 * Head office user should be able to see all customers of all branchs
                 * Branch user should be able to see customer he created, so we must provide 
                 * userId, partnerId and branchId
                 */
                if (user.roleId === 3) {
                    promise = customerService.listByBranch(user.partnerId, user.branchId);
                } else {
                    promise = customerService.listByPartner(user.partnerId);
                }
                promise
                    .then(result => {
                        const customers = result.list.map((data, index) => {
                            return {
                                index,
                                active: data.active,
                                branchId: data.branch_id,
                                partnerId: data.company_id,
                                countryId: data.country_id,
                                countryName: data.countryName,
                                createdAt: data.created_at,
                                createdBy: data.created_by,
                                dob: new Date(data.date_of_birth),
                                sequenceId: data.sequence_id,
                                customerId: data.customer_id,
                                id: data.id,
                                name: data.name,
                                firstName: data.first_name,
                                lastName: data.last_name,
                                email: data.email,
                                contactNo: data.contact_number,
                                image: data.image,
                                customerTitle: data.title,
                                gender: data.gender,
                                noOfProperties: data.no_of_properties,
                                wrSubscription: data.wr_subscription,
                                contactsList: data.contact_list
                            }
                        });
                        dispatch({
                            type: 'CUSTOMER_LIST_SUCCESS',
                            customers
                        });
                        dispatch(displayMessage('Customer created'))
                    })
                    .catch(error => {
                        const errorMessage = handleAxiosError(error)
                        dispatch({
                            type: 'CUSTOMER_LIST_ERROR',
                            error: errorMessage
                        });
                        dispatch(displayError(errorMessage));
                    })
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'CUSTOMER_CREATE_ERROR',
                    error: errorMessage,
                    customer
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const startCustomerEdit = (customerId) => {
    return (dispatch) => {
        dispatch({ type: 'START_CUSTOMER_EDIT_REQUEST' })
        customerService.details(customerId)
            .then(result => {
                const customerContacts = result.contacts.map((c, index) => {
                    // const dob = new Date(c.date_of_birth);
                    return {
                        id: c.id,
                        firstName: c.first_name,
                        lastName: c.last_name,
                        email: c.email,
                        contactNo: c.contact_number,
                        dob: prettifyDate(c.date_of_birth)
                    }
                });
                dispatch({
                    type: 'START_CUSTOMER_EDIT_SUCCESS',
                    listContacts: customerContacts,
                });
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'START_CUSTOMER_EDIT_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const update = (customer) => {
    return (dispatch) => {
        dispatch({ type: 'CUSTOMER_UPDATE_REQUEST' })
        customerService.update(customer)
            .then(result => {
                dispatch({
                    type: 'CUSTOMER_UPDATE_SUCCESS',
                    customer
                });
                customerService.details(customer.customerId)
                    .then(result => {
                        customer.contacts = result.contacts.map((c, index) => {
                            return {
                                id: index,
                                firstName: c.first_name,
                                lastName: c.last_name,
                                email: c.email,
                                contactNo: c.contact_number,
                                dob: prettifyDate(c.date_of_birth)
                            }
                        });
                        dispatch({
                            type: 'START_CUSTOMER_EDIT_SUCCESS',
                            currentCustomer: customer,
                            listContacts: customer.contacts
                        });
                        dispatch(displayMessage('Customer updated'))
                    })
                    .catch(error => {
                        const errorMessage = handleAxiosError(error)
                        dispatch({
                            type: 'START_CUSTOMER_EDIT_ERROR',
                            customer,
                            error: errorMessage
                        });
                        dispatch(displayError(errorMessage));
                    })
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'CUSTOMER_UPDATE_ERROR',
                    customer,
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const finishEditCustomer = () => {
    return {
        type: 'FINISH_CUSTOMER_EDIT'
    }
}

export const del = (customer) => {
    return (dispatch) => {
        dispatch({ type: 'DELETE_CUSTOMER_REQUEST' })
        customerService.del(customer)
            .then(result => {
                dispatch({
                    type: 'DELETE_CUSTOMER_SUCCESS',
                    customer
                });
                dispatch(displayMessage('Customers deleted'))
                list(null)
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'DELETE_CUSTOMER_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const upload = (uploadCustomer, branchId) => {
    return (dispatch) => {
        dispatch({ type: 'UPLOAD_CUSTOMER_REQUEST' })
        customerService.upload(uploadCustomer, branchId)
            .then(result => {
                dispatch({
                    type: 'UPLOAD_CUSTOMER_SUCCESS',
                });
                /**
                 * Head office user should be able to see all customers of all branchs
                 * Branch user should be able to see customer he created, so we must provide 
                 * userId, partnerId and branchId
                 */
                dispatch({ type: 'BRANCH_CUSTOMER_LIST_REQUEST' })
                customerService.listByBranch(branchId).then(result => {
                    const customers = result.list.map((data, index) => {
                        return {
                            index,
                            active: data.active,
                            branchId: data.branch_id,
                            partnerId: data.company_id,
                            countryId: data.country_id,
                            countryName: data.countryName,
                            createdAt: data.created_at,
                            createdBy: data.created_by,
                            dob: new Date(data.date_of_birth),
                            sequenceId: data.sequence_id,
                            customerId: data.customer_id,
                            id: data.id,
                            name: data.name,
                            firstName: data.first_name,
                            lastName: data.last_name,
                            email: data.email,
                            contactNo: data.contact_number,
                            image: data.image,
                            customerTitle: data.title,
                            gender: data.gender,
                            noOfProperties: data.no_of_properties,
                            wrSubscription: data.wr_subscription,
                            contactsList: data.contact_list
                        }
                    })
                    dispatch({
                        type: 'BRANCH_CUSTOMER_LIST_SUCCESS',
                        customers
                    });
                    // dispatch(displayMessage('Customers listed successfully'))
                })
                    .catch(error => {
                        const errorMessage = handleAxiosError(error)
                        dispatch({
                            type: 'BRANCH_CUSTOMER_LIST_ERROR',
                            error: errorMessage
                        });
                        dispatch(displayError(errorMessage));
                    })
                /*
                if (user.roleId === 3) {
                    promise = customerService.listByBranch(user.partnerId, user.branchId);
                } else {
                    promise = customerService.listByPartner(user.partnerId);
                }
                promise
                    .then(result => {
                        const customers = result.list.map((data, index) => {
                            return {
                                index,
                                active: data.active,
                                branchId: data.branch_id,
                                partnerId: data.company_id,
                                countryId: data.country_id,
                                countryName: data.countryName,
                                createdAt: data.created_at,
                                createdBy: data.created_by,
                                dob: new Date(data.date_of_birth),
                                sequenceId: data.sequence_id,
                                customerId: data.customer_id,
                                id: data.id,
                                name: data.name,
                                firstName: data.first_name,
                                lastName: data.last_name,
                                email: data.email,
                                contactNo: data.contact_number,
                                image: data.image,
                                customerTitle: data.title,
                                gender: data.gender,
                                noOfProperties: data.no_of_properties,
                                wrSubscription: data.wr_subscription,
                                contactsList: data.contact_list
                            }
                        })
                        dispatch({
                            type: 'CUSTOMER_LIST_SUCCESS',
                            customers
                        });
                        dispatch(displayMessage('Customers loaded successfully'))
                    })
                    .catch(error => {
                        const errorMessage = handleAxiosError(error)
                        dispatch({
                            type: 'CUSTOMER_LIST_ERROR',
                            error: errorMessage
                        });
                        dispatch(displayError(errorMessage));
                    })
                    */
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'UPLOAD_CUSTOMER_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const getCustomerOfUserxID = (id1) => {
    return (dispatch) => {
        dispatch({ type: 'CUSTOMER_USERID_REQUEST' })
        const user = authService.getCurrentUser();
        let promise;
        /**
         * Head office user should be able to see all customers of all branchs
         * Branch user should be able to see customer he created, so we must provide 
         * userId, partnerId and branchId
         */
        if (user.roleId === 3) {
            promise = customerService.listByBranch(user.partnerId, user.branchId);
        } else {
            promise = customerService.listByPartner(user.userId);
        }
        promise
            .then(result => {
                const customers = result.list.map((data, index) => {
                    return {
                        index,
                        active: data.active,
                        branchId: data.branch_id,
                        partnerId: data.company_id,
                        countryId: data.country_id,
                        countryName: data.countryName,
                        createdAt: data.created_at,
                        createdBy: data.created_by,
                        dob: new Date(data.date_of_birth),
                        sequenceId: data.sequence_id,
                        customerId: data.customer_id,
                        id: data.id,
                        name: data.name,
                        firstName: data.first_name,
                        lastName: data.last_name,
                        email: data.email,
                        contactNo: data.contact_number,
                        image: data.image,
                        customerTitle: data.title,
                        gender: data.gender,
                        noOfProperties: data.no_of_properties,
                        wrSubscription: data.wr_subscription,
                        contactsList: data.contact_list
                    }
                });
                const currentCustomer1 = customers.filter((n) => {
                    if (n.id === id1) {
                        return n;
                    }
                    return null;
                });
                const currentCustomer = currentCustomer1[0];

                customerService.details(currentCustomer)
                    .then(result => {
                        currentCustomer.contacts = result.contacts.map((c, index) => {
                            const dob = new Date(c.date_of_birth);
                            return {
                                id: index,
                                firstName: c.first_name,
                                lastName: c.last_name,
                                email: c.email,
                                contactNo: c.contact_number,
                                dob
                            }
                        });

                    })
                    .catch(error => {
                        const errorMessage = handleAxiosError(error)
                        dispatch(displayError(errorMessage));
                    })
                dispatch({
                    type: 'CUSTOMER_USERID_SUCCESS',
                    currentCustomer,
                    customers
                });
                //dispatch(displayMessage('Customers listed successfully'))
            })
            .catch(error => {
                const errorMessage = handleAxiosError(error)
                dispatch({
                    type: 'CUSTOMER_USERID_ERROR',
                    error: errorMessage
                });
                dispatch(displayError(errorMessage));
            })
    }
}

export const addContact = (contact) => {
    return {
        type: 'ADD_CUSTOMER_CONTACT',
        contact
    };
}

export const editContact = (contact) => {
    return {
        type: 'EDIT_CUSTOMER_CONTACT',
        contact
    };
}

export const deleteContact = (contact) => {
    return {
        type: 'DELETE_CUSTOMER_CONTACT',
        contact
    };
}