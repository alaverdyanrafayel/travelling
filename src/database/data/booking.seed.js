import moment from 'moment';
import { insertingCustomerUser, insertingMerchantUser } from './users.seed';
import { PENDING } from '../../app/configs/messages';

export const pinPlanToken = 'plan_1RSxA0E8r9yES6HRZTvKOg';
export const pinSubscriptionToken = 'sub_z8vpycTkbWU-VWxfQiziOg';

export const insertingBooking = {
    id: 1,
    merchant_ref: 'Mer Ref',
    merchant_name: 'Mer Name',
    base_value: 1100,
    surcharge: 0,
    total_charge: 1100,
    weekly_price: 91.67,
    final_payment_date: moment.utc().add(12, 'week')
            .format('MMM Do YYYY'),
    status: PENDING,
    merchant_id: insertingMerchantUser.id,
    customer_id: insertingCustomerUser.id,
    plan_id: pinPlanToken,
    subscription_id: pinSubscriptionToken,
    customer_email: insertingCustomerUser.email,
    is_bankstatements_passed: true,
    is_equifax_passed: true
};
