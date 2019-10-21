import { Model, ValidationError } from 'objection';
import {
    NOT_EXISTS
} from '../app/configs/messages';
import { UserService } from '../app/services';

export class BankstatementsResponse extends Model {
    id;
    name;
    dob;
    json;

    static tableName = 'bankstatements_responses';

    static jsonSchema = {
        type: 'object',
        required: ['name','dob', 'json'],
        properties: {
            id: {
                type: 'string',
                uniqueItems: true
            },
            name: {
                type: 'string'
            },
            dob: {
                type: 'date',
            },
            json: {
                type: 'string',
            }
        }
    };

    static relationMappings = {
        user: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/user`,
            join: {
                from: 'bankstatements_responses.customer_id',
                to: 'users.id'
            }
        }
    };

    constructor() {
        super();
    }

    $beforeInsert() {
        return UserService.getUserById(this.customer_id)
                .then((dbUser) => {
                    if(!dbUser) {
                        throw new ValidationError({ user: NOT_EXISTS('User') });
                    }

                    return dbUser;
                });
    }

    getFields() {
        return ['id', 'name', 'dob', 'json'];
    }
}
