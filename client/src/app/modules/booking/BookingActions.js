import { actions } from './BookingReducer';

export function attemptCreateBooking(data) {
    return { type: actions.ATTEMPT_CREATE_BOOKING, payload: { data } };
}

export function attemptCreateBookingSucceed(data) {
    return { type: actions.ATTEMPT_CREATE_BOOKING_SUCCEED, payload: { data } };
}

export function attemptCreateBookingFailed(data) {
    return { type: actions.ATTEMPT_CREATE_BOOKING_FAILED, payload: { data } };
}

export function attemptGetBooking(data) {
    return { type: actions.ATTEMPT_GET_BOOKING, payload: { data }  };
}

export function attemptGetBookingSucceed(data) {
    return { type: actions.ATTEMPT_GET_BOOKING_SUCCEED, payload: { data } };
}

export function attemptGetBookingFailed(data) {
    return { type: actions.ATTEMPT_GET_BOOKING_FAILED, payload: { data } };
}

export function attemptGetBookings() {
    return { type: actions.ATTEMPT_GET_BOOKINGS };
}

export function attemptGetBookingsSucceed(data) {
    return { type: actions.ATTEMPT_GET_BOOKINGS_SUCCEED, payload: { data } };
}

export function attemptGetBookingsFailed(data) {
    return { type: actions.ATTEMPT_GET_BOOKINGS_FAILED, payload: { data } };
}

export function attemptDownloadDocs(data) {
    return { type: actions.ATTEMPT_DOWNLOAD_DOCS, payload: { data } };
}

export function attemptDownloadDocsSucceed(data) {
    return { type: actions.ATTEMPT_DOWNLOAD_DOCS_SUCCEED, payload: { data } };
}

export function attemptDownloadDocsFailed(data) {
    return { type: actions.ATTEMPT_DOWNLOAD_DOCS_FAILED, payload: { data } };
}

export function attemptConfirmOrder(data) {
    return { type: actions.ATTEMPT_FINALISE_CONFIRM, payload: { data } };
}

export function attemptConfirmOrderSucceed(data) {
    return { type: actions.ATTEMPT_FINALISE_CONFIRM_SUCCEED, payload: { data } };
}

export function attemptConfirmOrderFailed(data) {
    return { type: actions.ATTEMPT_FINALISE_CONFIRM_FAILED, payload: { data } };
}
