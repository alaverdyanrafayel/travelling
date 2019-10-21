import { browserHistory } from 'react-router';
import {
    ACTIVE,
    ADD_CUSTOMER_ROUTE,
    CUSTOMER_DASHBOARD_ROUTE
} from '../../configs/constants';

export default (store) => {
    const state = store.getState();

    if (state.getIn(['userData', 'loggedInUser'])) {
        if (state.getIn(['userData', 'loggedInUser', 'status']) === ACTIVE) {
            browserHistory.push(CUSTOMER_DASHBOARD_ROUTE);
        } else {
            browserHistory.push(ADD_CUSTOMER_ROUTE);
        }
    }
};
