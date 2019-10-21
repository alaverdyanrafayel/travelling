import * as Actions from '../app/modules/auth-merchant/AuthMerchantActions';
import { attemptMerchantResetPasswordConfirm } from '../app/modules/auth-merchant/AuthMerchantSaga.js';
import { expectSaga, matchers } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as Api from 'api/AuthApi';

describe('attemptMerchantResetPasswordConfirm functionality, attemptMerchantResetPasswordConfirmSucceed attemptMerchantResetPasswordConfirmFailed actions function', () => {
    const requestData = { token: 'qwert12345asdfg45678m' };
    const response = { data: { token: { user: {} } } };

    it('Should successfully exercise reset Forgot Password ', () => {
        expectSaga(attemptMerchantResetPasswordConfirm, Actions.attemptMerchantResetPasswordConfirm(requestData))
                .provide([
                    [matchers.call.fn(Api.attemptResetPasswordConfirm),  response],
                ])
                .put(Actions.attemptMerchantResetPasswordConfirmSucceed({ user: undefined, token: { token: { user: {} } } }))
                .run();
    });

    it('Should handle errors', () => {

        const error = { response: { data: { message: 'something went wrong' } } };
        expectSaga(attemptMerchantResetPasswordConfirm, Actions.attemptMerchantResetPasswordConfirm(requestData))
                .provide([
                    [matchers.call.fn(Api.attemptResetPasswordConfirm), throwError(error)],
                ])
                .put(Actions.attemptMerchantResetPasswordConfirmFailed({ type: 'danger', message: error.response.data.message }))
                .run();
    });

});

