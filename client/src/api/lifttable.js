import axios from './axios';
import Cookies from 'js-cookie';
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
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
};

export const apiUpdateLiftTable = (id, updatedData) => {
    return axios({
        url: `/lifttable/update/${id}`,
        method: 'put',
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        data: updatedData,
    });
};
