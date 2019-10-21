import { actions } from './PaymentReducer';

export function clear() {
    return { type: actions.CLEAR };
}

export function attemptAddPayment(data) {
    return { type: actions.ATTEMPT_ADD_PAYMENT, payload: { data } };
}

export function attemptAddPaymentSucceed(data) {
    return { type: actions.ATTEMPT_ADD_PAYMENT_SUCCEED, payload: { data } };
}

export function attemptAddPaymentFailed(data) {
    return { type: actions.ATTEMPT_ADD_PAYMENT_FAILED, payload: { data } };
}

export function attemptDeletePayment(data) {
    return { type: actions.ATTEMPT_DELETE_PAYMENT, payload: { data } };
}

export function attemptDeletePaymentSucceed(data) {
    return { type: actions.ATTEMPT_DELETE_PAYMENT_SUCCEED, payload: { data } };
}

export function attemptDeletePaymentFailed(data) {
    return { type: actions.ATTEMPT_DELETE_PAYMENT_FAILED, payload: { data } };
}

export function attemptDefaultPayment(data) {
    return { type: actions.ATTEMPT_DEFAULT_PAYMENT, payload: { data } };
}

export function attemptDefaultPaymentSucceed(data) {
    return { type: actions.ATTEMPT_DEFAULT_PAYMENT_SUCCEED, payload: { data } };
}

export function attemptDefaultPaymentFailed(data) {
    return { type: actions.ATTEMPT_DEFAULT_PAYMENT_FAILED, payload: { data } };
}

export function attemptCardValidationFailed(data) {
    return { type: actions.ATTEMPT_CARD_VALIDATION_FAILED, payload: { data } };
}
export function attemptCardValidationSucceed() {
    return { type: actions.ATTEMPT_CARD_VALIDATION_SUCCEED };
}

export function attemptGetPayment() {
    return { type: actions.ATTEMPT_GET_PAYMENT };
}

export function attemptGetPaymentSucceed(data) {
    return { type: actions.ATTEMPT_GET_PAYMENT_SUCCEED, payload: { data } };
}

export function attemptGetPaymentFailed(data) {
    return { type: actions.ATTEMPT_GET_PAYMENT_FAILED, payload: { data } };
}

export function attemptUpdatePayment(data) {
    return { type: actions.ATTEMPT_UPDATE_PAYMENT, payload: { data } };
}

export function attemptUpdatePaymentSucceed(data) {
    return { type: actions.ATTEMPT_UPDATE_PAYMENT_SUCCEED, payload: { data } };
}

export function attemptUpdatePaymentFailed(data) {
    return { type: actions.ATTEMPT_UPDATE_PAYMENT_FAILED, payload: { data } };
}

export function attemptCharges(data) {
    return { type: actions.ATTEMPT_CHARGES, payload: { data } };
}

export function attemptChargesSucceed(data) {
    return { type: actions.ATTEMPT_CHARGES_SUCCEED, payload: { data } };
}

export function attemptChargesFailed(data) {
    return { type: actions.ATTEMPT_CHARGES_FAILED, payload: { data } };
}
