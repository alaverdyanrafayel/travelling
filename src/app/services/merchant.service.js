export class MerchantService {

    constructor () {}

    static getMerchantByUser(user) {
        return user.$relatedQuery('merchant');
    }

    static getMerchantVerificationByUser(user) {
        return user.$relatedQuery('merchant_verification');
    }

    static async patchAndFetchMerchant(user, data) {
        try {
            let merchant = await user.$relatedQuery('merchant');

            if (merchant) {
                merchant = await merchant.$query().patchAndFetch(data);

                return merchant;
            }
        } catch (err) {
            throw err;
        }
    }
}
