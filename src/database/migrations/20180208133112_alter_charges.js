
exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('charges', (tb) => {
            tb.dropColumn('balance_transaction');
            tb.dropColumn('paid');
            tb.decimal('total_fees');
            tb.date('created_on').notNullable()
                    .alter();
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('charges', (tb) => {
            tb.string('balance_transaction', 30)
                    .unique()
                    .notNullable();
            tb.boolean('paid');
            tb.dropColumn('total_fees');
            tb.string('created_on', 10).alter();
        })
    ]);
};
