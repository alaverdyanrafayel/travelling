import { Model, ValidationError } from 'objection';
import {
    UNIQUE,
} from '../app/configs/messages';
import { SubscriptionService } from '../app/services';

export class Subscription extends Model {
    id;
    created_on;
    current_period_start;
    current_period_end;
    customer_id;
    start;
    ended_at;
    status;

    static tableName = 'subscriptions';

    static jsonSchema = {
        type: 'object',
        required: ['subscription_id','created_on', 'current_period_start', 'current_period_end', 'user_id', 'start', 'status'],
        properties: {
            id: {
                type: 'string',
                uniqueItems: true
            },
            subscription_id: {
                type: 'string'
            },
            created_on: {
                type: 'integer',
            },
            current_period_start: {
                type: 'integer',
            },
            current_period_end: {
                type: 'integer'
            },
            user_id: {
                type: 'integer'
            },
            start: {
                type: 'integer'
            },
            ended_at: {
                type: ['integer','null']
            },
            status: {
                type: 'string'
            }
        }
    };

    static relationMappings = {
        customer: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/customer`,
            join: {
                from: 'subscriptions.customer_id',
                to: 'customers.payment_customer_id'
            }
        }
    };

    constructor() {
        super();
    }

    $beforeInsert() {
        return SubscriptionService.getSubscriptionById(this.subscription_id)
                .then((dbSubscription) => {
                    if(dbSubscription && dbSubscription.length > 0) {
                        throw new ValidationError({ subscription: UNIQUE('Subscription') });
                    }

                    return dbSubscription;
                });
    }

    getFields() {
        return ['id', 'subscription_id', 'created_on', 'current_period_start', 'current_period_end', 'user_id', 'start', 'ended_at', 'status'];
    }
}
