import * as Actions from '../app/modules/subscription/SubscriptionActions';
import { attemptGetSubscriptions } from '../app/modules/subscription/SubscriptionSaga';
import { expectSaga, matchers } from 'redux-saga-test-plan';
import * as Api from 'api/SubscriptionApi';

describe('attemptGetSubscriptions functionality, ATTEMPT_GET_SUBSCRIPTIONS, ATTEMPT_GET_SUBSCRIPTIONS_SUCCEED, ' +
  'ATTEMPT_GET_SUBSCRIPTIONS_FAILED actions', () => {
    const data = {};

    it('Should successfully run Get Subscriptions generator function', () => {
        expectSaga(attemptGetSubscriptions, Actions.attemptGetSubscriptions(data))
                .provide([
                    [matchers.call.fn(Api.attemptGetSubscriptions), data],
                ])
                .run();
    });

});
