import { fromJS, List } from 'immutable';

export const actions = {
    ATTEMPT_GET_SUBSCRIPTIONS: 'ATTEMPT_GET_SUBSCRIPTIONS',
    ATTEMPT_GET_SUBSCRIPTIONS_SUCCEED: 'ATTEMPT_GET_SUBSCRIPTIONS_SUCCEED',
    ATTEMPT_GET_SUBSCRIPTIONS_FAILED: 'ATTEMPT_GET_SUBSCRIPTIONS_FAILED'
};

const defaultState = fromJS({
    subscriptions: List(),
    errors: []
});

export default (state = defaultState, { type, payload }) => {
    switch(type) {
            case actions.ATTEMPT_GET_SUBSCRIPTIONS_SUCCEED:
                return state
                        .set('subscriptions', fromJS(payload.data));

            case actions.ATTEMPT_GET_SUBSCRIPTIONS_FAILED:
                return state
                        .set('errors', payload.data.message);

            default:
                return state;
    }
};
