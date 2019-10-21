
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('user_roles'),
        knex.schema.dropTableIfExists('roles')
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('roles', (tb) => {
            tb.increments();
            tb.string('role', 45).notNullable();
            tb.timestamps(true, true);
        }),
        knex.schema.createTableIfNotExists('user_roles', (tb) => {
            tb.increments('id').unsigned()
                    .primary();
            tb.integer('user_id')
                    .unsigned()
                    .index()
                    .references('id')
                    .inTable('users')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
            tb.integer('role_id')
                    .unsigned()
                    .index()
                    .references('id')
                    .inTable('roles')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
            tb.timestamps(true, true);
        })
    ]);
};
