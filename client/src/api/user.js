import axios from './axios';

// user.js
export const apiRegister = (payload) => {
    return axios({
        url: '/user/register',
        method: 'post',
        data: payload,
    });
};

export const apiVerifyCode = (payload) => {
    return axios({
        url: '/user/verify-code',
        method: 'post',
        data: payload,
    });
};

export const apiVerifyPhoneNumber = (phoneNumber, verificationCode) => {
    return axios({
        url: '/user/verify',
        method: 'post',
        data: { phoneNumber, verificationCode },
    });
};

export const apiLogin = (payload) => {
    return axios({
        url: '/user/login',
        method: 'post',
        data: payload, // Truyền payload vào data
    });
};

export const apiLogout = (token) => {
    return axios({
        url: '/user/logout',
        method: 'post',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
export const apiGetUserById = (token) => {
    return axios({
        url: 'user/getUser',
        method: 'get',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// user.js
export const apiForgotPassword = (email) => {
    return axios({
        url: '/user/forgot-password',
        method: 'post',
        data: { email },
    });
};

export const apiResetPassword = async (token, { newPassword, confirmNewPassword }) => {
    return await axios.post(`/user/reset-password/${token}`, {
        newPassword,
        confirmNewPassword,
    });
};

// api/user.js

export const apiChangedPasswordEmail = async (email) => {
    return await axios.post('/user/request-change-password', {
        email,
    });
};

// API thay đổi mật khẩu
export const apiChangePassword = async ({ email, oldPassword, newPassword, verificationCode }) => {
    return await axios.post('/user/change-password', {
        email,
        oldPassword,
        newPassword,
        verificationCode,
    });
};
