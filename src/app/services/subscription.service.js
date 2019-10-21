import { Subscription } from '../../models';

export class SubscriptionService {

    constructor () {}

    static getSubscriptionsByUserId(id) {
        return Subscription.query().where('user_id', id);
    }

    static getSubscriptionById(id) {
        return Subscription.query().where('subscription_id', id)
                .first();
    }
    
    static async insertAndFetchSubscription(subscription) {
        return await Subscription.query().insertAndFetch(subscription);
    }
}
