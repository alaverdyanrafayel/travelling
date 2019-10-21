import { mainReducer, mainRouter, mainSaga } from '../../app/services/index';
import configureStore from '../store/configureStore';
import store from 'configs/store';

export default () => {
    let configs = {
        store: {},
        routes: {}
    };

    configs.store = configureStore(mainReducer, mainSaga, store.storeMainParam);
    configs.routes = mainRouter(configs.store);

    return configs;
};
