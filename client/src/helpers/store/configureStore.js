import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import loadState from './loadState';
import { fromJS } from 'immutable';
import httpInterceptor from '../app/api/httpInterceptor';
import { attemptLogOutUser } from '../../app/modules/auth-user/AuthUserActions';

export default (rootReducer, rootSaga, storeKey) => {

    let store;

    const initialState = fromJS(loadState(storeKey));

    const sagaMiddleware = createSagaMiddleware();

    if (process.env.NODE_ENV !== 'production') {
        const logger = createLogger({
            collapsed: false,
            stateTransformer: state => state.toJS()
        });

        store = createStore(rootReducer, initialState, applyMiddleware(sagaMiddleware, logger));
    } else {
        store = createStore(rootReducer, initialState, applyMiddleware(sagaMiddleware));
    }

    sagaMiddleware.run(rootSaga);

    httpInterceptor.init({
        errorCallback: (msg) => store.dispatch(attemptLogOutUser(msg))
    });

    return store;
};
