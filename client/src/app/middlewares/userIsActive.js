import { browserHistory } from 'react-router';
import { ACTIVE, CUSTOMER_DASHBOARD_ROUTE } from '../../configs/constants';

export default (store) => {
    const state = store.getState();
    if (state.getIn(['userData', 'loggedInUser']) &&
        state.getIn(['userData', 'loggedInUser', 'status']) === ACTIVE) {
        browserHistory.push(CUSTOMER_DASHBOARD_ROUTE);
    }
};
