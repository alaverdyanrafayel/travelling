import {
    PENDING,
    APPROVED,
    DECLINED,
    NEW
} from '../../app/configs/messages';

exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('bookings', (tb) => {
            tb.enum('status', [PENDING, APPROVED, DECLINED]).notNullable()
                    .alter();
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('bookings', (tb) => {
            tb.enum('status', [NEW, APPROVED, DECLINED]).notNullable();
        })
    ]);
};
