import { browserHistory } from 'react-router';
import { ACTIVE, SIGN_UP_ROUTE } from '../../configs/constants';

export default (store) => {
    const state = store.getState();
    if (state.getIn(['userData', 'loggedInUser', 'status']) !== ACTIVE ) {
        browserHistory.push(SIGN_UP_ROUTE);
    }
};
