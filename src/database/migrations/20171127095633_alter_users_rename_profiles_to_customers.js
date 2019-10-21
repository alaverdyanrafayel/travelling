
exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.renameTable('profiles', 'customers')
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.renameTable('customers', 'profiles')
    ]);
};

