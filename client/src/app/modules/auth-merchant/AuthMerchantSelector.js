import { createSelector } from 'reselect';

const merchantDataSelector = (state) => state.get('merchantData');

const messagesSelector = createSelector(
    merchantDataSelector, (merchantData) => merchantData.get('messages')
);

const fieldsSelector = createSelector(
    merchantDataSelector, (merchantData) => merchantData.get('fields')
);

const errorsSelector = createSelector(
    merchantDataSelector, (merchantData) => merchantData.get('errors')
);

const loggedInUserSelector = createSelector(
    merchantDataSelector, (merchantData) => merchantData.get('loggedInUser')
);

export default state => {

    return {
        loggedInUser: loggedInUserSelector(state),
        merchantMessages: messagesSelector(state),
        merchantFields: fieldsSelector(state),
        merchantErrors: errorsSelector(state)
    };
};
