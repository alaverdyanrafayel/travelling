exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTableIfNotExists('invoices', (tb) => {
            tb.increments();
            tb.string('invoice_id', 20).notNullable();
            tb.decimal('amount_due').notNullable();
            tb.decimal('application_fee');
            tb.integer('attempt_count').notNullable();
            tb.boolean('is_attempted').notNullable();
            tb.boolean('is_closed').notNullable();
            tb.string('date', 10).notNullable();
            tb.integer('user_id')
                    .unsigned()
                    .index()
                    .references('id')
                    .inTable('users')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
            tb.timestamps(true, true);
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTableIfExists('invoices')
    ]);
};
