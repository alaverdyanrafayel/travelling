import { fromJS } from 'immutable';

export const actions = {
    START_LOADING: 'START_LOADING',
    STOP_LOADING: 'STOP_LOADING'
};

const defaultState = fromJS({
    loading: false
});

export default (state = defaultState, { type }) => {
    switch(type) {
            case actions.START_LOADING:
                return state.set('loading', true);
            case actions.STOP_LOADING:
                return state.set('loading', false);
            default:
                return state;
    }
};

