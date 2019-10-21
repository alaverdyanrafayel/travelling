import { Model } from 'objection';

export class Booking extends Model {
    id;
    merchant_id;
    plan_id;
    customer_email;
    customer_id;
    merchant_ref;
    merchant_name;
    base_value;
    surcharge;
    total_charge;
    weekly_price;
    subscription_id;
    final_payment_date;
    is_bankstatements_passed;
    is_equifax_passed;
    status;

    static tableName = 'bookings';

    static jsonSchema = {
        type: 'object',
        required: [
            'merchant_id',
            'plan_id',
            'customer_email',
            'merchant_ref',
            'merchant_name',
            'base_value',
            'surcharge',
            'total_charge',
            'weekly_price',
            'final_payment_date',
            'status'],
        properties: {
            id: {
                type: 'integer',
                uniqueItems: true
            },
            merchant_id: {
                type: 'integer'
            },
            customer_id: {
                type: 'integer'
            },
            plan_id: {
                type: 'string'
            },
            customer_email: {
                type: 'string'
            },
            merchant_ref: {
                type: 'string'
            },
            merchant_name: {
                type: 'string'
            },
            base_value: {
                type: 'decimal'
            },
            surcharge: {
                type: 'decimal'
            },
            total_charge: {
                type: 'decimal'
            },
            weekly_price: {
                type: 'decimal'
            },
            is_bankstatements_passed: {
                type: 'boolean'
            },
            is_equifax_passed: {
                type: 'boolean'
            },
            final_payment_date: {
                type: 'string'
            },
            status: {
                type: 'string'
            },
            subscription_id: {
                type: 'string'
            }
        }
    };

    static relationMappings = {
        merchant: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/user`,
            join: {
                from: 'bookings.merchant_id',
                to: 'users.id'
            }
        },
        customer: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/user`,
            join: {
                from: 'bookings.customer_id',
                to: 'users.id'
            }
        },
        charges: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/charge`,
            join: {
                from: 'bookings.id',
                to: 'charges.booking_id'
            }
        },
        documents: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/booking_document`,
            join: {
                from: 'bookings.id',
                to: 'booking_documents.booking_id'
            }
        }
    };

    constructor() {
        super();
    }

    getFields() {
        return ['id', 'merchant_id', 'customer_id', 'plan_id', 'subscription_id', 'customer_email', 'merchant_ref', 'merchant_name', 'base_value', 'surcharge', 'total_charge', 'weekly_price','final_payment_date', 'is_bankstatements_passed', 'is_equifax_passed', 'status'];
    }
}
