import {
    BEARER_AUTH, CUSTOMER_ENUM,
    EMAIL_MAX_LENGTH,
    INVALID,
    LENGTH_REQUIRED,
    MERCHANT_ENUM,
    MIN_LENGTH,
    REQUIRED
} from '../../configs/messages';

export default {
    getBooking: {
        authentication: BEARER_AUTH
    },
    getAllBookings: {
        authentication: BEARER_AUTH
    },
    createBooking: {
        authentication: BEARER_AUTH,
        role: MERCHANT_ENUM,
        validation: {
            'merchantName': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Merchant Name')
                }
            },
            'baseValue': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Base Value')
                }
            },
            'surcharge': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Surcharge')
                }
            },
            'totalCharged': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Total Charged')
                }
            },
            'weeklyPrice': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Weekly Price')
                }
            },
            'lastPaymentDate': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Final Payment Date')
                }
            },
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
    confirmBooking: {
        authentication: BEARER_AUTH,
        role: CUSTOMER_ENUM,
        validation: {
            'id': {
                in: 'params',
                notEmpty: {
                    errorMessage: REQUIRED('Booking ID')
                }
            },
            'cardId': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Payment card')
                }
            }
        }
    }
};
