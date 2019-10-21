import { UserController } from './user.controller';
import middlewares from '../../middlewares';
import schemas from './schemas';

export default (router) => {
    const {
        getUser,
        addUser,
        addCustomer,
        phoneValidation,
        smsVerification,
        IDVerification,
        sendReferral,
        equifaxCheck
    } = UserController;

    router.get('/me', ...middlewares(schemas, 'getUser'), getUser);

    router.post('/user', ...middlewares(schemas, 'addUser'), addUser);

    router.post('/customer', ...middlewares(schemas, 'addCustomer'), addCustomer);

    router.post('/phone-validation', ...middlewares(schemas, 'phoneValidation'), phoneValidation);

    router.post('/sms-verification', ...middlewares(schemas, 'smsVerification'), smsVerification);

    router.post('/token-verification', ...middlewares(schemas, 'IDVerification'), IDVerification);

    router.post('/referral', ...middlewares(schemas, 'sendReferral'), sendReferral);

    router.post('/equifax-check', ...middlewares(schemas, 'equifaxCheck'), equifaxCheck);

};
