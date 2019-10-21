/* eslint-disable camelcase */

import { browserHistory } from 'react-router';
import { CONFIRM_ORDER, STATUS_PENDING, CUSTOMER_DASHBOARD_ROUTE } from 'configs/constants';

export default async function bankstatementIsPassed(store, bookingId) {

    const booking = store.getState().getIn(['bookingData', 'singleBooking'])
            .toJS();
    const { is_equifax_passed, is_bankstatements_passed } = booking;
    if (booking.status !== STATUS_PENDING) {
        browserHistory.push(CUSTOMER_DASHBOARD_ROUTE);
    } else if (is_equifax_passed !== null || is_bankstatements_passed !== null) {
        browserHistory.push(`${CONFIRM_ORDER}/${bookingId}/`);
    }
}
