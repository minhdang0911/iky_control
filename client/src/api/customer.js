import axios from './axios';
import Cookies from 'js-cookie';

export const apiCreateCustomer = (payload) => {
    return axios({
        url: '/customer/create',
        method: 'post',
        data: payload,
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
};

export const apiGetCustomers = () => {
    return axios({
        url: '/customer/getCustomer',
        method: 'get',
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
};
