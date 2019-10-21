import { Model } from 'objection';

export class Card extends Model {
    id;
    user_id;
    card_id;
    is_verified;

    static tableName = 'cards';

    static jsonSchema = {
        type: 'object',
        required: ['user_id', 'card_id'],
        properties: {
            id: {
                type: 'integer'
            },
            user_id: {
                type: 'integer'
            },
            card_id: {
                type: 'string'
            },
            is_verified: {
                type: 'boolean'
            }
        }
    };

    static relationMappings = {
        user: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/user`,
            join: {
                from: 'cards.user_id',
                to: 'users.id'
            }
        }
    };

    constructor() {
        super();
    }
}
