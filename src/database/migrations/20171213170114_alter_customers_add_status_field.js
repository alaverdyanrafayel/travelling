import {
    VERIFICATION_RESULTS
} from '../../app/configs/messages';

exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('customers', (tb) => {
            tb.enum('id_status', VERIFICATION_RESULTS);
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('customers', (tb) => {
            tb.dropColumn('id_status');
        })
    ]);
};
