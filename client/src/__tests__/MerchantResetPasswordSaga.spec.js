import * as Actions from '../app/modules/auth-merchant/AuthMerchantActions';
import { attemptMerchantResetPassword } from '../app/modules/auth-merchant/AuthMerchantSaga.js';
import { expectSaga, matchers } from 'redux-saga-test-plan';
import * as Api from 'api/AuthApi';
import { EMAIL_SEND_MESSAGE } from 'configs/constants';
import { throwError } from 'redux-saga-test-plan/providers';

describe('attemptMerchantResetPassword functionality, attemptMerchantResetPasswordSucceed attemptMerchantResetPasswordFailed actions function', () => {
    const requestData = { email: 'test@gmail.com' };
    const successMsg = { type: 'success', message: EMAIL_SEND_MESSAGE(requestData.email) };

    it('Should successfully exercise Change Forgot Password ', () => {
        expectSaga(attemptMerchantResetPassword, Actions.attemptMerchantResetPassword(requestData))
                .provide([
                    [matchers.call.fn(Api.attemptResetPassword), requestData ],
                ])
                .put(Actions.attemptMerchantResetPasswordSucceed(successMsg))
                .run();
    });

    it('Should handle errors', () => {

        const error = { response: { data: { message: 'something went wrong' } } };
        expectSaga(attemptMerchantResetPassword, Actions.attemptMerchantResetPassword(requestData))
                .provide([
                    [matchers.call.fn(Api.attemptResetPassword), throwError(error)],
                ])
                .put(Actions.attemptMerchantResetPasswordFailed({ type: 'danger', message: error.response.data.message }))
                .run();
    });
});
