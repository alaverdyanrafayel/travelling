/* global localStorage */
import axios from 'axios';
import params from 'configs/params';

const apiUrl = params.apiUrl;

export function attemptValidateMerchant(data) {
    return axios.request({
        url: `${apiUrl}/merchants/check-merchant`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: data
    });
}

export function attemptAddMerchant(data) {
    return axios.request({
        url: `${apiUrl}/merchants`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: data
    });
}

export function attemptSignIn(data) {
    return axios.request({
        method: 'POST',
        url: `${apiUrl}/merchants/sign-in`,
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: data
    });
}
