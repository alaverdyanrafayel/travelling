import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './PaymentReducer';
import * as Actions from './PaymentActions';
import * as Api from 'api/PaymentApi';
import { delay } from 'redux-saga';

export function* attemptAddPaymentCard({ payload: { data } }) {
    try {
        const response = yield call(Api.attemptAddPaymentCard, data);
        yield put(Actions.attemptAddPaymentSucceed(response.data));
        yield delay(3000);
        yield put(Actions.clear());
    }catch( { response: { data: { message } } }) {
        yield put(Actions.attemptAddPaymentFailed({ message }));
    }
}

export function* attemptDeletePaymentCard({ payload: { data } }) {
    try {
        yield call(Api.attemptDeletePaymentCard, data);
        yield put(Actions.attemptDeletePaymentSucceed(data));
    }catch({ response: { data: { message } } }) {
        yield put(Actions.attemptDeletePaymentFailed({ message }));
    }
}

export function* attemptDefaultPaymentCard({ payload: { data } }) {
    try {
        const response = yield call(Api.attemptDefaultPaymentCard, data);
        yield put(Actions.attemptDefaultPaymentSucceed(response.data));
    }catch({ response: { data: { message } } }) {
        yield put(Actions.attemptDefaultPaymentFailed({ message }));
    }
}

export function* attemptGetPaymentCards() {
    try {
        const response = yield call(Api.attemptGetPaymentCards);
        yield put(Actions.attemptGetPaymentSucceed(response.data));
    } catch ({ response: { data: { message } } }) {
        yield put(Actions.attemptGetPaymentFailed({ message }));
    }
}

export function* attemptUpdatePaymentCard({ payload: { data } }) {
    try {
        const response = yield call(Api.attemptUpdatePaymentCard, data);
        yield put(Actions.attemptUpdatePaymentSucceed({ updatedCard: response.data, cardId: data.cardId }));
    } catch ({ response: { data: { message } } }) {
        yield put(Actions.attemptUpdatePaymentFailed({ message }));
    }
}

export function* attemptCharges({ payload: { data } }) {
    try {
        const response = yield call(Api.attemptCharges, data);
        yield put(Actions.attemptChargesSucceed(response.data));
    } catch ({ response: { data: { message } } }) {
        yield put(Actions.attemptChargesFailed({ message }));
    }
}

function* PaymentSaga() {
    yield takeLatest(actions.ATTEMPT_ADD_PAYMENT, attemptAddPaymentCard);
    yield takeLatest(actions.ATTEMPT_GET_PAYMENT, attemptGetPaymentCards);
    yield takeLatest(actions.ATTEMPT_DELETE_PAYMENT, attemptDeletePaymentCard);
    yield takeLatest(actions.ATTEMPT_DEFAULT_PAYMENT, attemptDefaultPaymentCard);
    yield takeLatest(actions.ATTEMPT_UPDATE_PAYMENT, attemptUpdatePaymentCard);
    yield takeLatest(actions.ATTEMPT_CHARGES, attemptCharges);
}

export default PaymentSaga;
