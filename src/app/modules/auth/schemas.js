import {
    EMAIL_MAX_LENGTH,
    MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    INVALID_PASSWORD,
    LENGTH_REQUIRED,
    REQUIRED,
    INVALID,
    MAIL_TOKEN_LENGTH,
    VALID_LENGTH
} from '../../configs/messages';

export default {
    checkEmail: {
        validation: {
            'email': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Email')
                },
                isLength: {
                    options: [{ min: MIN_LENGTH, max: EMAIL_MAX_LENGTH }],
                    errorMessage: LENGTH_REQUIRED('Email', { max: EMAIL_MAX_LENGTH })
                },
                isEmail: {
                    errorMessage: INVALID('Email')
                }
            }
        }
    },
    signIn: {
        validation: {
            'email': {
                in: 'body',
                isEmail: {
                    errorMessage: INVALID('Email')
                },
                notEmpty: {
                    errorMessage: REQUIRED('Email')
                },
                isLength: {
                    options: [{ min: MIN_LENGTH, max: EMAIL_MAX_LENGTH }],
                    errorMessage: LENGTH_REQUIRED('Email', { max: EMAIL_MAX_LENGTH })
                }
            },
            'password': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Password')
                },
                matches: {
                    options: [/^(?=.*?[a-zA-Z])(?=.*?[0-9])[\w@#$%^?~-]{0,128}$/],
                    errorMessage: INVALID_PASSWORD
                },
                isLength: {
                    options: [{ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH }],
                    errorMessage: LENGTH_REQUIRED('Password', { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
                }
            }
        }
    },
    signOut: {},
    resetPassword: {
        authentication: false,
        validation: {
            'email': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Email')
                },
                isLength: {
                    options: [{ min: MIN_LENGTH, max: EMAIL_MAX_LENGTH }],
                    errorMessage: LENGTH_REQUIRED('Email', { max: EMAIL_MAX_LENGTH })
                },
                isEmail: {
                    errorMessage: INVALID('Email')
                }
            }
        }
    },
    checkMailToken: {
        authentication: false,
        validation: {
            'token': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Token')
                },
                isLength: {
                    options: [{ min: MAIL_TOKEN_LENGTH, max: MAIL_TOKEN_LENGTH }],
                    errorMessage: VALID_LENGTH('Token', MAIL_TOKEN_LENGTH)
                }
            }
        }
    },
    resetPasswordConfirm: {
        authentication: false,
        validation: {
            'token': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Token')
                },
                isLength: {
                    options: [{ min: MAIL_TOKEN_LENGTH, max: MAIL_TOKEN_LENGTH }],
                    errorMessage: VALID_LENGTH('Token', MAIL_TOKEN_LENGTH)
                }
            },
            'password': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Password')
                },
                matches: {
                    options: [/^(?=.*?[a-zA-Z])(?=.*?[0-9])[\w@#$%^?~-]{0,128}$/],
                    errorMessage: INVALID_PASSWORD
                },
                isLength: {
                    options: [{ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH }],
                    errorMessage: LENGTH_REQUIRED('Password', { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
                }
            }
        }
    }
};
