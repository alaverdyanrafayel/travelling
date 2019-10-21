
exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('bookings', (tb) => {
            tb.string('plan_id', 45)
                    .index()
                    .unique()
                    .notNullable();
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('bookings', (tb) => {
            tb.dropColumn('plan_id');
        })
    ]);
};
