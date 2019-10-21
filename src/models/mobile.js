import { Model } from 'objection';

export class Mobile extends Model {
    id;
    verification_code;
    send_on;
    user_id;

    static tableName = 'mobile_verifications';

    static jsonSchema = {
        type: 'object',
        required: ['verification_code', 'user_id'],
        properties: {
            id: {
                type: 'integer'
            },
            user_id: {
                type: 'integer'
            },
            verification_code: {
                type: 'string'
            },
            send_on: {
                type: 'date'
            }
        }
    };

    static relationMappings = {
        user: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/user`,
            join: {
                from: 'mobile_verifications.user_id',
                to: 'users.id'
            }
        },
        customer: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/customer`,
            join: {
                from: 'mobile_verifications.user_id',
                to: 'customers.user_id'
            }
        }
    };

    constructor() {
        super();
    }
}
