import { browserHistory } from 'react-router';
import {
    ACTIVE,
    MERCHANT_DASHBOARD_ROUTE,
    MERCHANT_SIGNIN_ROUTE
} from '../../configs/constants';

export default (store) => {
    const state = store.getState();

    if (state.getIn(['merchantData', 'loggedInUser']) && state.getIn(['merchantData', 'loggedInUser', 'status']) === ACTIVE) {
        browserHistory.push(MERCHANT_DASHBOARD_ROUTE);
    } else if(state.getIn(['merchantData', 'loggedInUser'])) {
        browserHistory.push(MERCHANT_SIGNIN_ROUTE);
    }
};
