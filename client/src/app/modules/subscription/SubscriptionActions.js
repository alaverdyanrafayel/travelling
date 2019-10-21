import { actions } from './SubscriptionReducer';

export function attemptGetSubscriptions() {
    return { type: actions.ATTEMPT_GET_SUBSCRIPTIONS };
}

export function attemptGetSubscriptionsSucceed(data) {
    return { type: actions.ATTEMPT_GET_SUBSCRIPTIONS_SUCCEED, payload: { data } };
}

export function attemptGetSubscriptionsFailed() {
    return { type: actions.ATTEMPT_GET_SUBSCRIPTIONS_FAILED };
}
