import {
    EMAIL_MAX_LENGTH,
    MIN_LENGTH,
    NAME_MAX_LENGTH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    INVALID_PASSWORD,
    LENGTH_REQUIRED,
    ONLY_ALPHA_NUMERIC,
    REQUIRED,
    VERIFY_CODE_LENGTH,
    VALID_LENGTH,
    INVALID_PHONE,
    BEARER_AUTH,
    INVALID
} from '../../configs/messages';

export default {
    getUser: {
        authentication: BEARER_AUTH
    },
    addUser: {
        validation: {
            'email': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Email')
                },
                isEmail: {
                    errorMessage: INVALID('Email')
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
    addCustomer: {
        authentication: BEARER_AUTH,
        validation: {
            'firstName': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('FirstName')
                },
                isLength: {
                    options: [{ min: MIN_LENGTH, max: NAME_MAX_LENGTH }],
                    errorMessage: LENGTH_REQUIRED('FirstName', { max: NAME_MAX_LENGTH })
                }
            },
            'lastName': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('LastName')
                },
                isLength: {
                    options: [{ min: MIN_LENGTH, max: NAME_MAX_LENGTH }],
                    errorMessage: LENGTH_REQUIRED('LastName', { max: NAME_MAX_LENGTH })
                }
            },
            'dob': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('DOB')
                }
            },
            'userId': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('UserId')
                }
            }
        }
    },
    phoneValidation: {
        authentication: BEARER_AUTH,
        validation: {
            'mobileNumber': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Mobile number')
                },
                isValidPhone: {
                    errorMessage: INVALID_PHONE
                }
            }
        }
    },
    equifaxCheck: {
        authentication: BEARER_AUTH
    },
    sendReferral: {
        authentication: BEARER_AUTH,
        validation: {
            'email': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Email')
                },
                isEmail: {
                    errorMessage: INVALID('Email')
                },
                isLength: {
                    options: [{ min: MIN_LENGTH, max: EMAIL_MAX_LENGTH }],
                    errorMessage: LENGTH_REQUIRED('Email', { max: EMAIL_MAX_LENGTH })
                }
            }
        }
    },
    smsVerification: {
        authentication: BEARER_AUTH,
        validation: {
            'code': {
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
    IDVerification: {
        authentication: BEARER_AUTH,
        validation: {
            'verificationToken': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Verification token')
                }
            }
        }
    }
};
