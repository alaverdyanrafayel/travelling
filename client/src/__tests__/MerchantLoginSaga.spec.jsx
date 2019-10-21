import * as Api from 'api/MerchantApi';
import * as router from 'react-router';
import { attemptSignIn } from '../app/modules/auth-merchant/AuthMerchantSaga.js';
import * as Actions from '../app/modules/auth-merchant/AuthMerchantActions';
import { expectSaga, matchers } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

router.browserHistory = { push: () => {} };

const merchantData = {
    data: {
        fields: {
            email: '',
            password: ''
        },
        errors: {
            email: '',
            password: ''
        },
    }
};

describe('test attemptSignIn generator function', () => {

    it('Should successfully signIn merchant', () => {
        expectSaga(attemptSignIn, Actions.attemptSignIn(merchantData.data.fields))
                .provide([
                [matchers.call.fn(Api.attemptSignIn()), { data: merchantData.data.fields }],
                ])
                .put(Actions.signInSucceed(merchantData.data.fields))
                .run();
    });

    it('Should handle errors', () => {
        const error = { response: { data: { email: '', password: '' } } };
        expectSaga(attemptSignIn, Actions.attemptSignIn(merchantData.data.fields))
                .provide([
                [matchers.call.fn(Api.attemptSignIn), throwError(error)],
                ])
                .put(Actions.signInFailed(error.response.data))
                .run();
    });

});

