/* global localStorage */
import axios from 'axios';
import params from 'configs/params';

const apiUrl = params.apiUrl;

export function attemptGetSubscriptions() {
    const token = localStorage.getItem('token');
    
    return axios.request({
        url: `${apiUrl}/subscriptions`,
        method: 'GET',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
}
