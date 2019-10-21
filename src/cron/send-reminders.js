import { CronJob } from 'cron';
import { each } from 'lodash';
import moment from 'moment';
import { format } from 'currency-formatter';
import {
    UserService,
    MailService,
    RollbarService
} from '../app/services';
import {
    ACTIVE,
    CRONTIMEZONE,
    MAIL_REMINDER_LEFT_COUNT,
    REMINDERS_CRONTIME,
    SMS_REMINDER_LEFT_COUNT
} from '../app/configs/messages';
import {
    PaymentService,
    SMSService
} from '../app/services';
import Utils from '../app/helpers/utils';

export default new CronJob({
    cronTime: REMINDERS_CRONTIME,
    onTick: async () => {

        try {
            let users = await UserService.getCustomersWithApprovedBookings();
    
            each(users, async(user) => {
                let plan = await PaymentService.getPlan(user.plan_id);
                let subscription = await PaymentService.getSubscription(user.subscription_id);
    
                const leftOneDay = moment.utc().add(SMS_REMINDER_LEFT_COUNT, 'days')
                    .startOf('day'),
                    leftThreeDays = moment.utc().add(MAIL_REMINDER_LEFT_COUNT, 'days')
                        .startOf('day'),
                    subsNextBillingDate = moment.utc(subscription.next_billing_date).startOf('day');
    
                const recipient = {
                    email: user.email,
                    name: `${user.first_name} ${user.last_name}`
                };
    
                let payment = {
                    plan_name: plan.name,
                    amount_due: format(Utils.toAcre(plan.amount), { code: plan.currency })
                };
    
                if (subscription.state === ACTIVE) {
                    if (subsNextBillingDate <= leftThreeDays && subsNextBillingDate > leftOneDay) {
                        await MailService.sendThreeDaysReminderMail(recipient, {
                            ...payment,
                            total_paid_to_date: format(user.base_value, { code: plan.currency }),
                            total_booking_cost: format(Utils.toAcre(plan.amount) * plan.expiration_interval, { code: plan.currency }),
                            next_billing_date: subscription.next_billing_date,
                        });
                    } else if (subsNextBillingDate <= leftOneDay) {
                        await SMSService.sendSMS(user.mobile_no, {
                            ...payment,
                            name: recipient.name
                        });
                    }
                }
            });

        } catch(err) {
            if (process.env.NODE_ENV === 'production') {
                await RollbarService.error(err, err.message);
            }
        }
    },
    start: false,
    timeZone: CRONTIMEZONE,
    runOnInit: false
});
