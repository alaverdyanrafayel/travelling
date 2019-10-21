import { CardController } from './card.controller';
import middlewares from '../../middlewares';
import schemas from './schemas';

export default (router) => {

    const {
        addCard,
        getCards,
        updateCard,
        defaultCard,
        deleteCard
    } = CardController;

    router.post('/', ...middlewares(schemas, 'addCard'), addCard);

    router.get('/', ...middlewares(schemas, 'getCards'), getCards);

    router.put('/:id', ...middlewares(schemas, 'updateCard'), updateCard);

    router.put('/default/:id', ...middlewares(schemas, 'defaultCard'), defaultCard);

    router.delete('/:id', ...middlewares(schemas, 'deleteCard'), deleteCard);
};
