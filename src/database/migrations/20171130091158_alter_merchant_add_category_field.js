
import {
    GENERAL
} from '../../app/configs/messages';

exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('merchants', (tb) => {
            tb.enum('category',[
                GENERAL
            ]).defaultTo(GENERAL);
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.alterTable('merchants', (tb) => {
            tb.dropColumn('category');
        })
    ]);
};
