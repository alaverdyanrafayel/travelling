import { browserHistory } from 'react-router';
import { ADD_CUSTOMER_ROUTE } from '../../configs/constants';

export default (store) => {
    const state = store.getState();

    if (!state.getIn(['userData', 'loggedInUser', 'customer'])) {
        browserHistory.push(ADD_CUSTOMER_ROUTE);
    }
};
