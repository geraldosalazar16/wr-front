import {request, handleResponse} from './httpService'

const apiURL = process.env.REACT_APP_API_URL;

const listByBranch = async (branchId) => {
    let route = `${apiURL}/api/customer/customerlistbybranch`;
    const response = await request('post', route, {branchId});
    return handleResponse(response);
}

const listByPartner = async (partnerId) => {
    let route = `${apiURL}/api/customer/customerlistbypartner`;
    const response = await request('post', route, {partnerId});
    return handleResponse(response);
}

const create = async (customer) => {
    let route = `${apiURL}/api/customer/customercreate`;
    const response = await request('post', route, customer);
    return handleResponse(response);
}

const update = async (customer) => {
    let route = `${apiURL}/api/customer/customerupdate`;
    const response = await request('post', route, customer);
    return handleResponse(response);
}

const del = async (customer) => {
    let route = `${apiURL}/api/customer/customerdelete`;
    const response = await request('post', route, {
        customerId: customer.id
    });
    return handleResponse(response);
}

const statuschange = async (customer) => {
    let route = `${apiURL}/api/customer/customerstatuschange`;
    const response = await request('post', route, {
        customerId: customer.id,
        customerStatus: 0
    });
    return handleResponse(response);
}

const details = async (customerId) => {
    let route = `${apiURL}/api/customer/customerdetails`;
    const response = await request('post', route, { customerId });
    return handleResponse(response);
}

const upload = async (uploadCustomer, branchId) => {
    let router = `${apiURL}/api/customer/customerbulkupload`;
    const response = await request('post', router, {
        customersList: uploadCustomer,
        branchId
    });
    return handleResponse(response);
}

export default {
    listByBranch,
    listByPartner,
    create,
    update,
    del,
    details,
    upload,
    statuschange
}

