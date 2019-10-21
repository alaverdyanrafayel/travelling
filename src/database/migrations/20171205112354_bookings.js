import { APPROVED, DECLINED, NEW } from '../../app/configs/messages';

exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTableIfNotExists('bookings', (tb) => {
            tb.increments();
            tb.decimal('base_value').notNullable();
            tb.decimal('surcharge').notNullable();
            tb.string('merchant_ref', 45);
            tb.string('merchant_name', 45);
            tb.enum('status', [NEW, APPROVED, DECLINED]).notNullable();
            tb.decimal('total_charge').notNullable();
            tb.decimal('weekly_price').notNullable();
            tb.string('final_payment_date', 45);
            tb.integer('merchant_id')
                    .unsigned()
                    .index()
                    .references('id')
                    .inTable('users')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
            tb.integer('customer_id')
                    .unsigned()
                    .index()
                    .references('id')
                    .inTable('users')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
            tb.string('customer_email', 1000);
            tb.timestamps(true, true);
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTableIfExists('bookings')
    ]);
};
