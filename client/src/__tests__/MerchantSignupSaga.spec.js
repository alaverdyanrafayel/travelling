import { call, put } from 'redux-saga/effects';
import { attemptValidateMerchant, attemptAddMerchant } from '../app/modules/auth-merchant/AuthMerchantSaga.js';
import * as Api from 'api/MerchantApi';
import * as router from 'react-router';
import * as Actions from '../app/modules/auth-merchant/AuthMerchantActions';
import { expectSaga, matchers } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { MERCHANT_VERIFICATION_FAILED } from 'configs/constants';

router.browserHistory = { push: () => {} };

const validateData = {
    data: {
        fieldsMain: {
            email: 'fakeEmail@gmail.com',
            inviteCode: 'ABCDE'
        },
        errorsMain: {
            email: '',
            inviteCode: '',
        }
    }
};

const merchantData = {
    data: {
        fieldsDetails: {
            businessName: 'Fake Business Name',
            businessType: 'Fake Business Type',
            contantNo: '+12345678',
            abn: '12345678',
            userId: 0,
            hasReadTerms: true,
            password: 'user_pass1',
            confirmPassword: 'user_pass1',
            agreementLink: 'http://localhost:3000',
            isVerified: false
        },
        errorsDetails: {
            businessName: '',
            businessType: '',
            contactNo: '',
            abn: '',
            password: '',
            confirmPassword: '',
            hasReadTerms: ''
        },
    }
};

const action = {
    type: 'ATTEMPT_VALIDATE_MERCHANT',
    payload: validateData
};

describe('test attemptValidateMerchant generator function', () => {

    const generator2 = attemptValidateMerchant(action),
        generator = attemptValidateMerchant(action);

    test('must call Api.attemptValidateMerchant function', () => {

        expect(generator.next().value)
                .toEqual(call(Api.attemptValidateMerchant, { email: validateData.data.fieldsMain.email, inviteCode: validateData.data.fieldsMain.inviteCode }));

    });

    test('must dispatch validateMerchant action when verified is true', () => {
        expect(generator.next({ data: { verified: true } }).value)
                .toEqual(put(Actions.validateMerchantSucceed(validateData.data)));
    });

    test('must dispatch validateMerchant action when verified is false', () => {
        generator2.next();
        expect(generator2.next({ data: { verified: false } }).value)
                .toEqual(put(Actions.validateMerchantFailed(MERCHANT_VERIFICATION_FAILED)));
    });

    test('ends if email check failed', () => {
        expect(generator2.next().done).toBe(true);
    });

});

describe('test attemptAddMerchant generator function', () => {

    it('Should successfully add merchant', () => {
        expectSaga(attemptAddMerchant, Actions.attemptAddMerchant(merchantData.data.fieldsDetails))
                .provide([
                    [matchers.call.fn(Api.attemptAddMerchant), { data: merchantData.data.fieldsDetails }],
                ])
                .put(Actions.addMerchantSucceed(merchantData.data.fieldsDetails))
                .run();
    });

    it('Should handle errors', () => {
        const error = { response: { data: { message: 'something went wrong' } } };
        expectSaga(attemptAddMerchant, Actions.attemptAddMerchant(merchantData.data.fieldsDetails))
                .provide([
                    [matchers.call.fn(Api.attemptAddMerchant), throwError(error)],
                ])
                .put(Actions.addMerchantFailed(error.response.data))
                .run();
    });

});

