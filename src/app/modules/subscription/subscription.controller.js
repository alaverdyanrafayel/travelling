import { SUCCESS_CODE } from '../../configs/status-codes';
import {
    USER_NOT_EXIST,
    NOT_EXISTS,
} from '../../configs/messages';
import { Customer } from '../../../models';
import { UserService, SubscriptionService } from '../../services';
import { BadRequest } from '../../errors';

export class SubscriptionController {
    /**
     * This function is used to fetch all the active subscriptions for the customer.
     * The subscriptions should already exist in the payment gateway account and we need to pull them and display them
     * in progress bar manner.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async getSubscriptions(req, res, next) {

        if (!req.user.id) {
            return next(new BadRequest(USER_NOT_EXIST));
        }

        let customer, subscriptions;
        try{
            customer = await UserService.getCustomerByUser(req.user);

            if (!customer || !(customer instanceof Customer)) {
                return next(new BadRequest(NOT_EXISTS('Customer')));
            }

            subscriptions = await SubscriptionService.getSubscriptionsByUserId(req.user.id);

            return res.status(SUCCESS_CODE).json(subscriptions);
        }
        catch(err) {
            next(err);
        }
    }

    /**
     * This function will be handling the webhook event from payment gateway related to subscription creation.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async addSubscription(req, res, next) {

        let event, subscription;
        try{

            if(!event.data.object.id) {
                return next(new BadRequest(NOT_EXISTS('Subscription')));
            }

            let customer = await UserService.getCustomerByPaymentId(event.data.object.customer);

            if(!customer || !(customer instanceof Customer)) {
                return next(new BadRequest(NOT_EXISTS('Customer')));
            }

            subscription = event.data.object;

            // Insert Subscription details.
            await SubscriptionService.insertAndFetchSubscription({
                subscription_id: subscription.id,
                created_on: subscription.created,
                current_period_start: subscription.current_period_start,
                current_period_end: subscription.current_period_end,
                user_id: customer.user_id,
                start: subscription.start,
                ended_at: subscription.ended_at,
                status: subscription.status
            });

            return res.status(SUCCESS_CODE).json({ received: true });
        }
        catch(err) {
            next(err);
        }
    }
}
