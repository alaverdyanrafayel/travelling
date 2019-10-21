exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('profiles', (tb) => {
            tb.increments();
            tb.string('first_name', 32).notNullable();
            tb.string('middle_name', 32);
            tb.string('last_name', 32).notNullable();
            tb.integer('flat_no');
            tb.integer('street_no');
            tb.string('street_name', 255);
            tb.enum('street_type', ['AVE', 'CIR', 'CCT',  'CL', 'CT', 'CRES', 'DR', 'ESP', 'EXP', 'HWY', 'LANE', 'MWY', 'PDE', 'PL', 'RD', 'SQ', 'ST', 'TCE', 'WAY']);
            tb.string('suburb', 255);
            tb.enum('state',['NSW', 'VIC', 'QLD', 'SA', 'WA', 'ACT', 'NT', 'TAS']);
            tb.string('postcode', 4);
            tb.date('dob').notNullable();
            tb.enum('gender', ['M', 'F']);
            tb.string('home_address', 45);
            tb.string('mobile_no', 45);
            tb.string('verification_id', 45);
            tb.string('payment_customer_id', 45);
            tb.boolean('is_mobile_verified');
            tb.boolean('is_identity_verified');
            tb.integer('user_id')
                    .unique()
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
        knex.schema.dropTableIfExists('profiles')
    ]);
};
