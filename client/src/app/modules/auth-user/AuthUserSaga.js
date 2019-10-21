import { call, put, takeLatest } from 'redux-saga/effects';
import {
    EMAIL_SEND_MESSAGE } from 'configs/constants';
import * as Actions from './AuthUserActions';
import { actions } from './AuthUserReducer';
import * as Api from 'api/AuthApi';
import * as loadingActions from '../loading/LoadingActions';

export function* attemptGetUser() {
    try {
        yield put(loadingActions.startLoading());
        const response = yield call(Api.attemptGetUser);
        yield put(Actions.getUserSucceed({ user: response.data }));
        yield put(loadingActions.stopLoading());
    } catch ({ response: { status, data: { errors, message } } }) {
        yield put(Actions.getUserFailed());
        yield put(loadingActions.stopLoading());
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

export function* attemptAddCustomer({ payload: { data } }) {
    try {
        yield put(loadingActions.startLoading());
        const response = yield call(Api.attemptAddCustomer, data.fields);
        yield put(loadingActions.stopLoading());
        yield put(Actions.addCustomerSucceed({ customer: response }));
    } catch ({ response: { status, data: { errors, message } } }) {
        yield put(Actions.addCustomerFailed(data, JSON.parse(errors).email));
        yield put(loadingActions.stopLoading());
    }
}

export function* onSessionComplete({ payload: { data } }) {
    try {
        const response = yield call(Api.onSessionComplete, data);
        yield put(Actions.onSessionCompleteSucceed(response));
    } catch({ response }) {
        yield put(Actions.onSessionCompleteFailed(response.data.message));
    }
}

export function* attemptResetPassword({ payload: { data } }) {
    try {
        yield call(Api.attemptResetPassword, data);
        yield put(Actions.attemptResetPasswordSucceed({ notification: { type: 'success', message: EMAIL_SEND_MESSAGE(data.email) }, prevSentEmail: data.email }));
    } catch ({ response }) {
        yield put(Actions.attemptResetPasswordFailed({ type: 'danger', message: response.data.message }));
    }
}

export function* attemptResetPasswordConfirm({ payload: { data } }) {
    try {
        const { data: token } = yield call(Api.attemptResetPasswordConfirm, data);
        yield put(Actions.attemptResetPasswordConfirmSucceed({ user: token.user, token }));
    } catch ({ response }) {
        yield put(Actions.attemptResetPasswordConfirmFailed({ type: 'danger', message: response.data.message }));
    }
}

export function* checkResetPasswordToken({ payload: { data } }) {
    try {
        const response = yield call(Api.checkResetPasswordToken, { token: data });
        if(response.data.isValid) {
            yield put(Actions.checkResetPasswordTokenSucceed(response.data));
        }
    }catch({ response }) {
        yield put(Actions.checkResetPasswordTokenFailed(response.data.message));
    }
}

export function* attemptSendReferral({ payload: { data } }) {
    try {
        const response = yield call(Api.attemptSendReferral, { email: data });
        yield put(Actions.attemptSendReferralSucceed(response.data));
    } catch ({ response }) {
        yield put(Actions.attemptSendReferralFailed({ type: 'danger', message: response.data.message }));
    }
}

export function* attemptEquifaxCheck(data) {
    try {
        const response = yield call(Api.attemptEquifaxCheck, { id: data.payload });
        yield put(Actions.attemptEquifaxCheckSucceed(response.data));
    } catch ({ response }) {
        yield put(Actions.attemptEquifaxCheckFailed({ type: 'danger', message: response.data.message }));
    }
}

export function* attemptCheckEmail({ payload: { data } }) {
    try {
        const response = yield call(Api.attemptCheckEmail, { email: data.fields.email });
        if (!response.data.verified) {
            yield put(Actions.checkEmailSucceed(data));

            return true;
        } else {
            yield put(Actions.checkEmailFailed(data));

            return false;
        }
    } catch (error) {
        throw error;
    }
}

export function* attemptSignUp({ payload: { data } }) {
    try {
        const emailUnique = yield* attemptCheckEmail({ payload: { data } });

        if (!emailUnique) {
            return;
        }

        yield put(loadingActions.startLoading());
        yield call(Api.attemptSignUp, data.fields);
        yield put(loadingActions.stopLoading());
        yield put(Actions.signUpSucceed());
        yield put(Actions.attemptSignIn(data.fields));
    } catch ({ response: { status, data: { errors, message } } }) {
        yield put(Actions.signUpFailed(data, JSON.parse(errors).email));
        yield put(loadingActions.stopLoading());
    }
}

export function* attemptSendCode({ payload: { data } }) {
    try {
        yield call(Api.attemptSendCode, { mobileNumber: data.fields.mobileNumber.split(' ').join('') });
        data.fields.verificationSend = true;
        yield put(Actions.sendCodeSucceed(data));
    } catch ({ response: { status, data: { errors, message } } }) {
        data.errors.mobileNumber = errors.mobileNumber.msg;
        yield put(Actions.sendCodeFailed(data.fields, null, data.errors));
    }
}

export function* attemptSmsVerification({ payload: { data } }) {
    try {
        yield put(loadingActions.startLoading());
        yield call(Api.attemptSmsVerification, { code: data.fields.verificationCode });
        yield put(loadingActions.stopLoading());
        data.fields.verificationSucceed = true;
        yield put(Actions.smsVerificationSucceed(data));
    } catch ({ response: { status, data: { errors, message } } }) {
        yield put(loadingActions.stopLoading());
        data.errors.verificationCode = message;
        yield put(Actions.smsVerificationFailed(data.fields, null, data.errors));
    }
}

function* attemptLogOutUser() {
    try {
        yield call(Api.attemptLogOutUser);
        yield put(Actions.clear());
        yield localStorage.clear();
        yield put(Actions.logOutUserSucceed());
    } catch ({ response: { status, data: { message, errors } } }) {
        yield put(Actions.logOutUserFailed((errors && errors.message) || message));
    }
}

function* authUserSaga() {
    yield takeLatest(actions.ATTEMPT_GET_USER, attemptGetUser);
    yield takeLatest(actions.ATTEMPT_SIGN_UP, attemptSignUp);
    yield takeLatest(actions.ATTEMPT_ADD_CUSTOMER, attemptAddCustomer);
    yield takeLatest(actions.ATTEMPT_SIGN_IN, attemptSignIn);
    yield takeLatest(actions.ATTEMPT_CHECK_EMAIL, attemptCheckEmail);
    yield takeLatest(actions.ATTEMPT_LOG_OUT_USER, attemptLogOutUser);
    yield takeLatest(actions.ATTEMPT_SEND_CODE, attemptSendCode);
    yield takeLatest(actions.ATTEMPT_SEND_REFERRAL, attemptSendReferral);
    yield takeLatest(actions.ATTEMPT_SMS_VERIFICATION, attemptSmsVerification);
    yield takeLatest(actions.ON_SESSION_COMPLETE, onSessionComplete);
    yield takeLatest(actions.ATTEMPT_RESET_PASSWORD, attemptResetPassword);
    yield takeLatest(actions.ATTEMPT_RESET_PASSWORD_CONFIRM, attemptResetPasswordConfirm);
    yield takeLatest(actions.ATTEMPT_EQUIFAX_CHECK, attemptEquifaxCheck);
    yield takeLatest(actions.CHECK_RESET_PASSWORD_TOKEN, checkResetPasswordToken);
}

export default authUserSaga;
