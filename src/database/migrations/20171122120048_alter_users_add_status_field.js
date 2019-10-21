import {
    ACTIVE,
    BANNED,
    INACTIVE
} from '../../app/configs/messages';

exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('users', (tb) => {
            tb.enum('status',[
                ACTIVE,
                INACTIVE,
                BANNED
            ]).defaultTo(INACTIVE);
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('users', (tb) => {
            tb.dropColumn('status');
        })
    ]);
};
