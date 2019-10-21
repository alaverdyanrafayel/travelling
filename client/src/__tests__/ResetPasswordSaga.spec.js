import * as Actions from '../app/modules/auth-user/AuthUserActions';
import { attemptResetPassword } from '../app/modules/auth-user/AuthUserSaga.js';
import * as Api from 'api/AuthApi';
import { EMAIL_SEND_MESSAGE } from 'configs/constants';
import { expectSaga, matchers } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

describe('attemptResetPassword functionality, attemptResetPasswordSucceed action function', () => {
    const requestData = { email: 'test@gmail.com' };
    const successMsg = { type: 'success', message: EMAIL_SEND_MESSAGE(requestData.email) };

    it('Should successfully exercise Change Forgot Password ', () => {
        expectSaga(attemptResetPassword, Actions.attemptResetPassword(requestData))
                .provide([
                    [matchers.call.fn(Api.attemptResetPassword), requestData ],
                ])
                .put(Actions.attemptResetPasswordSucceed(successMsg))
                .run();
    });

    it('Should handle errors', () => {
        
        const error = { response: { data: { message: 'something went wrong' } } };
        expectSaga(attemptResetPassword, Actions.attemptResetPassword(requestData))
                .provide([
                    [matchers.call.fn(Api.attemptResetPassword), throwError(error)],
                ])
                .put(Actions.attemptResetPasswordFailed({ type: 'danger', message: error.response.data.message }))
                .run();
    });
});
