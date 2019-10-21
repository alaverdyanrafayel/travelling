import { fromJS, List, Map } from 'immutable';
import {
    ACCESS_TOKEN,
    ALREADY_EXISTS,
    PASSWORD_CHANGED_SUCCESS,
    PENDING_MESSAGE,
    PENDING
} from 'configs/constants';

export const actions = {
    ATTEMPT_GET_USER: 'ATTEMPT_GET_USER',
    GET_USER_SUCCEED: 'GET_USER_SUCCEED',
    GET_USER_FAILED: 'GET_USER_FAILED',
    ON_SESSION_COMPLETE: 'ON_SESSION_COMPLETE',
    ON_SESSION_COMPLETE_SUCCEED: 'ON_SESSION_COMPLETE_SUCCED',
    ON_SESSION_COMPLETE_FAILED: 'ON_SESSION_COMPLETE_FAILED',

    ATTEMPT_LOG_OUT_USER: 'ATTEMPT_LOG_OUT_USER',
    LOG_OUT_USER_SUCCEED: 'LOG_OUT_USER_SUCCEED',
    LOG_OUT_USER_FAILED: 'LOG_OUT_USER_FAILED',

    ATTEMPT_ADD_CUSTOMER: 'ATTEMPT_ADD_CUSTOMER',
    ADD_CUSTOMER_FAILED: 'ADD_CUSTOMER_FAILED',
    ADD_CUSTOMER_SUCCEED: 'ADD_CUSTOMER_SUCCEED',

    CLEAR: 'CLEAR',

    ATTEMPT_SEND_REFERRAL: 'ATTEMPT_SEND_REFERRAL',
    SEND_REFERRAL_SUCCEED: 'SEND_REFERRAL_SUCCESS',
    SEND_REFERRAL_FAILED: 'SEND_REFERRAL_FAILED',

    ATTEMPT_EQUIFAX_CHECK: 'ATTEMPT_EQUIFAX_CHECK',
    ATTEMPT_EQUIFAX_CHECK_SUCCEED: 'ATTEMPT_EQUIFAX_CHECK_SUCCEED',
    ATTEMPT_EQUIFAX_CHECK_FAILED: 'ATTEMPT_EQUIFAX_CHECK_FAILED',

    ATTEMPT_SIGN_IN: 'ATTEMPT_SIGN_IN',
    ATTEMPT_SIGN_UP: 'ATTEMPT_SIGN_UP',
    SIGN_IN_SUCCEED: 'SIGN_IN_SUCCESS',
    SIGN_IN_FAILED: 'SIGN_IN_FAILED',
    SIGN_UP_FAILED: 'SIGN_UP_FAILED',
    SIGN_UP_SUCCEED: 'SIGN_UP_SUCCEED',

    ATTEMPT_CHECK_EMAIL: 'ATTEMPT_CHECK_EMAIL',
    CHECK_EMAIL_SUCCEED: 'CHECK_EMAIL_SUCCEED',
    CHECK_EMAIL_FAILED: 'CHECK_EMAIL_FAILED',

    ATTEMPT_SEND_CODE: 'ATTEMPT_SEND_CODE',
    SEND_CODE_SUCCEED: 'SEND_CODE_SUCCEED',
    SEND_CODE_FAILED: 'SEND_CODE_FAILED',
    ATTEMPT_SMS_VERIFICATION: 'ATTEMPT_SMS_VERIFICATION',
    SMS_VERIFICATION_SUCCEED: 'SMS_VERIFICATION_SUCCEED',
    SMS_VERIFICATION_FAILED: 'SMS_VERIFICATION_FAILED',
    ATTEMPT_RESET_PASSWORD: 'ATTEMPT_RESET_PASSWORD',
    ATTEMPT_RESET_PASSWORD_SUCCEED: 'ATTEMPT_RESET_PASSWORD_SUCCEED',
    ATTEMPT_RESET_PASSWORD_FAILED: 'ATTEMPT_RESET_PASSWORD_FAILED',
    ATTEMPT_RESET_PASSWORD_CONFIRM: 'ATTEMPT_RESET_PASSWORD_CONFIRM',
    ATTEMPT_RESET_PASSWORD_CONFIRM_SUCCEED: 'ATTEMPT_RESET_PASSWORD_CONFIRM_SUCCEED',
    ATTEMPT_RESET_PASSWORD_CONFIRM_FAILED: 'ATTEMPT_RESET_PASSWORD_CONFIRM_FAILED',
    CHECK_RESET_PASSWORD_TOKEN: 'CHECK_RESET_PASSWORD_TOKEN',
    CHECK_RESET_PASSWORD_TOKEN_SUCCEED: 'CHECK_RESET_PASSWORD_TOKEN_SUCCEED',
    CHECK_RESET_PASSWORD_TOKEN_FAILED: 'CHECK_RESET_PASSWORD_TOKEN_FAILED',
    ATTEMPT_MERCHANT_RESET_PASSWORD_CONFIRM_SUCCEED: 'ATTEMPT_MERCHANT_RESET_PASSWORD_CONFIRM_SUCCEED',
    CHECK_MERCHANT_RESET_PASSWORD_TOKEN_FAILED: 'CHECK_MERCHANT_RESET_PASSWORD_TOKEN_FAILED',
};

