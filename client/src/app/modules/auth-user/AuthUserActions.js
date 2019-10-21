import { actions } from './AuthUserReducer';

export function attemptGetUser() {
    return { type: actions.ATTEMPT_GET_USER };
}

export function getUserFailed() {
    return { type: actions.GET_USER_FAILED };
}

export function getUserSucceed(user) {
    return { type: actions.GET_USER_SUCCEED, payload: { user } };
}

export function attemptSendReferral(data) {
    return { type: actions.ATTEMPT_SEND_REFERRAL, payload: { data } };
}

export function attemptSendReferralSucceed(data) {
    return { type: actions.SEND_REFERRAL_SUCCEED,  payload: { data } };
}

export function attemptSendReferralFailed(data) {
    return { type: actions.SEND_REFERRAL_FAILED, payload: { data } };
}

export function attemptEquifaxCheck(data) {
    return { type: actions.ATTEMPT_EQUIFAX_CHECK, payload: data };
}

export function attemptEquifaxCheckSucceed(data) {
    return { type: actions.ATTEMPT_EQUIFAX_CHECK_SUCCEED,  payload: { data } };
}

export function attemptEquifaxCheckFailed(data) {
    return { type: actions.ATTEMPT_EQUIFAX_CHECK_FAILED, payload: { data } };
}

export function attemptSignIn(data) {
    return { type: actions.ATTEMPT_SIGN_IN, payload: { data } };
}

export function attemptSignUp(data) {
    return { type: actions.ATTEMPT_SIGN_UP, payload: { data } };
}

export function signUpSucceed() {
    return { type: actions.SIGN_UP_SUCCEED };
}

export function signUpFailed(fields, message = null, errors = null) {
    return {
        type: actions.SIGN_UP_FAILED,
        payload: {
            fields,
            message: message && {
                type: 'danger',
                message: message
            },
            errors
        }
    };
}

export function signInSucceed(result) {
    return { type: actions.SIGN_IN_SUCCEED, payload: { user: result.user, token: result.token } };
}

export function attemptAddCustomer(data) {
    return { type: actions.ATTEMPT_ADD_CUSTOMER, payload: { data } };
}

export function addCustomerSucceed(result) {
    return { type: actions.ADD_CUSTOMER_SUCCEED, payload: result.customer };
}

export function addCustomerFailed(fields, message = null, errors = null) {
    return {
        type: actions.ADD_CUSTOMER_FAILED,
        payload: {
            fields,
            message: message && {
                type: 'danger',
                message: message
            },
            errors
        }
    };
}

export function attemptSendCode(data) {
    return { type: actions.ATTEMPT_SEND_CODE, payload: { data } };
}

export function sendCodeSucceed(data) {
    return { type: actions.SEND_CODE_SUCCEED, payload: { data } };
}

export function sendCodeFailed(fields, message = null, errors = null) {
    return {
        type: actions.SEND_CODE_FAILED,
        payload: {
            fields,
            message: message && {
                type: 'danger',
                message: message
            },
            errors
        }
    };
}

export function attemptSmsVerification(data) {
    return { type: actions.ATTEMPT_SMS_VERIFICATION, payload: { data } };
}

export function smsVerificationSucceed(data) {
    return { type: actions.SMS_VERIFICATION_SUCCEED, payload: { data } };
}

export function smsVerificationFailed(fields, message = null, errors = null) {
    return {
        type: actions.SMS_VERIFICATION_FAILED,
        payload: {
            fields,
            message: message && {
                type: 'danger',
                message: message
            },
            errors
        }
    };
}

export function signInFailed(fields, message = null, errors = null) {
    return {
        type: actions.SIGN_IN_FAILED,
        payload: {
            fields: fields,
            message: message && {
                type: 'danger',
                message: message
            },
            errors: errors
        }
    };
}

export function onSessionComplete(data) {
    return { type: actions.ON_SESSION_COMPLETE, payload: { data: data } };
}

export function onSessionCompleteSucceed(data) {
    return { type: actions.ON_SESSION_COMPLETE_SUCCEED, payload: { data } };
}

export function onSessionCompleteFailed(data) {
    return { type: actions.ON_SESSION_COMPLETE_FAILED, payload: { data } };
}

export function clear() {
    return { type: actions.CLEAR };
}

export function attemptCheckEmail(data) {
    return { type: actions.ATTEMPT_CHECK_EMAIL, payload: { data } };
}

export function checkEmailSucceed(data) {
    return { type: actions.CHECK_EMAIL_SUCCEED,  payload: { data } };
}

export function checkEmailFailed(data) {
    return { type: actions.CHECK_EMAIL_FAILED, payload: { data } };
}

export function attemptLogOutUser() {
    return { type: actions.ATTEMPT_LOG_OUT_USER };
}

export function attemptResetPassword(data) {
    return { type: actions.ATTEMPT_RESET_PASSWORD, payload: { data } };
}

export function attemptResetPasswordSucceed(data) {
    return { type: actions.ATTEMPT_RESET_PASSWORD_SUCCEED, payload: { data } };
}

export function attemptResetPasswordFailed(data) {
    return { type: actions.ATTEMPT_RESET_PASSWORD_FAILED, payload: { data } };
}

export function attemptResetPasswordConfirm(data) {
    return { type: actions.ATTEMPT_RESET_PASSWORD_CONFIRM, payload: { data } };
}

export function attemptResetPasswordConfirmSucceed(data) {
    return { type: actions.ATTEMPT_RESET_PASSWORD_CONFIRM_SUCCEED, payload: { data } };
}

export function checkResetPasswordToken(data) {
    return { type: actions.CHECK_RESET_PASSWORD_TOKEN, payload: { data } };
}

export function checkResetPasswordTokenSucceed(data) {
    return { type: actions.CHECK_RESET_PASSWORD_TOKEN_SUCCEED, payload: { isValid: data.isValid } };
}

export function checkResetPasswordTokenFailed(data) {
    return { type: actions.CHECK_RESET_PASSWORD_TOKEN_FAILED, payload: { data } };
}

export function attemptResetPasswordConfirmFailed(data) {
    return { type: actions.ATTEMPT_RESET_PASSWORD_CONFIRM_FAILED, payload: { data } };
}

export function logOutUserFailed(message = null) {
    return {
        type: actions.LOG_OUT_USER_FAILED,
        payload: {
            message: message && {
                type: 'danger',
                message: message
            }
        }
    };
}

export function logOutUserSucceed() {
    return {
        type: actions.LOG_OUT_USER_SUCCEED
    };
}
