import { BankstatementsResponse } from '../../models';

export class BankstatementsService {

    constructor () {}

    static async insertAndFetchBankstatementsResponse(response) {
        return await BankstatementsResponse.query().insertAndFetch(response);
    }
}
