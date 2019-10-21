import { call, put } from 'redux-saga/effects';
import { onSessionComplete } from '../app/modules/auth-user/AuthUserSaga';
import * as Api from 'api/AuthApi';
import * as Actions from '../app/modules/auth-user/AuthUserActions';
import { expectSaga, matchers } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

const data = {};

describe('onSessionComplete generator function', () => {
    const generator = onSessionComplete({ payload: { data } });

    test('must call Api.onSessionComplete function', () => {
        expect(generator.next().value)
                .toEqual(call(Api.onSessionComplete, data));
    });

    test('must dispatch onSessionCompleteSucceed action', () => {
        expect(generator.next().value).toEqual(put(Actions.onSessionCompleteSucceed()));
    });

    test('generator has yielded all values', () => {
        expect(generator.next().done)
                .toBe(true);
    });

});

describe('onSessionCompleteFailed generator', () => {

    it('Should handle errors', () => {

        const error = { response: { data: { message: 'something went wrong' } } };
        expectSaga(onSessionComplete, Actions.onSessionComplete(error))
                .provide([
                    [matchers.call.fn(Api.onSessionComplete), throwError(error)],
                ])
                .put(Actions.onSessionCompleteFailed(error.response.data.message ))
                .run();
    });

});
