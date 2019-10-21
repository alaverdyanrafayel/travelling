import { createSelector } from 'reselect';

const userDataSelector = (state) => state.get('userData');

const messagesSelector = createSelector(
    userDataSelector, (userData) => userData.get('messages')
);

const fieldsSelector = createSelector(
    userDataSelector, (userData) => userData.get('fields')
);

const errorsSelector = createSelector(
    userDataSelector, (userData) => userData.get('errors')
);

const loggedInUserSelector = createSelector(
    userDataSelector, (userData) => userData.get('loggedInUser')
);

const resetPasswordConfirm = createSelector(
    userDataSelector, (userData) => userData.get('resetPasswordConfirm')
);

const resetPasswordTokenStatus = createSelector(
    userDataSelector, (userData) => userData.get('resetPasswordTokenStatus')
);

const prevSentEmailSelector = createSelector(
    userDataSelector, (userData) => userData.get('prevSentEmail')
);

export default state => {

    return {
        loggedInUser: loggedInUserSelector(state),
        userMessages: messagesSelector(state),
        userFields: fieldsSelector(state),
        userErrors: errorsSelector(state),
        resetPasswordConfirm: resetPasswordConfirm(state),
        resetPasswordTokenStatus: resetPasswordTokenStatus(state),
        prevSentEmail: prevSentEmailSelector(state)
    };
};
