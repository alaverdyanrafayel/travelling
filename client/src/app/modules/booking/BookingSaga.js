import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './BookingReducer';
import * as Actions from './BookingActions';
import * as Api from 'api/BookingApi';

export function* attemptCreateBooking(request) {
    try {
        const response = yield call(Api.attemptCreateBooking, request.payload.data);
        yield put(Actions.attemptCreateBookingSucceed({ booking: response }));
    } catch (response) {
        yield put(Actions.attemptCreateBookingFailed(response.message));
    }
}

export function* attemptGetBooking({ payload: { data } }) {
    try {
        const response = yield call(Api.attemptGetBooking, data);
        yield put(Actions.attemptGetBookingSucceed(response.data));
    } catch ({ response: { data: { message } } }) {
        yield put(Actions.attemptGetBookingFailed(message));
    }
}

export function* attemptGetBookings() {
    try {
        const response = yield call(Api.attemptHasPendingBookings);
        yield put(Actions.attemptGetBookingsSucceed(response.data));
    } catch ({ response: { data: { message } } }) {
        yield put(Actions.attemptGetBookingsFailed(message));
    }
}

export function* attemptDownloadDocs(data) {
    try {
        const response = yield call(Api.attemptDownloadDocs, data.payload.data);
        yield put(Actions.attemptDownloadDocsSucceed(response.data));
    } catch ({ response: { data: { message } } }) {
        yield put(Actions.attemptDownloadDocsFailed(message));
    }
}

export function* attemptConfirmOrder({ payload: { data } }) {
    try {
        const response = yield call(Api.attemptConfirmOrder, data);
        yield put(Actions.attemptConfirmOrderSucceed(response.data));
    } catch ({ response: { data: { message } } }) {
        yield put(Actions.attemptConfirmOrderFailed(message));
    }
}

function* BookingSaga() {
    yield takeLatest(actions.ATTEMPT_CREATE_BOOKING, attemptCreateBooking);
    yield takeLatest(actions.ATTEMPT_GET_BOOKING, attemptGetBooking);
    yield takeLatest(actions.ATTEMPT_GET_BOOKINGS, attemptGetBookings);
    yield takeLatest(actions.ATTEMPT_DOWNLOAD_DOCS, attemptDownloadDocs);
    yield takeLatest(actions.ATTEMPT_FINALISE_CONFIRM, attemptConfirmOrder);    
}

export default BookingSaga;
