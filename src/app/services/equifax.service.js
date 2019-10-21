import Equifax from '../helpers/equifax';

export class EquifaxService {

    static async checkScore(user, url) {
        return await Equifax.checkScore(user, url);
    }

}
