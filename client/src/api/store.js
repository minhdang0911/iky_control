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
        data: payload,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
};

export const apiUpdateStore = (id, payload) => {
    return axios({
        url: `/store/update/${id}`,
        method: 'put',
        data: payload,
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

export const apiGetStoreStatistics = async (city = '', district = '') => {
    try {
        const response = await axios.get('/store/statistics', {
            params: { city, district },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch store statistics:', error);
        throw error;
    }
};
