import {
    INVOICE_TYPES
} from '../../app/configs/messages';

exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.table('subscriptions', (tb) => {
            tb.unique('subscription_id');
        }),
        knex.schema.alterTable('invoices', (tb) => {
            tb.enum('type', INVOICE_TYPES).notNullable();
            tb.string('period_start', 10);
            tb.string('period_end', 10);
            tb.string('currency', 10);
            tb.decimal('amount');
            tb.boolean('is_last_day_reminder_sent');
            tb.boolean('is_three_days_reminder_sent');
            tb.string('subscription_id', 45)
                    .index()
                    .references('subscription_id')
                    .inTable('subscriptions')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
            tb.string('invoice_id', 40)
                    .unique()
                    .notNullable()
                    .alter();
        }),
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.table('subscriptions', (tb) => {
            tb.dropUnique('subscription_id');
        }),
        knex.schema.alterTable('invoices', (tb) => {
            tb.dropColumn('type');
            tb.dropColumn('period_start');
            tb.dropColumn('period_end');
            tb.dropColumn('subscription_id');
            tb.dropColumn('amount');
            tb.dropColumn('is_last_day_reminder_sent');
            tb.dropColumn('is_three_days_reminder_sent');
            tb.integer('user_id')
                    .unsigned()
                    .index()
                    .references('id')
                    .inTable('users')
                    .onDelete('CASCADE')
                    .onUpdate('CASCADE');
            tb.string('invoice_id', 20).notNullable()
                    .alter();
        })
    ]);
};
