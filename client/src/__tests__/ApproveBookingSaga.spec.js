import * as Actions from '../app/modules/booking/BookingActions';
import { attemptConfirmOrder } from '../app/modules/booking/BookingSaga';
import { expectSaga, matchers } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as Api from 'api/BookingApi';

describe('Finalise confirmation functionality, attemptConfirmOrder, attemptConfirmOrderSucceed, attemptConfirmOrderFailed action functions', () => {
    const data = { bookingId: '14' };
    const responseData = {};

    it('Should successfully finalise confirmation', () => {
        expectSaga(attemptConfirmOrder, Actions.attemptConfirmOrder(data))
                .provide([
                    [matchers.call.fn(Api.attemptConfirmOrder), { data: responseData }],
                ])
                .put(Actions.attemptConfirmOrderSucceed(responseData))
                .run();
    });

    it('Finalise confirmation should handle errors', () => {
        const error = { response: { data: { message: 'something went wrong' } } };
        expectSaga(attemptConfirmOrder, Actions.attemptConfirmOrder(data))
                .provide([
                    [matchers.call.fn(Api.attemptConfirmOrder), throwError(error)],
                ])
                .put(Actions.attemptConfirmOrderFailed(error.response.data.message))
                .run();
    });
    
});
