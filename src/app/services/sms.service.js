import { Twilio } from '../helpers/twilio';

export class SMSService {

    constructor () {}

    static async sendSMS(phone, message) {
        return await Twilio.sendSMS(phone, message);
    }
}
