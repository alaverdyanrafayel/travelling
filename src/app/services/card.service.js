
export class CardService {
    constructor () {}
    
    static async insertAndFetchCard(user, data) {
        return await user.$relatedQuery('cards').insertAndFetch(data);
    }
  
    static async patchAndFetchCard(card, data) {
        return await card.$query().patchAndFetch(data);
    }
  
    static getCardByUser(user, cardId) {
        return user.$relatedQuery('cards').where('card_id', cardId)
                .first();
    }
    static getCardsByUser(user) {
        return user.$relatedQuery('cards');
    }

    static async deleteCardByUser(user, cardId) {
        return await user.$relatedQuery('cards').delete()
                .where('card_id', cardId);
    }
    
}
