
export class MobileService {
    static async patchAndFetchMobile(mobile, data) {
        return await mobile.$query().patchAndFetch(data);
    }

    static async insertAndFetchMobile(customer, data) {
        return await customer.$relatedQuery('mobile').insertAndFetch(data);
    }

    static getMobileByCustomer(customer) {
        return customer.$relatedQuery('mobile');
    }
}
