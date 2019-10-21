import { fromJS, Map, List } from 'immutable';
import { SUCCESSFULLY_CREATED_CARD } from 'configs/constants';

export const actions = {
    ATTEMPT_CARD_VALIDATION_FAILED: 'ATTEMPT_CARD_VALIDATION_FAILED',
    ATTEMPT_CARD_VALIDATION_SUCCEED: 'ATTEMPT_CARD_VALIDATION_SUCCEED',
    ATTEMPT_ADD_PAYMENT: 'ATTEMPT_ADD_PAYMENT',
    ATTEMPT_ADD_PAYMENT_SUCCEED: 'ATTEMPT_ADD_PAYMENT_SUCCEED',
    ATTEMPT_ADD_PAYMENT_FAILED: 'ATTEMPT_ADD_PAYMENT_FAILED',
    ATTEMPT_DELETE_PAYMENT: 'ATTEMPT_DELETE_PAYMENT',
    ATTEMPT_DELETE_PAYMENT_SUCCEED: 'ATTEMPT_DELETE_PAYMENT_SUCCEED',
    ATTEMPT_DELETE_PAYMENT_FAILED: 'ATTEMPT_DELETE_PAYMENT_FAILED',
    ATTEMPT_DEFAULT_PAYMENT: 'ATTEMPT_DEFAULT_PAYMENT',
    ATTEMPT_DEFAULT_PAYMENT_SUCCEED: 'ATTEMPT_DEFAULT_PAYMENT_SUCCEED',
    ATTEMPT_DEFAULT_PAYMENT_FAILED: 'ATTEMPT_DEFAULT_PAYMENT_FAILED',
    ATTEMPT_GET_PAYMENT: 'ATTEMPT_GET_PAYMENT',
    ATTEMPT_GET_PAYMENT_SUCCEED: 'ATTEMPT_GET_PAYMENT_SUCCEED',
    ATTEMPT_GET_PAYMENT_FAILED: 'ATTEMPT_GET_PAYMENT_FAILED',
    ATTEMPT_UPDATE_PAYMENT: 'ATTEMPT_UPDATE_PAYMENT',
    ATTEMPT_UPDATE_PAYMENT_SUCCEED: 'ATTEMPT_UPDATE_PAYMENT_SUCCEED',
    ATTEMPT_UPDATE_PAYMENT_FAILED: 'ATTEMPT_UPDATE_PAYMENT_FAILED',
    ATTEMPT_CHARGES: 'ATTEMPT_CHARGES',
    ATTEMPT_CHARGES_SUCCEED: 'ATTEMPT_CHARGES_SUCCEED',
    ATTEMPT_CHARGES_FAILED: 'ATTEMPT_CHARGES_FAILED',
    CLEAR: 'CLEAR'
};

const defaultState = fromJS({
    customerId: '',
    cardValidationError: '',
    cards: List(),
    message: {}
});

const sortByPrimaryAttr = (array) => {
    return array.sort((a,b) => {
        return (a.primary === b.primary) ? 0 : a.primary ? - 1 : 1;
    } );
};

export default (state = defaultState, { type, payload }) => {
    switch(type) {
            case actions.CLEAR:
                return state
                        .set('message', '');
            case actions.ATTEMPT_CARD_VALIDATION_FAILED:
                return state
                        .set('cardValidationError', payload.data.cardValidationError);
            case actions.ATTEMPT_CARD_VALIDATION_SUCCEED:
                return state
                        .set('cardValidationError', '');

            case actions.ATTEMPT_ADD_PAYMENT_SUCCEED:
                return state
                        .update('cards', cards => cards.push(Map(payload.data)))
                        .set('message', fromJS({ type: 'success', message: SUCCESSFULLY_CREATED_CARD }))
                        .set('customerId', payload.data.customerId)
                        .set('cardValidationError', '');

            case actions.ATTEMPT_ADD_PAYMENT_FAILED:
                return state
                        .set('cardValidationError', payload.data.message);

            case actions.ATTEMPT_DELETE_PAYMENT_SUCCEED:
                return state
                        .update('cards', cards => cards.filter(item => {
                            return item.get('cardId') !== payload.data;
                        }))
                        .set('cardValidationError', '');

            case actions.ATTEMPT_DELETE_PAYMENT_FAILED:
                return state
                        .set('cardValidationError', payload.data.message);

            case actions.ATTEMPT_DEFAULT_PAYMENT_SUCCEED:
                return state
                        .set('cards', fromJS(sortByPrimaryAttr(payload.data)))
                        .set('cardValidationError', '');

            case actions.ATTEMPT_DEFAULT_PAYMENT_FAILED:
                return state
                        .set('cardValidationError', payload.data.message);

            case actions.ATTEMPT_GET_PAYMENT_SUCCEED:
                return state
                        .set('cards', fromJS(sortByPrimaryAttr(payload.data)))
                        .set('cardValidationError', '');

            case actions.ATTEMPT_GET_PAYMENT_FAILED:
                return state
                        .set('cardValidationError', payload.data.message);

            case actions.ATTEMPT_CHARGES_SUCCEED:
                return state
                        .set('message', fromJS({ type: 'success', message: payload.data.message }));

            case actions.ATTEMPT_CHARGES_FAILED:
                return state
                        .set('message', fromJS({ type: 'danger', message: payload.data.message }));

            case actions.ATTEMPT_UPDATE_PAYMENT_SUCCEED:
                return state
                        .update('cards', cards => {
                            return cards.map(item=>{

                                if(item.get('cardId') === payload.data.cardId) {
                                    return payload.data.updatedCard;
                                } else {
                                    return item;
                                }
                            });
                        })
                        .set('cardValidationError', '');

            default:
                return state;
    }
};
