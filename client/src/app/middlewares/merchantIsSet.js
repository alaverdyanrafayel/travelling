import { browserHistory } from 'react-router';
import { APP_MERCHANT_ROUTE } from '../../configs/constants';

export default (store) => {
    const state = store.getState();
    if (!state.getIn(['merchantData', 'loggedInUser'])) {
        browserHistory.push(APP_MERCHANT_ROUTE);
    }
};
