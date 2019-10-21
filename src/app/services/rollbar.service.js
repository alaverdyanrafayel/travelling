import moment from 'moment';
import params from '../configs/params';
import Rollbar from 'rollbar';

export class RollbarService {
    static async error(errors, message, body) {
        let rollbar = new Rollbar(params.rollbarAccessToken);
        const log =
        `Date and Time: ${moment().format('YYYY-MM-DD HH:mm:ss')}
         Actual Status: ${errors ? errors.status : 'no status'}
         Developer Message: ${message}
         Error Message: ${errors ? errors.message : ''}
         Body: ${body}`;
        await rollbar.error(log);
    }

    static async info(data) {
        let rollbar = new Rollbar(params.rollbarAccessToken);
        const log =
            `Date and Time: ${moment().format('YYYY-MM-DD HH:mm:ss')}
             Data: ${data}`;
        if(process.env.NODE_ENV === 'production') {
            await rollbar.info(log);
        }
    }
}
