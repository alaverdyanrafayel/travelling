import bcrypt from 'bcryptjs';
import {
    ACTIVE,
    CUSTOMER_ENUM,
    MERCHANT_ENUM
} from '../../app/configs/messages';

export const testPass = 'user_pass1';

export const insertingCustomerUser = {
    id: 1,
    ip_address: '255.255.255.255',
    role: CUSTOMER_ENUM,
    status: ACTIVE,
    email: 'customer@test.com',
    password: bcrypt.hashSync(testPass, bcrypt.genSaltSync(8))
};
export const insertingMerchantUser = {
    id: 2,
    ip_address: '255.255.255.255',
    role: MERCHANT_ENUM,
    status: ACTIVE,
    email: 'merchant@test.com',
    password: bcrypt.hashSync(testPass, bcrypt.genSaltSync(8))
};
