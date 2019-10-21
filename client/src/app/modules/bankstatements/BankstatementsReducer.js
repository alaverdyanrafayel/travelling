import { fromJS } from 'immutable';

export const actions = {
    ATTEMPT_GET_STATUS: 'ATTEMPT_GET_STATUS',
    ATTEMPT_GET_STATUS_SUCCEED: 'ATTEMPT_GET_STATUS_SUCCEED',
    ATTEMPT_GET_STATUS_FAILED: 'ATTEMPT_GET_STATUS_FAILED'
};

const defaultState = fromJS({
    status: '',
    errors: [],
    message: {}
});

export default (state = defaultState, { type, payload }) => {
    switch(type) {
            case actions.ATTEMPT_GET_STATUS_SUCCEED:
                return state
                        .set('status', payload.data.data);
                        
            case actions.ATTEMPT_GET_STATUS_FAILED:
                return state
                        .set('message', fromJS({ type: 'danger', message: payload.data }));
                
            default:
                return state;
    }
};
