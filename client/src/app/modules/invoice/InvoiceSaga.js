import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './InvoiceReducer';
import * as Actions from './InvoiceActions';
import * as Api from 'api/InvoiceApi';

export function* attemptGetInvoices() {
    try {
        const response = yield call(Api.attemptGetInvoices);
        yield put(Actions.attemptGetInvoicesSucceed(response.data));
    } catch (error) {
        yield put(Actions.attemptGetInvoicesFailed(JSON.parse(error)));
    }
}

function* InvoiceSaga() {
    yield takeLatest(actions.ATTEMPT_GET_INVOICES, attemptGetInvoices);
}

export default InvoiceSaga;
