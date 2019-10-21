import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './BankstatementsReducer';
import * as Actions from './BankstatementsActions';
import * as Api from 'api/BankstatementsApi';

export function* attemptGetStatus(request) {
    try {
        const response = yield call(Api.attemptGetStatus, request.payload.data);
        yield put(Actions.attemptGetStatusSucceed(response));
    }catch( { response }) {
        yield put(Actions.attemptGetStatusFailed(response ));
    }
}

function* BankstatementsSaga() {
    yield takeLatest(actions.ATTEMPT_GET_STATUS, attemptGetStatus);
}

export default BankstatementsSaga;
