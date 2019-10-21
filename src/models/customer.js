import { Model, ValidationError } from 'objection';
import {
    NAME_MAX_LENGTH,
    UNIQUE,
    NOT_EXISTS,
    STREET_TYPE_MAX_LENGTH,
    STATE_MAX_LENGTH,
    POSTCODE_MAX_LENGTH,
    GENDER_MAX_LENGTH,
    HOME_ADDRESS_MAX_LENGTH,
    MOBILE_MAX_LENGTH,
    VERIFICATION_ID_MAX_LENGTH
} from '../app/configs/messages';
import { UserService } from '../app/services/user.service';

export class Customer extends Model {
    id;
    user_id;
    first_name;
    middle_name;
    last_name;
    flat_no;
    street_no;
    street_name;
    street_type;
    suburb;
    state;
    postcode;
    dob;
    gender;
    home_address;
    mobile_no;
    verification_id;
    id_status;
    payment_customer_id;
    is_mobile_verified;
    is_identity_verified;
    created_at;
    updated_at;

    static tableName = 'customers';

    static jsonSchema = {
        type: 'object',
        required: ['first_name', 'last_name', 'dob', 'user_id'],
        properties: {
            id: {
                type: 'integer'
            },
            user_id: {
                type: 'integer'
            },
            first_name: {
                type: 'string',
                maxLength: NAME_MAX_LENGTH
            },
            middle_name: {
                type: 'string',
                maxLength: NAME_MAX_LENGTH
            },
            last_name: {
                type: 'string',
                maxLength: NAME_MAX_LENGTH
            },
            flat_no: {
                type: 'integer'
            },
            street_no: {
                type: 'integer'
            },
            street_name: {
                type: 'text'
            },
            street_type: {
                type: 'string',
                maxLength: STREET_TYPE_MAX_LENGTH
            },
            suburb: {
                type: 'text'
            },
            state: {
                type: 'string',
                maxLength: STATE_MAX_LENGTH
            },
            postcode: {
                type: 'string',
                maxLength: POSTCODE_MAX_LENGTH
            },
            dob: {
                type: 'date'
            },
            gender: {
                type: 'string',
                maxLength: GENDER_MAX_LENGTH
            },
            home_address: {
                type: 'string',
                maxLength: HOME_ADDRESS_MAX_LENGTH
            },
            mobile_no: {
                type: 'string',
                maxLength: MOBILE_MAX_LENGTH
            },
            verification_id: {
                type: 'string',
                maxLength: VERIFICATION_ID_MAX_LENGTH
            },
            id_status: {
                type: 'string',
            },
            payment_customer_id: {
                type: 'string'
            },
            is_mobile_verified: {
                type: 'boolean'
            },
            is_identity_verified: {
                type: 'boolean'
            },
            created_at: {
                type: 'date'
            },
            updated_at: {
                type: 'date'
            }
        }
    };

    static relationMappings = {
        user: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/user`,
            join: {
                from: 'customers.user_id',
                to: 'users.id'
            }
        },
        mobile: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/mobile`,
            join: {
                from: 'customers.user_id',
                to: 'mobile_verifications.user_id'
            }
        },
        bookings: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/booking`,
            join: {
                from: 'customers.user_id',
                to: 'bookings.customer_id'
            }
        }
    };

    constructor() {
        super();
    }

    $beforeInsert() {
        if (this.user_id) {
            return UserService.getCustomerById(this.user_id)
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
        return ['id', 'user_id', 'first_name', 'middle_name', 'last_name', 'flat_no', 'street_no', 'street_name','street_type','suburb', 'state', 'postcode', 'dob', 'gender', 'home_address', 'mobile_no', 'is_mobile_verified', 'is_identity_verified', 'id_status', 'payment_customer_id', 'created_at', 'updated_at' ];
    }
}
