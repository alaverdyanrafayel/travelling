import { actions } from './BankstatementsReducer';

export function attemptGetStatus(data) {
    return { type: actions.ATTEMPT_GET_STATUS, payload: { data }  };
}

export function attemptGetStatusSucceed(data) {
    return { type: actions.ATTEMPT_GET_STATUS_SUCCEED, payload: { data } };
}

export function attemptGetStatusFailed(data) {
    return { type: actions.ATTEMPT_GET_STATUS_FAILED, payload: { data } };
}
