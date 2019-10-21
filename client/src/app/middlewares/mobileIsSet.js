import { browserHistory } from 'react-router';
import { CUSTOMER_DASHBOARD_ROUTE } from '../../configs/constants';

export default (store) => {
    const state = store.getState();

    if (!state.getIn(['userData', 'loggedInUser', 'customer', 'is_mobile_verified'])) {
        browserHistory.push(CUSTOMER_DASHBOARD_ROUTE);
    }
};
