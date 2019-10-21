exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTableIfNotExists('users', (tb) => {
            tb.increments();
            tb.string('email', 128).unique()
                    .notNullable();
            tb.string('password', 255).notNullable();
            tb.string('ip_address', 16).notNullable();
            tb.dateTime('last_signed_on');
            tb.timestamps(true, true);
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTableIfExists('users')
    ]);
};
