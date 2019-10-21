/* eslint-disable no-unused-vars */
import { browserHistory } from 'react-router';
import { LOGIN_ROUTE, TRANSACTION_LOGIN_ROUTE } from '../../configs/constants';

export default (store, reviewBookingPage = false, pathname = null, id = null) => {
    const state = store.getState();
    if (!state.getIn(['userData', 'loggedInUser'])) {

        if(reviewBookingPage) {
            browserHistory.push(`${TRANSACTION_LOGIN_ROUTE}${id}/`);

        } else {
            browserHistory.push(LOGIN_ROUTE);
        }
    }
};
