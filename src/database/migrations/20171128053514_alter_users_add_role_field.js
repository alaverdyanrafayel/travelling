
import {
    CUSTOMER_ENUM,
    MERCHANT_ENUM,
} from '../../app/configs/messages';

exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('users', (tb) => {
            tb.enum('role',[CUSTOMER_ENUM, MERCHANT_ENUM]).defaultTo(CUSTOMER_ENUM);
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('users', (tb) => {
            tb.dropColumn('role');
        })
    ]);
};
