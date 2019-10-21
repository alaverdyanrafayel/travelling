import axios  from 'axios';
import params from 'configs/params';

const apiUrl = params.apiUrl;

export function attemptAddCustomer(data) {

    const token = localStorage.getItem('token');

    return axios.request({
        url: `${apiUrl}/users/customer`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: data
    });
}

export function attemptSendReferral(data) {

    const token = localStorage.getItem('token');

    return axios.request({
        url: `${apiUrl}/users/referral`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: data
    });
}

export function attemptEquifaxCheck(data) {

    const token = localStorage.getItem('token');

    return axios.request({
        url: `${apiUrl}/users/equifax-check`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: data
    });
}

export function attemptSignUp(data) {

    return axios.request({
        url: `${apiUrl}/users/user`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: data
    });
}

export function attemptResetPassword(data) {

    return axios.request({
        url: `${apiUrl}/auth/password-reset`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: data
    });
}

export function attemptResetPasswordConfirm(data) {

    return axios.request({
        url: `${apiUrl}/auth/password-reset/confirm`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: data
    });
}

export function attemptCheckEmail(data) {

    return axios.request({
        url: `${apiUrl}/auth/check-email`,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: data
    });
}

export function checkResetPasswordToken(data) {

    return axios.request({
        url: `${apiUrl}/auth/password-reset/check-token`,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: data
    });
}

export function attemptSignIn(data) {

    return axios.request({
        method: 'POST',
        url: `${apiUrl}/auth/sign-in`,
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        auth: {
            username: data.email,
            password: data.password
        },
        data: data
    });
}

export function attemptGetUser() {

    return axios.request({
        url: `${apiUrl}/users/me`,
        method: 'GET',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
}

export function refreshToken() {
    return axios.request({
        url: `${apiUrl}/auth/refresh-token`,
        method: 'GET',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
}

export function attemptSendCode(data) {

    return axios.request({
        url: `${apiUrl}/users/phone-validation`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: data
    });
}

export function attemptSmsVerification(data) {

    return axios.request({
        url: `${apiUrl}/users/sms-verification`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: data
    });
}

export function onSessionComplete(data) {

    return axios.request({
        url: `${apiUrl}/users/token-verification`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: data
    });
}

export function attemptLogOutUser() {

    return axios.request({
        url: `${apiUrl}/auth/sign-out`,
        method: 'GET',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
}

export function attemptConfirmEmail(token) {

    return axios.request({
        method: 'PATCH',
        url: `${apiUrl}/auth/confirm-email/${token}`,
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
}

export function attemptRequestPasswordReset(data) {

    return axios.request({
        method: 'POST',
        url: `${apiUrl}/auth/request-password-reset`,
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: data
    });
}
