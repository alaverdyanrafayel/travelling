
exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('bookings', (tb) => {
            tb.boolean('is_equifax_passed');
            tb.boolean('is_bankstatements_passed');
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('bookings', (tb) => {
            tb.dropColumn('is_equifax_passed');
            tb.dropColumn('is_bankstatements_passed');
        })
    ]);
};
