import { insertingMerchantUser } from './users.seed';

export const insertingMerchant = {
    id: 1,
    business_type: 'HOTEL',
    business_name: 'Hotel Bright',
    abn: '12345678910',
    is_verified: true,
    msf: 5,
    surcharge: 5,
    contact_no: '+61444444444',
    user_id: insertingMerchantUser.id
};
