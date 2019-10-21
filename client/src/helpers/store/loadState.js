import converter, { types } from '../form/typeConverter';
import store from 'configs/store';

export default (storeKey) => {
    const storeEncrypted = localStorage.getItem(storeKey);
    if (!storeEncrypted) {
        return;
    }

    return converter(storeEncrypted, [types.DECRYPT, types.JSON_DECODE], { secret: store.cryptoSecret });
};
