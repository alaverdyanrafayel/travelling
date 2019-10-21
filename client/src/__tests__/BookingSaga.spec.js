import * as Actions from '../app/modules/booking/BookingActions';
import { attemptGetBooking } from '../app/modules/booking/BookingSaga';
import { expectSaga, matchers } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as Api from 'api/BookingApi';

describe('Get booking functionality, attemptGetBooking, attemptGetBookingSucceed, attemptGetBookingFailed action functions', () => {
    const data = { bookingId: '4' };
    const paymentData = {};

    it('Should successfully get bookings', () => {
        expectSaga(attemptGetBooking, Actions.attemptGetBooking(data))
                .provide([
                    [matchers.call.fn(Api.attemptGetBooking), { data: paymentData }],
                ])
                .put(Actions.attemptGetBookingSucceed(paymentData))
                .run();
    });

    it('Should handle errors', () => {
        const error = { response: { data: { message: 'something went wrong' } } };
        expectSaga(attemptGetBooking, Actions.attemptGetBooking(data))
                .provide([
                    [matchers.call.fn(Api.attemptGetBooking), throwError(error)],
                ])
                .put(Actions.attemptGetBookingFailed(error.response.data.message))
                .run();
    });
    
});
