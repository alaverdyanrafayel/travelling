import { browserHistory } from 'react-router';
import { attemptHasPendingBookings } from 'api/BookingApi';
import { ORDER_REVIEW_ROUTE, STATUS_PENDING } from '../../configs/constants';

export default async function customerHasPendingBookings() {
    try{
        const { data: { data } } = await attemptHasPendingBookings(STATUS_PENDING);

        if(data.length) {
            browserHistory.push(`${ORDER_REVIEW_ROUTE}${data[0].id}/`);
        }
    } catch(e) {
        return;
    }
}
