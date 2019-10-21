import { call, put, takeLatest } from 'redux-saga/effects';
import * as Actions from './AuthMerchantActions';
import { actions } from './AuthMerchantReducer';
import * as Api from 'api/MerchantApi';
import * as AuthApi from 'api/AuthApi';
import {
    MERCHANT_VERIFICATION_FAILED,
    EMAIL_SEND_MESSAGE } from 'configs/constants';

export function* attemptAddMerchant({ payload: { data } }) {
    try {
        const response = yield call(Api.attemptAddMerchant,data);
        yield put(Actions.addMerchantSucceed(response.data));
        yield put(Actions.attemptSignIn(data));
    }catch( { response: { data: { message } } }) {
        yield put(Actions.addMerchantFailed({ message }));
    }
}

export function* attemptValidateMerchant({ payload: { data } }) {
    try {
        const response = yield call(Api.attemptValidateMerchant,{ email: data.fieldsMain.email, inviteCode: data.fieldsMain.inviteCode });
        if(response.data.verified) {
            yield put(Actions.validateMerchantSucceed(response.data));

            return true;
        }
        else{
            yield put(Actions.validateMerchantFailed(MERCHANT_VERIFICATION_FAILED));

            return false;
        }
    } catch (error) {
        yield put(Actions.validateMerchantFailed(MERCHANT_VERIFICATION_FAILED));
    }
}

export function* attemptSignIn({ payload: { data } }) {
    try {
        yield put(Actions.clear());
        const { data: token } = yield call(Api.attemptSignIn, data);
        yield put(Actions.signInSucceed({ user: token.user, token }));
    } catch ({ response: { status, data: { message } } }) {
        yield put(Actions.signInFailed(data, message));
    }
}

export function* attemptMerchantResetPassword({ payload: { data } }) {
    try {
        yield call(AuthApi.attemptResetPassword, data);
        yield put(Actions.attemptMerchantResetPasswordSucceed({ type: 'success', message: EMAIL_SEND_MESSAGE(data.email) }));
    } catch ({ response }) {
        yield put(Actions.attemptMerchantResetPasswordFailed({ type: 'danger', message: response.data.message }));
    }
}

export function* attemptMerchantResetPasswordConfirm({ payload: { data } }) {
    try {
        const { data: token } = yield call(AuthApi.attemptResetPasswordConfirm, data);
        yield put(Actions.attemptMerchantResetPasswordConfirmSucceed({ user: token.user, token }));
    } catch ({ response }) {
        yield put(Actions.attemptMerchantResetPasswordConfirmFailed({ type: 'danger', message: response.data.message }));
    }
}

export function* checkMerchantResetPasswordToken({ payload: { data } }) {
    try {
        const response = yield call(AuthApi.checkResetPasswordToken, { token: data });
        if(response.data.isValid) {
            yield put(Actions.checkMerchantResetPasswordTokenSucceed(response.data));
        }
    }catch({ response }) {
        yield put(Actions.checkMerchantResetPasswordTokenFailed(response.data.message));
    }
}

function* AuthMerchantSaga() {
    yield takeLatest(actions.ATTEMPT_VALIDATE_MERCHANT, attemptValidateMerchant);
    yield takeLatest(actions.ATTEMPT_ADD_MERCHANT, attemptAddMerchant);
    yield takeLatest(actions.ATTEMPT_MERCHANT_SIGN_IN, attemptSignIn);
    yield takeLatest(actions.ATTEMPT_MERCHANT_RESET_PASSWORD, attemptMerchantResetPassword);
    yield takeLatest(actions.ATTEMPT_MERCHANT_RESET_PASSWORD_CONFIRM, attemptMerchantResetPasswordConfirm);
    yield takeLatest(actions.CHECK_MERCHANT_RESET_PASSWORD_TOKEN, checkMerchantResetPasswordToken);
}

export default AuthMerchantSaga;
