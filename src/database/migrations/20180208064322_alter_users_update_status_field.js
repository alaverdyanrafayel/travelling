import {
    ACTIVE,
    BANNED,
    INACTIVE,
    DELETED
} from '../../app/configs/messages';

exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('users', (tb) => {
            tb.enum('status',[
                ACTIVE,
                INACTIVE,
                BANNED,
                DELETED
            ]).defaultTo(INACTIVE)
                    .alter();
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('users', (tb) => {
            tb.enum('status',[
                ACTIVE,
                INACTIVE,
                BANNED
            ]).defaultTo(INACTIVE)
                    .alter();
        })
    ]);
};
