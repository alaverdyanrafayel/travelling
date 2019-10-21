import { call, put } from 'redux-saga/effects';
import { attemptSignUp, attemptAddCustomer } from '../app/modules/auth-user/AuthUserSaga.js';
import * as Api from 'api/AuthApi';
import * as loadingActions from '../app/modules/loading/LoadingActions';
import * as router from 'react-router';
import * as Actions from '../app/modules/auth-user/AuthUserActions';

router.browserHistory = { push: () => {} };

const userData = {
    data: {
        fields: {
            email: 'fakeEmail@gmail.com',
            password: 'fakePassword',
            hasReadTerms: true
        },
        errors: {
            email: '',
            password: '',
            hasReadTerms: ''
        }
    }
};

const customerData = {
    data: {
        fields: {
            firstName: 'fakeFirstName',
            middleName: 'fakeMiddleName',
            lastName: 'fakeLastName',
            email: 'fakeEmail@test.com',
            dob: '2017-10-10',
            hasReadTerms: true
        },
        errors: {
            firstName: '',
            lastName: '',
            dob: '',
            hasReadTerms: ''
        }
    }
};

const action = {
    type: 'ATTEMPT_SIGN_UP',
    payload: userData
};

const action1 = {
    type: 'ATTEMPT_ADD_CUSTOMER',
    payload: customerData
};

describe('test attemptSignUp generator function', () => {

    const generator = attemptSignUp(action),
        generator2 = attemptSignUp(action),
        generator3 = attemptAddCustomer(action1);

    test('must call Api.attemptCheckEmail function', () => {

        expect(generator.next().value)
                .toEqual(call(Api.attemptCheckEmail, { email: userData.data.fields.email }));

    });

    test('must dispatch checkEmailSucceed action when verified is false', () => {
        expect(generator.next({ data: { verified: false } }).value)
                .toEqual(put(Actions.checkEmailSucceed(userData.data)));
    });

    test('must dispatch checkEmailFailed action when verified is true', () => {
        generator2.next();
        expect(generator2.next({ data: { verified: true } }).value)
                .toEqual(put(Actions.checkEmailFailed(userData.data)));
    });

    test('ends if email check failed', () => {
        expect(generator2.next().done).toBe(true);
    });

    test('must call startLoading action', () => {
        expect(generator.next().value).toEqual(put(loadingActions.startLoading()));
    });
    test('must call attemptSignUp function', () => {
        expect(generator.next().value).toEqual(call(Api.attemptSignUp, userData.data.fields));
    });

    test('must dispatch STOP_LOADING action', () => {
        expect(generator.next().value).toEqual(put(loadingActions.stopLoading()));
    });

    test('must dispatch signUpSucceed action', () => {
        expect(generator.next().value).toEqual(put(Actions.signUpSucceed()));
    });

    test('must dispatch attemptSignIn action', () => {
        expect(generator.next().value).toEqual(put(Actions.attemptSignIn(userData.data.fields)));
    });

    test('generator has yielded all values', () => {
        expect(generator.next().done)
                .toBe(true);
    });

    test('must call start Loading action', () => {
        expect(generator3.next().value).toEqual(put(loadingActions.startLoading()));
    });

    test('must call attemptAddCustomer function', () => {
        expect(generator3.next().value).toEqual(call(Api.attemptAddCustomer, customerData.data.fields));
    });

    test('must dispatch stopLOADING action', () => {
        expect(generator3.next().value).toEqual(put(loadingActions.stopLoading()));
    });

    test('must dispatch addCustomerSucceed action', () => {
        expect(generator3.next().value).toEqual(put(Actions.addCustomerSucceed(customerData.data)));
    });

    test('generator3 has yielded all values', () => {
        expect(generator3.next().done)
                .toBe(true);
    });

});

describe('attemptSignUp request failure', () => {
    const generator3 = attemptSignUp(action);
    test('dispatch signUpFailed action', () => {
        generator3.next();
        generator3.next({ data: { verified: false } });
        generator3.next();
        generator3.next();
        expect(generator3.throw({ response: { status: '', data: { errors: JSON.stringify({ email: '' }), message: '' } } }).value)
                .toEqual(put(Actions.signUpFailed(userData.data,  '')));

    });
    test('dispatch stop Loading action', () => {
        expect(generator3.next().value).toEqual(put(loadingActions.stopLoading()));
    });
    test('generator has yielded all values', () => {
        expect(generator3.next().done).toBe(true);
    });
});
