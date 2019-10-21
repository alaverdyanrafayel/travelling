import axios from 'axios';
import params from 'configs/params';

const apiUrl = params.apiUrl;

export function attemptAddPaymentCard(data) {
    const token = localStorage.getItem('token');

    return axios.request({
        url: `${apiUrl}/cards`,
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

export function attemptUpdatePaymentCard(data) {
    const token = localStorage.getItem('token');

    return axios.request({
        url: `${apiUrl}/cards/${data.cardId}`,
        method: 'PUT',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: { tokenId: data.tokenId }
    });
}

export function attemptDeletePaymentCard(data) {
    const token = localStorage.getItem('token');

    return axios.request({
        url: `${apiUrl}/cards/${data}`,
        method: 'DELETE',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
}

export function attemptDefaultPaymentCard(data) {
    const token = localStorage.getItem('token');

    return axios.request({
        url: `${apiUrl}/cards/default/${data}`,
        method: 'PUT',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
}

export function attemptGetPaymentCards() {
    const token = localStorage.getItem('token');

    return axios.request({
        url: `${apiUrl}/cards`,
        method: 'GET',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
}

export function attemptCharges(data) {
    const token = localStorage.getItem('token');

    return axios.request({
        url: `${apiUrl}/charges`,
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
