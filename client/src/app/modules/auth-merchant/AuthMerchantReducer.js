import { fromJS, List, Map } from 'immutable';
import {
    ACCESS_TOKEN,
    PASSWORD_CHANGED_SUCCESS,
} from 'configs/constants';

export const actions = {
    ATTEMPT_VALIDATE_MERCHANT: 'ATTEMPT_VALIDATE_MERCHANT',
    VALIDATE_MERCHANT_SUCCEED: 'VALIDATE_MERCHANT_SUCCEED',
    VALIDATE_MERCHANT_FAILED: 'VALIDATE_MERCHANT_FAILED',

    ATTEMPT_ADD_MERCHANT: 'ATTEMPT_ADD_MERCHANT',
    ADD_MERCHANT_SUCCEED: 'ADD_MERCHANT_SUCCEED',
    ADD_MERCHANT_FAILED: 'ADD_MERCHANT_FAILED',
    GET_MERCHANT_SUCCEED: 'GET_MERCHANT_SUCCEED',

    ATTEMPT_MERCHANT_SIGN_IN: 'ATTEMPT_MERCHANT_SIGN_IN',
    MERCHANT_SIGN_IN_SUCCEED: 'MERCHANT_SIGN_IN_SUCCEED',
    MERCHANT_SIGN_IN_FAILED: 'MERCHANT_SIGN_IN_FAILED',

    ATTEMPT_MERCHANT_RESET_PASSWORD: 'ATTEMPT_MERCHANT_RESET_PASSWORD',
    ATTEMPT_MERCHANT_RESET_PASSWORD_SUCCEED: 'ATTEMPT_MERCHANT_RESET_PASSWORD_SUCCEED',
    ATTEMPT_MERCHANT_RESET_PASSWORD_FAILED: 'ATTEMPT_MERCHANT_RESET_PASSWORD_FAILED',

    ATTEMPT_MERCHANT_RESET_PASSWORD_CONFIRM: 'ATTEMPT_MERCHANT_RESET_PASSWORD_CONFIRM',
    ATTEMPT_MERCHANT_RESET_PASSWORD_CONFIRM_SUCCEED: 'ATTEMPT_MERCHANT_RESET_PASSWORD_CONFIRM_SUCCEED',
    ATTEMPT_MERCHANT_RESET_PASSWORD_CONFIRM_FAILED: 'ATTEMPT_MERCHANT_RESET_PASSWORD_CONFIRM_FAILED',
    CHECK_MERCHANT_RESET_PASSWORD_TOKEN: 'CHECK_MERCHANT_RESET_PASSWORD_TOKEN',
    CHECK_MERCHANT_RESET_PASSWORD_TOKEN_SUCCEED: 'CHECK_MERCHANT_RESET_PASSWORD_TOKEN_SUCCEED',
    CHECK_MERCHANT_RESET_PASSWORD_TOKEN_FAILED: 'CHECK_MERCHANT_RESET_PASSWORD_TOKEN_FAILED',

    CLEAR: 'CLEAR',
};

const defaultState = fromJS({
    resetPasswordTokenStatus: null,
    loggedInUser: null,
    resetPasswordConfirm: false,
    fields: {},
    merchant: {},
    messages: List(),
    errors: {}
});

export default (state = defaultState, { type, payload }) => {
    switch (type) {
            case actions.CLEAR:
                return state
                        .set('messages', List())
                        .set('fields', Map())
                        .set('errors', Map())
                        .set('resetPasswordTokenStatus', null);

            case actions.GET_MERCHANT_SUCCEED:
                return state
                        .set('loggedInUser', fromJS(payload.user));

            case actions.ADD_MERCHANT_SUCCEED:
                return state
                        .set('loggedInUser', payload.data);

            case actions.ADD_MERCHANT_FAILED:
                return state
                        .set('errors', payload.messages);

            case actions.VALIDATE_MERCHANT_SUCCEED:
                return state
                        .set('loggedInUser', payload.data.merchant);

            case actions.VALIDATE_MERCHANT_FAILED:
                return state
                        .set('errors', payload);

            case actions.MERCHANT_SIGN_IN_SUCCEED:
                localStorage.setItem(ACCESS_TOKEN, payload.token.access_token);

                return state
                        .set('loggedInUser', fromJS(payload.user));

            case actions.MERCHANT_SIGN_IN_FAILED:

                return state
                        .set('fields', Map(payload.fields || {}))
                        .set('errors', Map(payload.errors || {}))
                        .updateIn(['messages'], messages => messages.push(Map(payload.message || {})));

            case actions.ATTEMPT_MERCHANT_RESET_PASSWORD_SUCCEED:
                return state.set('messages', fromJS([payload.data]));

            case actions.ATTEMPT_MERCHANT_RESET_PASSWORD_FAILED:
                return state
                        .set('fields', Map(payload.data.fields || {}))
                        .set('errors', Map(payload.data.errors || {}))
                        .set('messages', fromJS([{ type: 'danger', message: payload.data.message }]));

            case actions.ATTEMPT_MERCHANT_RESET_PASSWORD_CONFIRM:

                return state
                        .set('resetPasswordConfirm', true)
                        .updateIn(['messages'], messages => messages.push(Map(payload.data || {})));

            case actions.ATTEMPT_MERCHANT_RESET_PASSWORD_CONFIRM_SUCCEED:

                return state
                        .updateIn(['messages'], messages => messages.push(Map({ type: 'success', message: PASSWORD_CHANGED_SUCCESS })));

            case actions.CHECK_MERCHANT_RESET_PASSWORD_TOKEN_SUCCEED:
                return state
                        .set('resetPasswordTokenStatus', payload.isValid);

            case actions.CHECK_MERCHANT_RESET_PASSWORD_TOKEN_FAILED:
                return state
                        .set('resetPasswordTokenStatus', payload.data);

            default:
                return state;
    }
};