const defaultState = fromJS({
    resetPasswordConfirm: false,
    resetPasswordTokenStatus: null,
    loggedInUser: null,
    messages: List(),
    fields: {},
    errors: {},
    prevSentEmail: null,
});

export default (state = defaultState, { type, payload }) => {
    switch (type) {
            case actions.CLEAR:
                return state
                        .set('messages', List())
                        .set('fields', Map())
                        .set('errors', Map())
                        .set('resetPasswordTokenStatus', null);

            case actions.ADD_CUSTOMER_SUCCEED:
                return state
                        .update('loggedInUser', v => {
                            return fromJS({
                                id: v.toJS().id,
                                email: v.toJS().email,
                                customer: {
                                    id: payload.data.data.id,
                                    first_name: payload.data.data.first_name,
                                    last_name: payload.data.data.last_name,
                                    middle_name: payload.data.data.middle_name,
                                    dob: payload.data.data.dob
                                }
                            });
                        });

            case actions.SIGN_IN_SUCCEED:
                localStorage.setItem(ACCESS_TOKEN, payload.token.access_token);

                return state
                        .set('loggedInUser', fromJS(payload.user));

            case actions.SIGN_UP_FAILED:
            case actions.ADD_CUSTOMER_FAILED:
                return state
                        .set('fields', Map(payload.fields || {}))
                        .set('errors', Map(payload.errors || {}))
                        .updateIn(['messages'], messages => messages.push(Map(payload.message || {})));

            case actions.CHECK_EMAIL_FAILED:
                return state
                        .set('fields', Map(payload.data.fields || {}))
                        .set('errors', Map({ ...payload.data.errors, email: ALREADY_EXISTS } || { email: ALREADY_EXISTS }));

            case actions.CHECK_EMAIL_SUCCEED:
                return state
                        .set('fields', Map(payload.data.fields || {}))
                        .set('errors', Map({ ...payload.data.errors, email: '' } || { email: '' }));

            case actions.SEND_REFERRAL_SUCCEED:
                return state
                        .set('fields', Map(payload.data.fields || {}))
                        .set('errors', Map({ ...payload.data.errors, email: '' } || { email: '' }))
                        .set('messages',  [payload.data.message || '']);

            case actions.SEND_REFERRAL_FAILED:
                return state
                        .set('errors', payload.data.message);

            case actions.ATTEMPT_EQUIFAX_CHECK_SUCCEED:
                return state
                        .set('fields', Map(payload.data.fields || {}))
                        .set('errors', Map( payload.data.errors  || {}));

            case actions.ATTEMPT_EQUIFAX_CHECK_FAILED:
                return state
                        .set('errors', payload.data.message);

            case actions.SEND_CODE_SUCCEED:
                return state
                        .set('fields', Map(payload.data.fields || {}))
                        .set('errors', Map(payload.data.errors || {}))
                        .updateIn(['messages'], messages => messages.push(Map(payload.message || {})));

            case actions.SEND_CODE_FAILED:
                return state
                        .set('fields', Map(payload.fields || {}))
                        .set('errors', Map(payload.errors || {}))
                        .updateIn(['messages'], messages => messages.push(Map(payload.message || {})));

            case actions.SMS_VERIFICATION_SUCCEED:
                return state
                        .set('fields', Map(payload.data.fields || {}))
                        .set('errors', Map(payload.data.errors || {}))
                        .setIn(['loggedInUser', 'customer', 'is_mobile_verified'], true)
                        .updateIn(['messages'], messages => messages.push(Map(payload.message || {})));

            case actions.SMS_VERIFICATION_FAILED:
                return state
                        .set('fields', Map(payload.fields || {}))
                        .set('errors', Map(payload.errors || {}))
                        .updateIn(['messages'], messages => messages.push(Map(payload.message || {})));

            case actions.ON_SESSION_COMPLETE_SUCCEED:
                if (payload.data.data.data.id_status === PENDING) {
                    return state
                            .setIn(['loggedInUser', 'customer', 'id_status'], PENDING)
                            .set('fields', Map({}))
                            .set('errors', Map({}))
                            .set('messages', fromJS([{ type: 'info', message: PENDING_MESSAGE }]));
                } else  {
                    return state
                            .setIn(['loggedInUser', 'customer', 'is_session_complete'], true)
                            .setIn(['loggedInUser', 'status'], 'active');
                }

            case actions.ON_SESSION_COMPLETE_FAILED:
                return state
                        .set('fields', Map(payload.fields || {}))
                        .set('errors', Map(payload.errors || {}))
                        .set('messages', fromJS([{ type: 'danger', message: payload.data }]));

            case actions.SIGN_IN_FAILED:
                return state
                        .set('fields', Map(payload.fields || {}))
                        .set('errors', Map(payload.errors || {}))
                        .updateIn(['messages'], messages => messages.push(Map(payload.message || {})));

            case actions.GET_USER_SUCCEED:
                return state
                        .set('loggedInUser', fromJS(payload.user));

            case actions.ATTEMPT_RESET_PASSWORD_SUCCEED:
                return state
                        .set('fields', Map(payload.data || {}))
                        .set('messages', fromJS([payload.data.notification]))
                        .set('prevSentEmail', payload.data.prevSentEmail);

            case actions.ATTEMPT_RESET_PASSWORD_FAILED:
                return state
                        .set('fields', Map(payload.data.fields || {}))
                        .set('errors', Map(payload.data.errors || {}))
                        .set('messages', fromJS([{ type: 'danger', message: payload.data.message }]));
                
            case actions.ATTEMPT_RESET_PASSWORD_CONFIRM:
                return state
                        .set('resetPasswordConfirm', true)
                        .updateIn(['messages'], messages => messages.push(Map(payload.data || {})));

            case actions.ATTEMPT_RESET_PASSWORD_CONFIRM_SUCCEED:
                localStorage.setItem(ACCESS_TOKEN, payload.data.token.access_token);

                return state
                        .updateIn(['messages'], messages => messages.push(Map({ type: 'success', message: PASSWORD_CHANGED_SUCCESS })))
                        .set('loggedInUser', fromJS(payload.data.user));

            case actions.CHECK_RESET_PASSWORD_TOKEN_SUCCEED:
                return state
                        .set('resetPasswordTokenStatus', payload.isValid);

            case actions.CHECK_RESET_PASSWORD_TOKEN_FAILED:
                return state
                        .set('resetPasswordTokenStatus', payload.data);

            case actions.SIGN_UP_SUCCEED:
                return state
                        .set('resetPasswordConfirm', true);
    
            case actions.LOG_OUT_USER_SUCCEED:
            case actions.GET_USER_FAILED:
                localStorage.removeItem(ACCESS_TOKEN);
                
                return state.
                        set('loggedInUser', null);

            case actions.LOG_OUT_USER_FAILED:
                return state
                        .updateIn(['messages'], messages => messages.push(Map(payload.data.emailSentMessage || {})));

            case actions.ATTEMPT_MERCHANT_RESET_PASSWORD_CONFIRM_SUCCEED:
                localStorage.setItem(ACCESS_TOKEN, payload.data.token.access_token);

                return state
                        .set('loggedInUser', fromJS(payload.data.user));

            case actions.CHECK_MERCHANT_RESET_PASSWORD_TOKEN_FAILED:
                return state
                        .set('resetPasswordTokenStatus', payload.data);

            default:
                return state;
    }
};
