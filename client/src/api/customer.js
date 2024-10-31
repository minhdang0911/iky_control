import axios from './axios';

export const apiCreateCustomer = (payload) => {
    return axios({
        url: '/customer/create',
        method: 'post',
        data: payload,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
};

export const apiGetCustomers = () => {
    return axios({
        url: '/customer/getCustomer',
        method: 'get',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
};
