
exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTableIfNotExists('bankstatements_responses', (tb) => {
            tb.increments();
            tb.string('name', 500);
            tb.date('dob').notNullable();
            tb.string('json', 500);
            tb.integer('customer_id')
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
        knex.schema.dropTableIfExists('bankstatements_responses')
    ]);
};
