
exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('bookings', (tb) => {
            tb.string('subscription_id', 30);
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('bookings', (tb) => {
            tb.dropColumn('subscription_id');
        })
    ]);
};
