exports.up = function(knex, Promise) {
    return Promise.all([
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

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('user_roles')
    ]);
};
