import { Booking, BookingDocument } from '../../models';

export class BookingService {

    constructor () {}

    static async insertAndFetchBooking(booking) {
        return await Booking.query().insertAndFetch(booking);
    }

    static getBookingById(id) {
        return Booking.query().findById(id);
    }

    static getActiveBookingByCustomer(id) {
        return Booking.query().where('customer_id', id)
                .andWhere('status', 'PENDING')
                .first();
    }

    static async insertDocument(document) {
        return await BookingDocument.query().insert(document);
    }

    static async getDocsForBooking(booking) {
        return await booking.$relatedQuery('documents');
    }
    
    static async getBookingsByProfile(profile) {
        return await profile.$relatedQuery('bookings');
    }
    
    static async getBookingsByStatus(profile, status) {
        return await profile.$relatedQuery('bookings').where('status', status);
    }

    static async getBookingsByEmail(email) {
        return await Booking.query().where('customer_email', email);
    }

    static async patchAndFetchBooking(booking, data) {
        return await booking.$query().patchAndFetch(data);
    }

    static async getBookingByProfileAndId(profile, bookingId) {
        return await profile.$relatedQuery('bookings').where('id', bookingId)
                .first();
    }
   
}
