import { SubscriptionController } from './subscription.controller';
import middlewares from '../../middlewares';
import schemas from './schemas';

export default (router) => {

    const {
        getSubscriptions,
    } = SubscriptionController;

    router.get('/', ...middlewares(schemas, 'getSubscriptions'), getSubscriptions);

};
