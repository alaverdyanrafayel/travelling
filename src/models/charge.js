import { Model } from 'objection';

export class Charge extends Model {
    id;
    booking_id;
    customer_id;
    card_id;
    amount;
    total_fees;
    amount_refunded;
    created_on;
    token;
    is_captured;
    
    static tableName = 'charges';
    
    static jsonSchema = {
        type: 'object',
        required: ['customer_id', 'card_id', 'token'],
        properties: {
            id: {
                type: 'integer',
                uniqueItems: true
            },
            amount: {
                type: 'decimal'
            },
            amount_refunded: {
                type: 'decimal'
            },
            total_fees: {
                type: 'decimal'
            },
            card_id: {
                type: 'string'
            },
            customer_id: {
                type: 'string'
            },
            booking_id: {
                type: 'integer'
            },
            is_captured: {
                type: 'boolean'
            },
            created_on: {
                type: 'string'
            },
            token: {
                type: 'string',
                uniqueItems: true
            }
        }
    };
    
    static relationMappings = {
        booking: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/booking`,
            join: {
                from: 'charges.booking_id',
                to: 'bookings.id'
            }
        },
        customer: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/customer`,
            join: {
                from: 'charges.customer_id',
                to: 'customers.payment_customer_id'
            }
        },
        card: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/card`,
            join: {
                from: 'charges.card_id',
                to: 'cards.card_id'
            }
        }
    };
    
    constructor() {
        super();
    }
    
    getFields() {
        return ['id', 'total_fees', 'amount', 'customer_id', 'card_id', 'booking_id', 'token'];
    }
}
