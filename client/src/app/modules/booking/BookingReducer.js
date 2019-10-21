import { fromJS } from 'immutable';

export const actions = {
    ATTEMPT_CREATE_BOOKING: 'ATTEMPT_CREATE_BOOKING',
    ATTEMPT_CREATE_BOOKING_SUCCEED: 'ATTEMPT_CREATE_BOOKING_SUCCEED',
    ATTEMPT_CREATE_BOOKING_FAILED: 'ATTEMPT_CREATE_BOOKING_FAILED',
    ATTEMPT_GET_BOOKING: 'ATTEMPT_GET_BOOKING',
    ATTEMPT_GET_BOOKING_SUCCEED: 'ATTEMPT_GET_BOOKING_SUCCEED',
    ATTEMPT_GET_BOOKING_FAILED: 'ATTEMPT_GET_BOOKING_FAILED',
    ATTEMPT_GET_BOOKINGS: 'ATTEMPT_GET_BOOKINGS',
    ATTEMPT_GET_BOOKINGS_SUCCEED: 'ATTEMPT_GET_BOOKINGS_SUCCEED',
    ATTEMPT_GET_BOOKINGS_FAILED: 'ATTEMPT_GET_BOOKINGS_FAILED',
    ATTEMPT_DOWNLOAD_DOCS: 'ATTEMPT_DOWNLOAD_DOCS',
    ATTEMPT_DOWNLOAD_DOCS_SUCCEED: 'ATTEMPT_DOWNLOAD_DOCS_SUCCEED',
    ATTEMPT_DOWNLOAD_DOCS_FAILED: 'ATTEMPT_DOWNLOAD_DOCS_FAILED',
    ATTEMPT_FINALISE_CONFIRM: 'ATTEMPT_FINALISE_CONFIRM',
    ATTEMPT_FINALISE_CONFIRM_SUCCEED: 'ATTEMPT_FINALISE_CONFIRM_SUCCEED',
    ATTEMPT_FINALISE_CONFIRM_FAILED: 'ATTEMPT_FINALISE_CONFIRM_FAILED'
};

const defaultState = fromJS({
    bookings: [],
    docs: [],
    errors: [],
    singleBooking: {},
    message: {}
});

export default (state = defaultState, { type, payload }) => {
    switch(type) {
            case actions.ATTEMPT_CREATE_BOOKING_SUCCEED:
                return state
                        .set('booking111', fromJS(payload.data));

            case actions.ATTEMPT_CREATE_BOOKING_FAILED:
                return state
                        .set('errors', payload);

            case actions.ATTEMPT_GET_BOOKING_SUCCEED:
                return state
                        .set('singleBooking', fromJS(payload.data.data));
                        
            case actions.ATTEMPT_GET_BOOKING_FAILED:
                return state
                        .set('message', fromJS({ type: 'danger', message: payload.data }));

            case actions.ATTEMPT_GET_BOOKINGS_SUCCEED:
                return state
                        .set('bookings', fromJS(payload.data.data));
                        
            case actions.ATTEMPT_GET_BOOKINGS_FAILED:
                return state
                        .set('message', fromJS({ type: 'danger', message: payload.data }));

            case actions.ATTEMPT_FINALISE_CONFIRM_SUCCEED:
                return state
                        .set('message', fromJS({ type: 'success', message: payload.data.message }));

            case actions.ATTEMPT_FINALISE_CONFIRM_FAILED:
                return state
                        .set('message', fromJS({ type: 'danger', message: payload.data }));
                
            case actions.ATTEMPT_DOWNLOAD_DOCS_SUCCEED:
                return state
                        .set('docs', fromJS(payload.data.data));
                        
            case actions.ATTEMPT_DOWNLOAD_DOCS_FAILED:
                return state
                        .set('message', fromJS({ type: 'danger', message: payload.data }));
            default:
                return state;
    }
};
