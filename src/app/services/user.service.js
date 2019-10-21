import { User, Customer, CustomerInvite } from '../../models';
import {
    APPROVED,
    CUSTOMER_ENUM,
    PENDING,
    SEND_REMINDERS_FIELDS
} from '../configs/messages';

export class UserService {

    constructor () {}

    static async insertAndFetchUser(user) {
        return await User.query().insertAndFetch(user);
    }
    
    static async patchAndFetchUser(user, data) {
        return await user.$query().patchAndFetch(data);
    }

    static async insertAndFetchCustomer(customer) {
        return await Customer.query().insertAndFetch(customer);
    }

    static getUserByEmail(email) {
        return User.query().where('email', email)
                .first();
    }

    static getUserById(id) {
        return User.query().findById(id);
    }

    static getCustomerByPaymentId(id) {
        return Customer.query().where('payment_customer_id', id)
                .first();
    }

    static getCustomerByNameAndDob(firstName, lastName , dob) {
        return Customer.query().where('first_name', firstName)
                .andWhere('last_name', lastName)
                .andWhere('dob', dob)
                .first();
    }

    static getCustomerInvites(user, email) {
        return user.$relatedQuery('invites').where('email', email)
                .first();
    }

    static async insertAndFetchCustomerInvite(user, email) {
        return await CustomerInvite.query().insertAndFetch({ user_id: user.id, email: email });
    }

    static getCustomerById(id) {
        return Customer.query().where('user_id', id)
                .first();
    }

    static getAllPendingCustomers() {
        return Customer.query().where('id_status','=', PENDING);
    }

    static getCustomerByUser(user) {
        return user.$relatedQuery('customer');
    }

    static getMerchantByUser(user) {
        return user.$relatedQuery('merchant');
    }

    static async patchAndFetchCustomer(customer, data) {
        return await customer.$query().patchAndFetch(data);
    }

    static async getCustomersWithApprovedBookings() {
        return await User
                .query()
                .select(SEND_REMINDERS_FIELDS)
                .joinRelation('customer.[bookings]')
                .where('customer:bookings.status', APPROVED)
                .where('role', CUSTOMER_ENUM);
    }
}
