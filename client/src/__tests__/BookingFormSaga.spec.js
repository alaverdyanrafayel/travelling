import * as Api from '../api/BookingApi';
import * as router from 'react-router';
import { attemptCreateBooking } from '../app/modules/booking/BookingSaga';
import * as Actions from '../app/modules/booking/BookingActions';
import { expectSaga, matchers } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

router.browserHistory = { push: () => {} };

const bookingData = {
    data: {
        fields: {
            merchantReference: 'Mer Ref',
            merchantName: 'Mer Name',
            baseValue: 1000,
            surcharge: 3,
            email: 'test@gmail.com',
            uploadedDocs: [{ file: '' }],
            totalCharged: '1030',
            weeklyPrice: '82',
            lastPaymentDate: '15th Feb 2018',
        },
        errors: {
            merchantReference: '',
            merchantName: '',
            baseValue: '',
            surcharge: '',
            email: '',
            uploadedDocs: [],
            totalCharged: '',
            weeklyPrice: '',
            lastPaymentDate: '',
        }
    }
};

describe('test attemptCreateBooking generator function', () => {

    it('Should successfully create new booking', () => {

        expectSaga(attemptCreateBooking, Actions.attemptCreateBooking(bookingData.data.fields))
                .provide([
                    [matchers.call.fn(Api.attemptCreateBooking), { data: bookingData.data.fields }],
                ])
                .put(Actions.attemptCreateBookingSucceed({ booking: { data: bookingData.data.fields } }))
                .run();
    });

    it('Should handle errors', () => {
        const error = { response: { data: {  merchantReference: '',
            merchantName: '',
            baseValue: '',
            surcharge: '',
            email: '',
            uploadedDocs: [] } } };
        expectSaga(attemptCreateBooking, Actions.attemptCreateBooking(bookingData.data.fields))
                .provide([
                    [matchers.call.fn(Api.attemptCreateBooking), throwError(error)],
                ])
                .put(Actions.attemptCreateBookingFailed(error.response.data))
                .run();
    });

});
