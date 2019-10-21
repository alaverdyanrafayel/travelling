import { Model, ValidationError } from 'objection';
import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import {
    EMAIL_MAX_LENGTH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    IP_MAX_LENGTH,
    UNIQUE
} from '../app/configs/messages';
import { UserService } from '../app/services';

export class User extends Model {
    id;
    email;
    password;
    ip_address;
    status;
    last_signed_on;
    role;

    static tableName = 'users';

    static jsonSchema = {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            id: {
                type: 'integer'
            },
            email: {
                type: 'string',
                uniqueItems: true,
                maxLength: EMAIL_MAX_LENGTH
            },
            password: {
                type: 'string',
                minLength: PASSWORD_MIN_LENGTH,
                maxLength: PASSWORD_MAX_LENGTH
            },
            ip_address: {
                type: 'string',
                uniqueItems: true,
                maxLength: IP_MAX_LENGTH
            },
            role: {
                type: 'string'
            },
            status: {
                type: 'string'
            },
            last_signed_on: {
                type: 'date'
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
        tokens: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/token`,
            join: {
                from: 'users.id',
                to: 'user_tokens.user_id'
            }
        },
        invites: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/customer_invite`,
            join: {
                from: 'users.id',
                to: 'customer_invites.user_id'
            }
        },
        customer: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/customer`,
            join: {
                from: 'users.id',
                to: 'customers.user_id'
            }
        },
        merchant: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/merchant`,
            join: {
                from: 'users.id',
                to: 'merchants.user_id'
            }
        },
        merchant_verification: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/merchant_verification`,
            join: {
                from: 'users.id',
                to: 'merchant_verifications.user_id'
            }
        },
        cards: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/card`,
            join: {
                from: 'users.id',
                to: 'cards.user_id'
            }
        },
        equifax_checks: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/equifax_check`,
            join: {
                from: 'users.id',
                to: 'equifax_checks.user_id'
            }
        }
    };

    constructor() {
        super();
    }

    hashPassword() {
        this.password = hashSync(this.password, genSaltSync(8));
    }

    validatePassword(dbPass) {
        return compareSync(dbPass, this.password);
    }

    $beforeInsert() {
        this.hashPassword();

        return UserService.getUserByEmail(this.email)
                .then((dbUser) => {
                    if (dbUser && dbUser.length > 0) {
                        throw new ValidationError({ email: UNIQUE('Email') });
                    }

                    return dbUser;
                });
    }

    $beforeUpdate(opt) {
        if (this.password) {
            this.hashPassword();
        }

        if (this.email && this.email !== opt.old.email) {
            return UserService.getUserByEmail(this.email)
                    .then(dbUser => {
                        if (dbUser) {
                            throw new ValidationError({ email: UNIQUE('Email') });
                        }

                        return dbUser;
                    });
        }

    }

    getFields() {
        return ['id', 'email', 'role', 'status'];
    }
}
