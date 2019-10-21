import {
    insertingCustomerUser,
    insertingMerchantUser,
    insertingCustomer,
    insertingUserToken,
    insertingMerchantVerification,
    insertingMerchant,
    insertingCard,
    insertingBooking
} from '../data';

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('users').del()
            .then(function () {
                // Inserts seed entries
                return knex('users').insert([insertingCustomerUser, insertingMerchantUser])
                        .then(() => {
                            return Promise.all([
                                knex('customers').insert([insertingCustomer])
                                        .then(() => {
                                            return knex('cards').insert([insertingCard]);
                                        }),
                                knex('user_tokens').insert([insertingUserToken]),
                                knex('merchant_verifications').insert([insertingMerchantVerification]),
                                knex('merchants').insert([insertingMerchant]),
                                knex('bookings').insert([insertingBooking])
                            ]);
                        });
            });
};
