import {
    EMAIL_MAX_LENGTH,
    MIN_LENGTH,
    LENGTH_REQUIRED,
    ONLY_ALPHA_NUMERIC,
    REQUIRED,
    VERIFY_CODE_LENGTH,
    VALID_LENGTH,
    PASSWORD_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    INVALID_PASSWORD,
    INVALID
} from '../../configs/messages';

export default {
    validateMerchant: {
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
            },
            'inviteCode': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Verify code')
                },
                isAlphanumeric: {
                    errorMessage: ONLY_ALPHA_NUMERIC('Verification code')
                },
                isLength: {
                    options: [{ min: VERIFY_CODE_LENGTH, max: VERIFY_CODE_LENGTH }],
                    errorMessage: VALID_LENGTH('Verification code', VERIFY_CODE_LENGTH)
                }
            }
        }
    },
    addMerchant: {
        validation: {
            'userId': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('UserId')
                }
            }
        }
    },
    signIn: {
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
};
