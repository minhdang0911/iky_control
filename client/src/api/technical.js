import axios from './axios';

export const apiCreateTechnician = async (name, phone, storeId, token) => {
    return await axios.post(
        '/technical/create-technician',
        {
            fullName: name,
            phoneNumber: phone,
            store: storeId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
};

export const apiDeleteTechnician = (id, token) => {
    return axios({
        url: `/technical/technician/${id}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const apiGetAllTechnical = (token, page = 1, limit = 10) => {
    return axios({
        url: `/technical/all-technicians?page=${page}&limit=${limit}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const apiUpdateTechnician = (id, payload, token) => {
    return axios({
        url: `/technical/technician/${id}`,
        method: 'PUT',
        data: payload,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
