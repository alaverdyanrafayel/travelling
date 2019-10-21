import axios from 'axios';
import params from 'configs/params';

const apiUrl = params.apiUrl;

export function attemptGetStatus(data) {
    const token = localStorage.getItem('token');

    return axios.request({
        url: `${apiUrl}/bankstatements/status/${data}`,
        method: 'GET',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
}

