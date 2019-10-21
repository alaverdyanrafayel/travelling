
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('mobile_verifications', (tb) => {
            tb.increments();
            tb.string('verification_code', 6).notNullable();
            tb.dateTime('send_on').notNullable();
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
        knex.schema.dropTableIfExists('mobile_verifications')
    ]);
};
