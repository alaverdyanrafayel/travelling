import { attemptGetBooking } from '../../api/BookingApi';
import { attemptGetBookingSucceed,
    attemptGetBookingFailed } from '../modules/booking/BookingActions';

export default async function getBooking(store, bookingId) {
    const { dispatch } = store;
    try {
        const response = await attemptGetBooking(bookingId);
        await dispatch(attemptGetBookingSucceed(response.data));
    } catch ({ response: { data: { message } } }) {
        await attemptGetBookingFailed(message);
    }
}
