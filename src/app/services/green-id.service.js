import { GreenId } from '../helpers/green-id';

export class GreenIDService {

    constructor () {}

    static async getVerificationResult(token, type) {
        return await GreenId.getVerificationResult(token, type);
    }
}
