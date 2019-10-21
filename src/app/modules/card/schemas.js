import { BEARER_AUTH, REQUIRED , CUSTOMER_ENUM } from '../../configs/messages';

export default {
    addCard: {
        authentication: BEARER_AUTH,
        role: CUSTOMER_ENUM,
        validation: {
            'tokenId': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Payment token')
                }
            }
        }
    },
    getCards: {
        authentication: BEARER_AUTH,
        role: CUSTOMER_ENUM
    },
    updateCard: {
        authentication: BEARER_AUTH,
        role: CUSTOMER_ENUM,
        validation: {
            'id': {
                in: 'params',
                notEmpty: {
                    errorMessage: REQUIRED('Card ID')
                }
            },
            'tokenId': {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Payment token')
                }
            }
        }
    },
    deleteCard: {
        authentication: BEARER_AUTH,
        role: CUSTOMER_ENUM,
        validation: {
            'id': {
                in: 'params',
                notEmpty: {
                    errorMessage: REQUIRED('Card ID')
                }
            }
        }
    },
    defaultCard: {
        authentication: BEARER_AUTH,
        role: CUSTOMER_ENUM,
        validation: {
            'id': {
                in: 'params',
                notEmpty: {
                    errorMessage: REQUIRED('Card ID')
                }
            }
        }
    }
};
