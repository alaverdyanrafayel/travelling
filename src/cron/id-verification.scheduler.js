import { CronJob } from 'cron';
import params from '../app/configs/params';
import {
    UserService,
    MailService,
    GreenIDService,
    RollbarService } from '../app/services';
import {
    ACTIVE,
    CRONTIME,
    CRONTIMEZONE,
    FAILED,
    ID_VERIFIED_STATUSES
} from '../app/configs/messages';
const appUrl = params.appUrl;

export default new CronJob({
    cronTime: CRONTIME,
    onTick: async () => {
        try {
            let customers = await UserService.getAllPendingCustomers();
            let count = customers.length;

            if (count > 0) {
                for (let i = 0; i < count; i++) {
                    let customer = customers[i];
                    let user = await UserService.getUserById(customer.user_id);

                    let gIDResult = await GreenIDService.getVerificationResult(customer.verification_id, true);
                    if (gIDResult.error) {
                        await UserService.patchAndFetchCustomer(customer, {
                            id_status: FAILED
                        });
                        await MailService.sendVerificationFailedMail({ email: user.email, name: `${customer.first_name} ${customer.last_name}` }, appUrl);
                    }

                    if (ID_VERIFIED_STATUSES.includes(gIDResult.verificationResult)) {
                        await UserService.patchAndFetchCustomer(customer, {
                            id_status: gIDResult.verificationResult,
                            is_identity_verified: true
                        });

                        await UserService.patchAndFetchUser(user, {
                            status: ACTIVE
                        });

                        await MailService.sendVerificationMail({ email: user.email, name: `${customer.first_name} ${customer.last_name}` }, appUrl);
                    }
                }
            }
        } catch(err) {
            if (process.env.NODE_ENV === 'production') {
                await RollbarService.error(err, err.message);
            }
        }
    },
    start: false,
    timeZone: CRONTIMEZONE,
    runOnInit: true
});
