
exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTableIfNotExists('subscriptions', (tb) => {
            tb.increments();
            tb.string('subscription_id', 45).notNullable();
            tb.string('created_on', 10).notNullable();
            tb.string('current_period_start', 10).notNullable();
            tb.string('current_period_end', 10).notNullable();
            tb.string('start', 10).notNullable();
            tb.string('ended_at', 10);
            tb.enum('status',['active', 'inactive']);
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
        knex.schema.dropTableIfExists('subscriptions')
    ]);
};
