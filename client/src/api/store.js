import axios from './axios';

export const apiGetAllStore = () => {
    return axios({
        url: '/store/getallstore',
        method: 'get',
    });
};

export const apiGetStore = (page = 1, limit = 10) => {
    return axios({
        url: `/store?page=${page}&limit=${limit}`,
        method: 'get',
    });
};

export const apiCreateStore = (payload) => {
    return axios({
        url: '/store/create',
        method: 'post',
        data: payload, // Truyền payload vào data
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
};

export const apiUpdateStore = (id, payload) => {
    return axios({
        url: `/store/update/${id}`,
        method: 'put',
        data: payload,
        // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
};

export const apiDeleteStore = (id) => {
    return axios({
        url: `/store/delete/${id}`,
        method: 'delete',
        // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
};

// export const apiGetTechnicalByStore = (storeId) => {
//     return axios.get(`/technical/technicians?store=${storeId}`); // Gửi storeId qua query parameters
// };

// API
export const apiGetTechnicalByStore = (storeId) => {
    return axios.get(`/technical/technicians?store=${storeId}`);
};
