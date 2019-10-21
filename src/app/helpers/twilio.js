import params from '../configs/params';
import Utils from './utils';
import { RollbarService } from '../services';

const accountSid = params.twilio.accountSid;
const authToken = params.twilio.authToken;

const client = require('twilio')(accountSid, authToken);

export class Twilio {

    constructor () {}

    static sendSMS(to, message) {
        let msg;

        if(typeof message === 'string') {
            msg = message;
        } else if(typeof message === 'object') {
            msg = Utils.smsReminderMessage(message);
        }

        (async () => {
            await RollbarService.info({
                twilio: 'sendSMS',
                to: `${to}`,
                from: `${params.twilio.phoneNumber}`,
                body: `${msg}`
            });
        })();

        return client.messages.create({
            to: `${to}`,
            from: `${params.twilio.phoneNumber}`,
            body: `${msg}`
        }).then((message) => {
            (async () => {
                await RollbarService.info({ message });
            })();
            
            return message;
        })
                .catch(err => {
                    (async () => {
                        await RollbarService.error(err.errors, err.message, null);
                    })();
                    
                    return err;
                });
    }
}

