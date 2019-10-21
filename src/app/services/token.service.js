import { Token } from '../../models';
import { ACTIVATION_REASON } from '../configs/messages';

export class TokenService {

    static getTokenByUserId(id) {
        return Token.query().where('user_id', id)
                .first();
    }

    static deleteToken(id) {
        return Token.query().deleteById(id);
    }

    static getTokenWithUser(token) {
        return Token.query()
                .eager('user')
                .where('token', token)
                .andWhere('reason', ACTIVATION_REASON)
                .first();
    }
    
    static getTokenByUser(user) {
        return user.$relatedQuery('tokens').first();
    }
    
    static getTokenByToken(token) {
        return Token.query().where('token', token)
                .first();
    }
    
    static async insertAndFetchToken(user, token) {
        return await user.$relatedQuery('tokens')
                .insertAndFetch(token);
    }
    
    static async patchAndFetchToken(user, token) {
        return await user.$relatedQuery('tokens')
                .patchAndFetch(token);
    }
}
