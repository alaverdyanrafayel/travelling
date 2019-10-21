import * as Actions from '../app/modules/payment/PaymentActions';
import {
    attemptAddPaymentCard,
    attemptDeletePaymentCard,
    attemptGetPaymentCards,
    attemptUpdatePaymentCard,
    attemptCharges
} from '../app/modules/payment/PaymentSaga';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as Api from '../api/PaymentApi';
import { throwError } from 'redux-saga-test-plan/providers';

describe('Add payment functionality, attemptAddPaymentCard, attemptAddPaymentSucceed, attemptAddPaymentFailed action functions', () => {
    const addPaymentRequest = { tokenId: 'tok_123456' };
    const paymentData = { type: 'master', customerId: 'customer_123' };

    it('Should successfully add payment', () => {
        expectSaga(attemptAddPaymentCard, Actions.attemptAddPayment(addPaymentRequest))
                .provide([
                    [matchers.call.fn(Api.attemptAddPaymentCard), { data: paymentData }],
                ])
                .put(Actions.attemptAddPaymentSucceed(paymentData))
                .run();
    });

    it('Should handle errors', () => {
        const error = { response: { data: { message: 'something went wrong' } } };
        expectSaga(attemptAddPaymentCard, Actions.attemptAddPayment(addPaymentRequest))
                .provide([
                    [matchers.call.fn(Api.attemptAddPaymentCard), throwError(error)],
                ])
                .put(Actions.attemptAddPaymentFailed(error.response.data))
                .run();
    });

});

describe('Delete payment functionality, attemptDeletePaymentCard, attemptDeletePaymentSucceed, attemptDeletePaymentFailed action functions', () => {
    const deletePaymentRequest = { tokenId: 'tok_123456' };

    it('Should successfully delete payment', () => {
        expectSaga(attemptDeletePaymentCard, Actions.attemptDeletePayment(deletePaymentRequest))
                .provide([
                    [matchers.call.fn(Api.attemptDeletePaymentCard)],
                ])
                .put(Actions.attemptDeletePaymentSucceed(deletePaymentRequest))
                .run();
    });

    it('Should handle errors', () => {
        const error = { response: { data: { message: 'something went wrong' } } };
        expectSaga(attemptDeletePaymentCard, Actions.attemptDeletePayment(deletePaymentRequest))
                .provide([
                    [matchers.call.fn(Api.attemptDeletePaymentCard), throwError(error)],
                ])
                .put(Actions.attemptDeletePaymentFailed(error.response.data))
                .run();
    });
});

describe('Get payment functionality, attemptGetPaymentCard, attemptGetPaymentSucceed, attemptGetPaymentFailed action functions', () => {
    const paymentData = [];

    it('Should successfully get payment', () => {
        expectSaga(attemptGetPaymentCards)
                .provide([
                    [matchers.call.fn(Api.attemptGetPaymentCards), { data: paymentData }],
                ])
                .put(Actions.attemptGetPaymentSucceed(paymentData))
                .run();
    });

    it('Should handle errors', () => {
        const error = { response: { data: { message: 'something went wrong' } } };
        expectSaga(attemptGetPaymentCards)
                .provide([
                    [matchers.call.fn(Api.attemptGetPaymentCards), throwError(error)],
                ])
                .put(Actions.attemptGetPaymentFailed(error.response.data))
                .run();
    });

});

describe('Update payment functionality, attemptUpdatePaymentCard, attemptUpdatePaymentSucceed, attemptUpdatePaymentFailed action functions', () => {
    const updatePaymentRequest = { tokenId: 'tok_123456', cardId: 'card_1234' };
    const paymentData = {};

    it('Should successfully update payment', () => {
        expectSaga(attemptUpdatePaymentCard, Actions.attemptUpdatePayment(updatePaymentRequest))
                .provide([
                    [matchers.call.fn(Api.attemptUpdatePaymentCard), { data: paymentData }],
                ])
                .put(Actions.attemptUpdatePaymentSucceed({ updatedCard: paymentData, cardId: updatePaymentRequest.cardId }))
                .run();
    });

    it('Should handle errors', () => {
        const error = { response: { data: { message: 'something went wrong' } } };
        expectSaga(attemptUpdatePaymentCard, Actions.attemptUpdatePayment(updatePaymentRequest))
                .provide([
                    [matchers.call.fn(Api.attemptUpdatePaymentCard), throwError(error)],
                ])
                .put(Actions.attemptUpdatePaymentFailed(error.response.data))
                .run();
    });

});

describe('Add charges functionality, attemptCharges, attemptChargesSucceed, attemptChargesFailed action functions', () => {
    const data = { bookingId: '4', cardId: 'card_1BbEXQH9byMJHJdOYhTPHtOs' };
    const charges = {};

    it('Should successfully charge', () => {
        expectSaga(attemptCharges, Actions.attemptCharges(data))
                .provide([
                    [matchers.call.fn(Api.attemptCharges),  { data: charges } ],
                ])
                .put(Actions.attemptChargesSucceed(charges))
                .run();
    });

    it('Should handle errors', () => {
        const error = { response: { data: { message: 'something went wrong' } } };
        expectSaga(attemptCharges, Actions.attemptCharges(data))
                .provide([
                    [matchers.call.fn(Api.attemptCharges), throwError(error)],
                ])
                .put(Actions.attemptChargesFailed(error.response.data))
                .run();
    });

});
