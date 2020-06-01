export const customerSelector = (state, id) => {
    return state.customer.customers.filter(c => c.id === id);
}