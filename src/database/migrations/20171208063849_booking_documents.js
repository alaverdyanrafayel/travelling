
exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTableIfNotExists('booking_documents', (tb) => {
            tb.increments();
            tb.string('name', 500);
            tb.string('link', 1000);
            tb.string('etag', 500);
            tb.integer('booking_id')
                    .unsigned()
                    .index()
                    .references('id')
                    .inTable('bookings')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
            tb.timestamps(true, true);
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTableIfExists('booking_documents')
    ]);
};
