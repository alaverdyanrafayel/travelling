import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './SubscriptionReducer';
import * as Actions from './SubscriptionActions';
import * as Api from 'api/SubscriptionApi';

export function* attemptGetSubscriptions() {
    try {
        const response = yield call(Api.attemptGetSubscriptions);
        yield put(Actions.attemptGetSubscriptionsSucceed(response.data));
    } catch (error) {
        yield put(Actions.attemptGetSubscriptionsFailed(JSON.parse(error)));
    }
}

function* SubscriptionSaga() {
    yield takeLatest(actions.ATTEMPT_GET_SUBSCRIPTIONS, attemptGetSubscriptions);
}

export default SubscriptionSaga;
