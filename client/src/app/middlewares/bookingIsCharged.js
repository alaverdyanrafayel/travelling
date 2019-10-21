/* eslint-disable camelcase */

import { browserHistory } from 'react-router';
import { BANK_STATEMENTS_CHECK_URL, STATUS_PENDING, CUSTOMER_DASHBOARD_ROUTE } from 'configs/constants';

export default async function bookingIsCharged(store, bookingId) {

    const booking = store.getState().getIn(['bookingData', 'singleBooking'])
            .toJS();
    const { is_equifax_passed, is_bankstatements_passed } = booking;
    if (booking.status !== STATUS_PENDING) {
        browserHistory.push(CUSTOMER_DASHBOARD_ROUTE);
    } else if (is_equifax_passed === null && is_bankstatements_passed === null) {
        browserHistory.push(`${BANK_STATEMENTS_CHECK_URL}${bookingId}/`);
    }
}
