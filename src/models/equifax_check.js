import { Model } from 'objection';

export class EquifaxCheck extends Model {
    id;
    user_id;
    payload;

    static tableName = 'equifax_checks';

    static jsonSchema = {
        type: 'object',
        required: ['user_id', 'payload'],
        properties: {
            id: {
                type: 'integer'
            },
            user_id: {
                type: 'integer'
            },
            payload: {
                type: 'text'
            }
        }
    };

    static relationMappings = {
        user: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/user`,
            join: {
                from: 'equifax_checks.user_id',
                to: 'users.id'
            }
        }
    };

    constructor() {
        super();
    }
}
