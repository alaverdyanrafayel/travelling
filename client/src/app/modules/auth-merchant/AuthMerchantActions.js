import { actions } from './AuthMerchantReducer';

export function getMerchantSucceed(user) {
    return { type: actions.GET_MERCHANT_SUCCEED, payload: { user } };
}

export function attemptValidateMerchant(data) {
    return { type: actions.ATTEMPT_VALIDATE_MERCHANT, payload: { data } };
}

export function validateMerchantFailed(response) {
    return { type: actions.VALIDATE_MERCHANT_FAILED, payload: { response } };
}

export function validateMerchantSucceed(response) {
    return { type: actions.VALIDATE_MERCHANT_SUCCEED, payload: { data: response.data } };
}

export function attemptAddMerchant(data) {
    return { type: actions.ATTEMPT_ADD_MERCHANT, payload: { data } };
}

export function addMerchantSucceed(response) {
    return { type: actions.ADD_MERCHANT_SUCCEED, payload: { data: response.data } };
}

export function addMerchantFailed(data) {
    return { type: actions.ADD_MERCHANT_FAILED, payload: { data } };
}

export function attemptSignIn(data) {
    return { type: actions.ATTEMPT_MERCHANT_SIGN_IN, payload: { data } };
}

export function signInSucceed(result) {
    return { type: actions.MERCHANT_SIGN_IN_SUCCEED, payload: { user: result.user, token: result.token } };
}

export function signInFailed(fields, message = null, errors = null) {
    return {
        type: actions.MERCHANT_SIGN_IN_FAILED,
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

export function attemptMerchantResetPassword(data) {
    return { type: actions.ATTEMPT_MERCHANT_RESET_PASSWORD, payload: { data } };
}

export function attemptMerchantResetPasswordSucceed(data) {
    return { type: actions.ATTEMPT_MERCHANT_RESET_PASSWORD_SUCCEED, payload: { data } };
}

export function attemptMerchantResetPasswordFailed(data) {
    return { type: actions.ATTEMPT_MERCHANT_RESET_PASSWORD_FAILED, payload: { data } };
}

export function attemptMerchantResetPasswordConfirm(data) {
    return { type: actions.ATTEMPT_MERCHANT_RESET_PASSWORD_CONFIRM, payload: { data } };
}

export function attemptMerchantResetPasswordConfirmSucceed(data) {
    return { type: actions.ATTEMPT_MERCHANT_RESET_PASSWORD_CONFIRM_SUCCEED, payload: { data } };
}

export function attemptMerchantResetPasswordConfirmFailed(data) {
    return { type: actions.ATTEMPT_MERCHANT_RESET_PASSWORD_CONFIRM_FAILED, payload: { data } };
}

export function checkMerchantResetPasswordToken(data) {
    return { type: actions.CHECK_MERCHANT_RESET_PASSWORD_TOKEN, payload: { data } };
}

export function checkMerchantResetPasswordTokenSucceed(data) {
    return { type: actions.CHECK_MERCHANT_RESET_PASSWORD_TOKEN_SUCCEED, payload: { isValid: data.isValid } };
}

export function checkMerchantResetPasswordTokenFailed(data) {
    return { type: actions.CHECK_MERCHANT_RESET_PASSWORD_TOKEN_FAILED, payload: { data } };
}

export function clear() {
    return { type: actions.CLEAR };
}
