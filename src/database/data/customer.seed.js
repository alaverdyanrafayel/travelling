import { insertingCustomerUser } from './users.seed';
import { Customer } from '../../models/customer';

// Copied from pin payment test dashboard
export const pinCustomerToken = 'cus_TLw-xtvu1tTAiD-pLNLszA';

const customer = new Customer();
customer.id = 1;
customer.first_name = 'customer_first_name';
customer.last_name = 'customer_last_name';
customer.dob = '2000-01-01';
customer.mobile_no = '+61444444444';
customer.is_mobile_verified = true;
customer.is_identity_verified = false;
customer.payment_customer_id = pinCustomerToken;
customer.user_id = insertingCustomerUser.id;

export const insertingCustomer = customer;
