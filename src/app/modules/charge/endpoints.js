import { ChargeController } from './charge.controller';
import middlewares from '../../middlewares';
import schemas from './schemas';

export default (router) => {

    const {
        addCharge,
        captureChargeHook
    } = ChargeController;

    router.post('/', ...middlewares(schemas, 'addCharge'), addCharge);

    router.post('/capture', ...middlewares(schemas, 'captureChargeHook'), captureChargeHook);
};
