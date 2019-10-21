import { asYouType } from 'libphonenumber-js';
import { generate } from 'rand-token';
import moment from 'moment';
import * as jwt from 'jsonwebtoken';
import params from '../configs/params';

export default class Utils {
    static validatePhone(phone) {
        const formatter = new asYouType();
        formatter.input(phone);
        
        return formatter.country === 'AU';
    }

    static codeGenerate(length) {
        return generate(length);
    }
    
    static toCent(value) {
        return value * 100;
    }
    
    static toAcre(value) {
        return value / 100;
    }
    
    static signJWTToken(user) {
        const payload = { id: user.id, created_at: moment().toString() };
    
        // Generate short live access token
        const token = jwt.sign(payload, params.tokenSecret, { expiresIn: 15 * 60 }); // 15 minutes
    
        // Generate refresh token and set in httpOnly cookie
        const refreshToken = jwt.sign({ ...payload }, params.refreshSecret, { expiresIn: 24 * 60 * 60 }); // an hour
        
        return { token, refreshToken };
    }
    
    static smsReminderMessage(reminder) {
        return `Hi ${reminder.name}` +
            `\n\nThis is a friendly reminder that a payment for your booking with ${reminder.plan_name} is due tomorrow.` +
            `\n\nAmount due: ${reminder.amount_due}` +
            `\n\nTo avoid a $30.00 late fee, please make sure you have sufficient funds on your nominated card tomorrow.` +
            `\n\nPlease contact us on our website if there are any issues.` +
            `\n\nKind regards,` +
            `\nThe Holipay team`;
    }

}
