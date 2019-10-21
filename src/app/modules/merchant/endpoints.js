import { MerchantController } from './merchant.controller';
import middlewares from '../../middlewares';
import schemas from './schemas';

export default (router) => {

    const {
        validateMerchant,
        signIn,
        addMerchant
    } = MerchantController;

    router.post('/', ...middlewares(schemas, 'addMerchant'), addMerchant);

    router.post('/check-merchant', ...middlewares(schemas, 'validateMerchant'), validateMerchant);

    router.post('/sign-in', ...middlewares(schemas, 'signIn'), signIn);
};
