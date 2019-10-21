
exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('bankstatements_responses', (tb) => {
            tb.text('json').alter();
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('bankstatements_responses', (tb) => {
            tb.string('json', 500).alter();
        })
    ]);
};
