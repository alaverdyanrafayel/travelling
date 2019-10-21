
exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTableIfNotExists('merchants', (tb) => {
            tb.increments();
            tb.enum('business_type', ['TRAVEL_AGENT', 'HOTEL', 'AIRLINE', 'CRUISE_LINE', 'TOUR_OPERATOR', 'CAR_RENTAL', 'RAIL_TOUR']).notNullable();
            tb.string('business_name', 1000).notNullable();
            tb.string('ABN', 11).notNullable();
            tb.boolean('is_verified');
            tb.string('contact_no', 45);
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

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTableIfExists('merchants')
    ]);
};
