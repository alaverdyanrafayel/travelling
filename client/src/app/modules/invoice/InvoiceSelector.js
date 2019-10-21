import { createSelector } from 'reselect';

const invoicesSelector = (state) => state.get('invoices');

const errorsSelector = createSelector(
    invoicesSelector, (invoices) => invoices.get('errors')
);

export default (state) => {
    return {
        errors: errorsSelector(state)
    };
};
