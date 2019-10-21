import moment from 'moment';
import {
    BadRequest,
    Conflict
} from '../../errors';
import {
    CARD_NOT_FOUND,
    CURRENCY, DATE_FORMAT,
    NOT_EXISTS,
    SUCCESSFULLY_AUTHORIZED
} from '../../configs/messages';
import { Customer } from '../../../models/customer';
import {
    UserService,
    CardService,
    BookingService,
    PaymentService,
    ChargeService
} from '../../services';
import { SUCCESS_CODE } from '../../configs/status-codes';
import Utils from '../../helpers/utils';

export class ChargeController {

    /**
    * This function is a webhook which will be called by the Pin Payments for charge capture event.
    */
    static async captureChargeHook(req, res, next) {
        let charge = req.body;
        try {
            let customer = await UserService.getCustomerByPaymentId(charge.data.card.customer_token);

            if (!customer || !(customer instanceof Customer)) {
                throw new BadRequest(NOT_EXISTS('Customer'));
            }

            let booking = await BookingService.getActiveBookingByCustomer(customer.user_id);

            await ChargeService.insertAndFetchCharge({ is_captured: true,
                amount: Utils.toAcre(charge.data.amount),
                amount_refunded: charge.data.amount_refunded,
                card_id: charge.data.card.token,
                booking_id: booking.id,
                customer_id: charge.data.card.customer_token,
                created_on: charge.data.created_at,
                token: charge.data.token });
        
            return res.status(SUCCESS_CODE).json({});
        } catch (err) {
            next(err);
        }
    }

    /**
     * Create charge for customer in third party payment service
     * and add it to our base.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async addCharge(req, res, next) {
        if (!req.body || !req.body.cardId || !req.body.bookingId) {
            return next(new BadRequest());
        }

        const { cardId, bookingId } = req.body;

        let booking, customer, card, charge;
        try {
            customer = await UserService.getCustomerByUser(req.user);

            if (!customer || !(customer instanceof Customer)) {
                throw new BadRequest(NOT_EXISTS('Customer'));
            }

            card = await CardService.getCardByUser(req.user, cardId);

            if(!card) {
                throw new BadRequest(CARD_NOT_FOUND);
            }

            booking = await BookingService.getBookingByProfileAndId(customer, bookingId);

            if(!booking) {
                throw new BadRequest(NOT_EXISTS('Booking'));
            }
            let chargeValue = {
                email: req.user.email,
                description: '500g of single origin beans',
                amount: booking.total_charge,
                ip_address: req.user.ip_address,
                currency: CURRENCY,
                capture: false
            };
            
            charge = await PaymentService.createCharge(chargeValue, card.card_id);

            if(!charge) {
                throw new BadRequest(NOT_EXISTS('Charge'));
            }

            if(charge.error) {
                throw new BadRequest(charge.error, charge);
            }
            
            charge = await ChargeService.insertAndFetchChargeWithBooking(booking, {
                token: charge.token,
                amount: charge.amount,
                booking_id: booking.id,
                amount_refunded: charge.amount_refunded,
                customer_id: customer.payment_customer_id,
                card_id: charge.card.token,
                is_captured: charge.captured,
                created_on: moment.utc(charge.created_at).format(DATE_FORMAT),
                total_fees: charge.total_fees
            });

            if(!charge) {
                throw new Conflict(NOT_EXISTS('Charge'));
            }

            return res.status(SUCCESS_CODE).json({
                message: SUCCESSFULLY_AUTHORIZED,
                data: charge,
                errors: null
            });

        } catch (err) {
            next(err);
        }
    }
}
