exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('roles', (tb) => {
            tb.increments();
            tb.string('role', 45).notNullable();
            tb.timestamps(true, true);
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('roles')
    ]);
};
