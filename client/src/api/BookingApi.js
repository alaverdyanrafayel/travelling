import axios from 'axios';
import params from 'configs/params';

const apiUrl = params.apiUrl;

export function attemptCreateBooking(data) {
    const token = localStorage.getItem('token');

    return axios.request({
        url: `${apiUrl}/bookings`,
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

export function attemptGetBooking(data) {
    const token = localStorage.getItem('token');

    return axios.request({
        url: `${apiUrl}/bookings/${data}`,
        method: 'GET',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
}

export function attemptHasPendingBookings(status) {
    
    return axios.request({
        url: `${apiUrl}/bookings/?status=${status}`,
        method: 'GET',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
}

export function attemptDownloadDocs(data) {
    const token = localStorage.getItem('token');

    return axios.request({
        url: `${apiUrl}/bookings/${data}`,
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

export function attemptConfirmOrder(data) {
    const token = localStorage.getItem('token');
    
    return axios.request({
        url: `${apiUrl}/bookings/${data.bookingId}/confirm`,
        method: 'PATCH',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: { cardId: data.cardId }
    });
}
