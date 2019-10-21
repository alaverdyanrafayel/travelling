import { BEARER_AUTH, CUSTOMER_ENUM } from '../../configs/messages';

export default {
    getSubscriptions: {
        authentication: BEARER_AUTH,
        role: CUSTOMER_ENUM
    }
};
