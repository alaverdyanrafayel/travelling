import { Model } from 'objection';

export class CustomerInvite extends Model {
    id;
    user_id;
    email;

    static tableName = 'customer_invites';

    static jsonSchema = {
        type: 'object',
        required: ['user_id',
            'email'],
        properties: {
            id: {
                type: 'string',
                uniqueItems: true
            },
            user_id: {
                type: 'integer'
            },
            email: {
                type: 'string'
            },
        }
    };

    static relationMappings = {
        user: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/user`,
            join: {
                from: 'customer_invites.user_id',
                to: 'users.id'
            }
        }
    };

    constructor() {
        super();
    }

    getFields() {
        return ['id', 'user_id', 'email'];
    }
}
