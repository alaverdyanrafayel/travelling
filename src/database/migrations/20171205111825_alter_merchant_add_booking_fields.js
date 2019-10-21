
exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('merchants', (tb) => {
            tb.decimal('msf').notNullable();
            tb.decimal('surcharge').notNullable();
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('merchants', (tb) => {
            tb.dropColumn('msf');
            tb.dropColumn('surcharge');
        })
    ]);
};
