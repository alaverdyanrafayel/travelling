import { call, put } from 'redux-saga/effects';
import { attemptSendCode, attemptSmsVerification } from '../app/modules/auth-user/AuthUserSaga.js';
import * as Api from 'api/AuthApi';
import * as loadingActions from '../app/modules/loading/LoadingActions';
import * as Actions from '../app/modules/auth-user/AuthUserActions';

const data = {
    fields: {
        mobileNumber: '+374 99 999 999',
        verificationCode: '1234ab'
    },
    errors: {

    }
};

describe('attemptSendCode generator function', () => {
    const generator = attemptSendCode({ payload: { data } });

    test('must call Api.sendCode function', () => {
        expect(generator.next().value)
                .toEqual(call(Api.attemptSendCode, { mobileNumber: '+37499999999' }));
    });

    test('must dispatch sendCodeSucceed action', () => {
        expect(generator.next().value)
                .toEqual(put(Actions.sendCodeSucceed(data)));
    });

    test('generator has yielded all values', () => {
        expect(generator.next().done)
                .toBe(true);
    });

});

describe('attemptSendCode generator failure', () => {
    const generator = attemptSendCode({ payload: { data } });

    test('must dispatch sendCodeFailed action', () => {
        generator.next();
        expect(generator.throw({ response: { data: { errors: { mobileNumber: '' } } } }).value)
                .toEqual(put(Actions.sendCodeFailed(data.fields, null, data.errors)));
    });

    test('generator has yielded all values', () => {
        expect(generator.next().done)
                .toBe(true);
    });

});

describe('attemptSmsVerification generator function', () => {
    const generator = attemptSmsVerification({ payload: { data } });

    test('must dispatch startLoading action', () => {
        expect(generator.next().value)
                .toEqual(put(loadingActions.startLoading()));
    });

    test('should call Api.attemptSmsVerification function', ()=>{
        expect(generator.next().value)
                .toEqual(call(Api.attemptSmsVerification, { code: data.fields.verificationCode }));
    });

    test('must dispatch stopLoading action', () => {
        expect(generator.next().value)
                .toEqual(put(loadingActions.stopLoading()));
    });

    test('must dispatch smsVerificationSucceed action', () => {
        expect(generator.next().value)
                .toEqual(put(Actions.smsVerificationSucceed(data)));
    });

    test('generator has yielded all values', () => {
        expect(generator.next().done)
                .toBe(true);
    });

});

describe('attemptSmsVerification generator failure', () => {
    const generator = attemptSmsVerification({ payload: { data } });

    test('must dispatch stopLoading action', () => {
        generator.next();
        generator.next();
        expect(generator.throw({ response: { data: {} } }).value)
                .toEqual(put(loadingActions.stopLoading()));
    });

    test('should dispatch smsVerificationFailed action', () => {
        expect(generator.next().value)
                .toEqual(put(Actions.smsVerificationFailed(data.fields, null, data.errors)));
    });

    test('generator has yielded all values', () => {
        expect(generator.next().done)
                .toBe(true);
    });

});
