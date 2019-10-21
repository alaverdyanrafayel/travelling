import { browserHistory } from 'react-router';
import { MERCHANT_DASHBOARD_ROUTE } from '../../configs/constants';

export default (store) => {
    const state = store.getState();
    if (state.getIn(['merchantData', 'loggedInUser'])) {
        browserHistory.push(MERCHANT_DASHBOARD_ROUTE);
    }
};
