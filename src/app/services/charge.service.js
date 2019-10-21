import { Charge } from '../../models/charge';

export class ChargeService {
    constructor () {}
    
    static getChargeById(chargeId) {
        return Charge.query().findById(chargeId);
    }

    static async insertAndFetchChargeWithBooking(booking, data) {
        return await booking.$relatedQuery('charge').insertAndFetch(data);
    }
    
    static getChargeByBooking(booking) {
        return booking.$relatedQuery('charges').first();
    }
    
    static async insertAndFetchCharge(booking, data) {
        return await booking.$relatedQuery('charges').insertAndFetch(data);
    }
    
    static async patchAndFetchCharge(charge, data) {
        return await charge.$query().patchAndFetch(data);
    }
}
