exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('customers', (tb) => {
            tb.unique('payment_customer_id');
        }),
        
        knex.schema.createTableIfNotExists('charges', (tb) => {
            tb.string('id', 30)
                    .index()
                    .unique()
                    .notNullable();
            tb.string('balance_transaction', 30)
                    .unique()
                    .notNullable();
            tb.boolean('is_captured');
            tb.boolean('paid');
            tb.string('created_on', 10);
            tb.decimal('amount').notNullable();
            tb.decimal('amount_refunded').notNullable();
            tb.string('card_id')
                    .index()
                    .references('card_id')
                    .inTable('cards')
                    .onDelete('SET NULL')
                    .onUpdate('CASCADE');
            tb.string('customer_id')
                    .index()
                    .references('payment_customer_id')
                    .inTable('customers')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
            tb.integer('booking_id')
                    .unsigned()
                    .index()
                    .references('id')
                    .inTable('bookings')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
            tb.timestamps(true, true);
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('customers', (tb) => {
            tb.dropUnique('payment_customer_id');
        }),
        
        knex.schema.dropTableIfExists('charges')
    ]);
};
