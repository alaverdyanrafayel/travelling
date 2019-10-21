
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('cards', (tb) => {
            tb.increments();
            tb.string('card_id')
                    .index()
                    .unique()
                    .notNullable();
            tb.boolean('is_verified');
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
        knex.schema.dropTableIfExists('cards')
    ]);
};
