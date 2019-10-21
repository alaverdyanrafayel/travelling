
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('equifax_checks', (tb) => {
            tb.increments();
            tb.text('payload');
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

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('equifax_checks')
    ]);
};
