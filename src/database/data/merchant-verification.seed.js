import moment from 'moment';
import { insertingMerchantUser } from './users.seed';
import { DATE_FORMAT } from '../../app/configs/messages';

export const insertingMerchantVerification = {
    id: 1,
    verification_code: 'ABCDEF',
    agreement_link: 'http://localhost:3000',
    send_on: moment.utc().format(DATE_FORMAT),
    user_id: insertingMerchantUser.id
};
