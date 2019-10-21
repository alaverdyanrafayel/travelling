
exports.up = (knex, Promise) => {
    return knex.schema.alterTable('charges', (tb) => {
        tb.renameColumn('id', 'token'); 
    }) .then(() => {
        return Promise.all([
            knex.schema.alterTable('charges', (tb) => {
                tb.increments();
            })
        ]);
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.alterTable('charges', (tb) => {
        tb.dropColumn('id'); }).then(() => {
            return Promise.all([
                knex.schema.alterTable('charges', (tb) => {
                    tb.renameColumn('token', 'id');
                })
            ]);
        });
};
