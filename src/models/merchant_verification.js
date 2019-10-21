import { Model } from 'objection';

export class MerchantVerification extends Model {
    id;
    verification_code;
    send_on;
    user_id;

    static tableName = 'merchant_verifications';

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
                from: 'merchant_verifications.user_id',
                to: 'users.id'
            }
        },
        merchant: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/merchant`,
            join: {
                from: 'merchant_verifications.user_id',
                throw: {
                    from: 'users.id',
                    to: 'users.id',
                },
                to: 'merchants.user_id'
            }
        }
    };

    constructor() {
        super();
    }
}
