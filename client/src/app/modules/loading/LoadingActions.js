import { actions } from './LoadingReducer';

export function startLoading() {
    return { type: actions.START_LOADING };
}

export function stopLoading() {
    return { type: actions.STOP_LOADING };
}
