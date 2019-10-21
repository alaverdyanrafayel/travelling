import * as Api from '../api/AuthApi';
import * as router from 'react-router';
import { attemptSendReferral } from '../app/modules/auth-user/AuthUserSaga';
import * as Actions from '../app/modules/auth-user/AuthUserActions';
import { expectSaga, matchers } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

router.browserHistory = { push: () => {} };

const referralData = {
    data: {
        fields: {
            email: 'user@test.com',
        },
        errors: {
            email: '',
        }
    }
};

describe('test attemptSendReferral generator function', () => {

    it('Should successfully send referral', () => {

        expectSaga(attemptSendReferral, Actions.attemptSendReferral(referralData.data.fields.email))
                .provide([
                    [matchers.call.fn(Api.attemptSendReferral), { data: referralData.data.fields.email }],
                ])
                .put(Actions.attemptSendReferralSucceed({ data: { email: referralData.data.fields } }))
                .run();
    });

    it('Should handle errors', () => {
        const error = { response: { data: {  type: 'danger', message: undefined } } };
        expectSaga(attemptSendReferral, Actions.attemptSendReferral(referralData.data.fields.email))
                .provide([
                    [matchers.call.fn(Api.attemptSendReferral), throwError(error)],
                ])
                .put(Actions.attemptSendReferralFailed(error.response.data))
                .run();
    });

});
