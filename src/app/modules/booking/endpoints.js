import { BookingController } from './booking.controller';
import middlewares from '../../middlewares';
import schemas from './schemas';

export default (router) => {

    const {
        getBooking,
        createBooking,
        getAllBookings,
        downloadDocs,
        confirmBooking
    } = BookingController;

    router.post('/', ...middlewares(schemas, 'createBooking'), createBooking);

    router.post('/:id', ...middlewares(schemas, 'downloadDocs'), downloadDocs);
    
    router.get('/', ...middlewares(schemas, 'getAllBookings'), getAllBookings);
    
    router.get('/:id', ...middlewares(schemas, 'getBooking'), getBooking);
    
    router.patch('/:id/confirm', ...middlewares(schemas, 'confirmBooking'), confirmBooking);

};
