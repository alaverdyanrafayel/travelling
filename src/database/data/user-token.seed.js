import moment from 'moment';
import { DATE_FORMAT, PASSWORD_RESET_REASON } from '../../app/configs/messages';
import { insertingCustomerUser } from './users.seed';

export const insertingUserToken = {
    id: 1,
    token: 'abcdefghij1234567890',
    expiration: moment.utc().add(3, 'hours')
            .format(DATE_FORMAT),
    user_id: insertingCustomerUser.id,
    reason: PASSWORD_RESET_REASON
};
