
exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTableIfNotExists('customer_invites', (tb) => {
            tb.increments();
            tb.string('email', 1000);
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
        knex.schema.dropTableIfExists('customer_invites')
    ]);
};
