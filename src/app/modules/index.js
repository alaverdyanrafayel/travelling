import { AuthModule } from './auth';
import { UserModule } from './user';
import { CardModule } from './card';
import { SubscriptionModule } from './subscription/index';
import { BankStatementsModule } from './bankstatements/index';
import { MerchantModule } from './merchant/index';
import { BookingModule } from './booking/index';

export default (router) => {

    const auth = new AuthModule(router);
    const user = new UserModule(router);
    const card = new CardModule(router);
    const subscription = new SubscriptionModule(router);
    const bankstatements = new BankStatementsModule(router);
    const merchant = new MerchantModule(router);
    const booking = new BookingModule(router);
    const modules = [
        auth,
        user,
        card,
        subscription,
        bankstatements,
        merchant,
        booking
    ];

    modules.forEach((module) => module.createEndpoints());
};
