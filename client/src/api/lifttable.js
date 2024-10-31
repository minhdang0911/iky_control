import axios from './axios';
export const apiCreateLiftTable = (data) => {
    return axios({
        url: '/lifttable/add',
        method: 'post',
        data,
    });
};

export const apiGetLiftTable = (storeId) => {
    return axios({
        url: `/lifttable/getTables?storeId=${storeId}`,
        method: 'get',
    });
};

export const apiDeleteLiftTable = (id) => {
    return axios({
        url: `/lifttable/${id}`,
        method: 'delete',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
};

export const apiUpdateLiftTable = (id, updatedData) => {
    return axios({
        url: `/lifttable/update/${id}`,
        method: 'put',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        data: updatedData,
    });
};
