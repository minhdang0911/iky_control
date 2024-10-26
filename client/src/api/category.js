import axios from './axios';

export const apiCreateCategory = (payload, token) => {
    return axios({
        url: '/category/create-category',
        method: 'POST',
        data: payload,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const apiGetCategories = (data, token) => {
    return axios({
        url: '/category',
        method: 'get',
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const apiDeleteCategory = (id, token) => {
    return axios({
        url: `/category/${id}`,
        method: 'delete',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const apiUpdateCategory = (id, payload, token) => {
    return axios({
        url: `/category/${id}`,
        method: 'PUT',
        data: payload,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const apiImportCategories = (categories) => {
    return axios({
        url: '/category/import-categories',
        method: 'POST',
        data: categories,
    });
};
