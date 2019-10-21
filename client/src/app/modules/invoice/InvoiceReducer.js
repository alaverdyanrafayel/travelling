import { fromJS, List } from 'immutable';

export const actions = {
    ATTEMPT_GET_INVOICES: 'ATTEMPT_GET_INVOICES',
    ATTEMPT_GET_INVOICES_SUCCEED: 'ATTEMPT_GET_INVOICES_SUCCEED',
    ATTEMPT_GET_INVOICES_FAILED: 'ATTEMPT_GET_INVOICES_FAILED'
};

const defaultState = fromJS({
    invoices: List(),
    errors: []
});

export default (state = defaultState, { type, payload }) => {
    switch(type) {
            case actions.ATTEMPT_GET_INVOICES_SUCCEED:
                return state
                        .set('invoices', fromJS(payload.data));

            case actions.ATTEMPT_GET_INVOICES_FAILED:
                return state
                        .set('errors', payload.data.message);

            default:
                return state;
    }
};
