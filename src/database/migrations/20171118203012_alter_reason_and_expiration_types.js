import {
    ACTIVATION_REASON,
    PASSWORD_RESET_REASON
} from '../../app/configs/messages';

exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('user_tokens', (tb) => {
            tb.enum('reason', [
                ACTIVATION_REASON,
                PASSWORD_RESET_REASON
            ]).alter();
            tb.dateTime('expiration').notNullable()
                    .alter();
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('user_tokens', (tb) => {
            tb.string('reason').nullable()
                    .alter();
            tb.string('expiration').nullable()
                    .alter();
        })
    ]);
};
