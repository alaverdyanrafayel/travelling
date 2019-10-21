import { Model, ValidationError } from 'objection';
import {
    UNIQUE,
    NOT_EXISTS,
    MOBILE_MAX_LENGTH
} from '../app/configs/messages';
import { UserService } from '../app/services';

export class Merchant extends Model {
    id;
    user_id;
    business_type;
    business_name;
    abn;
    contact_no;
    is_verified;

    static tableName = 'merchants';

    static jsonSchema = {
        type: 'object',
        required: ['business_type', 'business_name', 'abn', 'contact_no',  'user_id'],
        properties: {
            id: {
                type: 'integer'
            },
            user_id: {
                type: 'integer'
            },
            business_type: {
                type: 'string'
            },
            business_name: {
                type: 'string'
            },
            abn: {
                type: 'string'
            },
            contact_no: {
                type: 'string',
                maxLength: MOBILE_MAX_LENGTH
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
                from: 'merchants.user_id',
                to: 'users.id'
            }
        },
        merchant_verification: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/merchant_verification`,
            join: {
                from: 'merchants.user_id',
                throw: {
                    from: 'users.id',
                    to: 'users.id',
                },
                to: 'merchant_verifications.user_id'
            }
        },
        bookings: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/booking`,
            join: {
                from: 'merchants.user_id',
                to: 'bookings.merchant_id'
            }
        }
    };

    constructor() {
        super();
    }

    $beforeInsert() {
        if (this.user_id) {
            return UserService.getUserById(this.user_id)
                    .then((dbUser) => {
                        if (dbUser) {
                            throw new ValidationError({ user_id: UNIQUE('User') });
                        }

                        return dbUser;
                    });
        }
    }

    $beforeUpdate() {
        if (this.user_id) {
            return UserService.getUserById(this.user_id)
                    .then(dbUser => {
                        if (!dbUser) {
                            throw new ValidationError({ user_id: NOT_EXISTS('User') });
                        }

                        return dbUser;
                    });
        }
    }

    getFields() {
        return ['id', 'user_id', 'business_type', 'business_name', 'abn', 'contact_no', 'is_verified'];
    }
}
