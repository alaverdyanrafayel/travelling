import moment from 'moment';
import { SUCCESS_CODE } from '../../configs/status-codes';
import { BadRequest, NotFound, Conflict } from '../../errors';
import {
    PENDING,
    APPROVED,
    BOOKING_ADDED,
    BOOKING_APPROVED,
    BOOKING_ENUMS,
    CARD_NOT_FOUND,
    CURRENCY,
    CUSTOMER_ENUM,
    DECLINED,
    INVALID_REQUEST_PARAMS,
    NOT_AUTH_BOOKING,
    NOT_EXISTS,
    SUCCESSFULLY_CONFIRMED_BOOKING
} from '../../configs/messages';
import { Customer } from '../../../models/customer';
import AWSHelper from '../../helpers/aws';
import { each } from 'lodash';
import { format } from 'currency-formatter';
import Utils from '../../helpers/utils';
import {
    UserService,
    BookingService,
    MailService,
    MerchantService,
    CardService,
    PaymentService
} from '../../services';

export class BookingController {

    /**
     * This function will be handling the request for creating a new booking.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async downloadDocs(req, res, next) {
        try{
      
            let { id } = req.params;

            let booking = await BookingService.getBookingById(id);

            if(!booking) {
                throw new BadRequest(NOT_EXISTS('Booking'));
            }

            let docs = await BookingService.getDocsForBooking(booking);

            return res.status(SUCCESS_CODE).json({
                message: '',
                data: docs,
                errors: null
            });
        }
        catch(err) {
            next(err);
        }
    }

    /**
     * This function will be handling the request for creating a new booking.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async createBooking(req, res, next) {

        if (!req.body ||
            !req.body.merchantReference ||
            !req.body.merchantName ||
            !req.body.baseValue ||
            !req.body.surcharge ||
            !req.body.uploadedDocs.length === 0 ||
            !req.body.email ||
            !req.body.totalCharged ||
            !req.body.weeklyPrice ||
            !req.body.lastPaymentDate) {
            return next(new BadRequest());
        }

        const appUrl = `${req.get('ORIGIN')}`;
        const {
            merchantReference,
            merchantName,
            baseValue,
            surcharge,
            uploadedDocs,
            email,
            totalCharged,
            weeklyPrice,
            lastPaymentDate } = req.body;
    
        let booking;

        try {
            // Get Customer by email
            let customer = await UserService.getUserByEmail(email);

            let customerId;

            if (customer !== undefined) {
                customerId = customer.id;
            } else {
                await MailService.sendEmailNotFoundMail(email, appUrl);
            }

            let merchantId = req.user.id;

            let merchant = await MerchantService.getMerchantByUser(req.user);
            /**
             * @todo
             * Delete planName and use booking Name
             */
            const planName = Utils.codeGenerate(5);
            
            let plan = {
                name: `Weekly Plan_${planName}`,
                amount:	weeklyPrice,
                currency: 'AUD',
                interval: 7,
                interval_unit: 'day',
                setup_amount: 0,
                trial_amount: 0,
                trial_interval:	0,
                trial_interval_unit: '',
                expiration_interval: 12,
                expiration_interval_unit: 'week'
            };
            let paymentPlan = await PaymentService.createBookingPlan(plan);

            if(!paymentPlan) {
                throw new Conflict(NOT_EXISTS('Payment plan'));
            }

            if(paymentPlan.error) {
                throw new BadRequest(paymentPlan.error, paymentPlan);
            }

            // Insert Booking details.
            booking = await BookingService.insertAndFetchBooking({
                customer_id: customerId,
                merchant_id: merchantId,
                plan_id: paymentPlan.token,
                base_value: baseValue,
                surcharge: surcharge,
                merchant_ref: merchantReference,
                merchant_name: merchantName,
                customer_email: email,
                total_charge: totalCharged,
                weekly_price: weeklyPrice,
                final_payment_date: lastPaymentDate,
                status: PENDING
            });

            // Uploading docs to S3
            each(uploadedDocs, doc => {

                AWSHelper.uploadDoc(doc, async (err , data) => {
                    if(!err) {
                        await BookingService.insertDocument({
                            booking_id: booking.id,
                            name: doc.name,
                            etag: data.ETag,
                            link: 'https://s3.us-east-2.amazonaws.com/holipay-booking-docs/' + doc.name
                        });
                    }
                });
            });
            let bookingMail = {
                businessName: merchant.business_name,
                merchantReference: booking.merchant_ref,
                merchantName: booking.merchant_name,
                baseValue: format(booking.base_value, { code: CURRENCY }),
                surcharge: booking.surcharge,
                totalCharged: format(booking.total_charge, { code: CURRENCY }),
                weeklyPrice: format(booking.weekly_price, { code: CURRENCY }),
                lastPaymentDate: booking.final_payment_date,
                customerEmail: booking.customer_email,
                uploaded: uploadedDocs
            };

            await MailService.sendCreateBookingMail({ email }, appUrl, bookingMail, booking.id);

            return res.status(SUCCESS_CODE).json({
                message: BOOKING_ADDED,
                data: booking,
                errors: null
            });

        }
        catch (err) {
            next(err);
        }
    }

    /**
     * This function will be handling the request for get all bookings.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async getAllBookings(req, res, next) {
        
        const status = req.query['status'];
        
        let profile, bookings = [];
        try {
            if (req.user.role === CUSTOMER_ENUM) {
                profile = await UserService.getCustomerByUser(req.user);
            } else {
                profile = await MerchantService.getMerchantByUser(req.user);
            }

            if(!profile) {
                throw next(new BadRequest(NOT_EXISTS(`${req.user.role === CUSTOMER_ENUM ? 'Customer' : 'Merchant'}`)));
            }
    
            if (Object.keys(req.query).length && status && BOOKING_ENUMS.includes(status)) {
                bookings = await BookingService.getBookingsByStatus(profile, status);
            } else {
                bookings = await BookingService.getBookingsByProfile(profile);
                let last30Days = 0;
                let lastYear = 0;
                each(bookings, async (booking, idx) => {
                    if(moment().diff(moment(booking.created_at), 'days') <= 30) {
                        last30Days += booking.weekly_price;
                    }
                    if(moment().diff(moment(booking.created_at), 'days') <= 365) {
                        lastYear += booking.weekly_price;
                    }

                    let customerUser = await UserService.getCustomerById(booking.customer_id);

                    if(!customerUser) {
                        throw next(new BadRequest(NOT_EXISTS('Customer')));
                    }
    
                    booking.customer = { name: customerUser.first_name + ' ' + customerUser.last_name };
                    if(idx === bookings.length - 1) {
                        return res.status(SUCCESS_CODE).json({
                            message: null,
                            data: { last30Days, lastYear, bookings: bookings.length ? bookings : [] },
                            errors: null
                        });
                    }
                });
            }

            return res.status(SUCCESS_CODE).json({
                message: null,
                data: bookings,
                errors: null
            });

        }
        catch (err) {
            next(err);
        }
    }

    /**
     * This function will be handling the request for get booking by id.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async getBooking(req, res, next) {
    
        if (!req || !req.params.id) {
            return next(new BadRequest(INVALID_REQUEST_PARAMS));
        }
    
        let profile, merchantUser, booking;
        try {
            if (req.user.role === CUSTOMER_ENUM) {
                profile = await UserService.getCustomerByUser(req.user);
            } else {
                profile = await MerchantService.getMerchantByUser(req.user);
            }
            if(!profile) {
                throw next(new BadRequest(NOT_EXISTS(`${req.user.role === CUSTOMER_ENUM ? 'Customer' : 'Merchant'}`)));
            }
        
            booking = await BookingService.getBookingByProfileAndId(profile, req.params.id);
            
            if(!booking) {
                throw next(new NotFound(NOT_EXISTS('Booking')));
            }

            if (req.user.role === CUSTOMER_ENUM) {
                merchantUser = await UserService.getUserById(booking.merchant_id);
                
                if(!merchantUser) {
                    throw next(new BadRequest(NOT_EXISTS('Merchant')));
                }
    
                booking.merchant = { email: merchantUser.email };
            }
            
            return res.status(SUCCESS_CODE).json({
                message: null,
                data: booking,
                errors: null
            });
        }
        catch (err) {
            next(err);
        }
    }
    
    /**
     * Confirm booking
     *
     * @param req
     * @param res
     * @param next
     * @return {Promise.<*>}
     */
    static async confirmBooking(req, res, next) {
        if (!req.body || !req.body.cardId || !req.params['id']) {
            return next(new BadRequest());
        }
    
        const appUrl = `${req.get('ORIGIN')}`;
        const { cardId } = req.body;
        const bookingId = req.params['id'];
    
        let booking, customer, card, paymentSubscription;
        try {
            customer = await UserService.getCustomerByUser(req.user);
        
            if (!customer || !(customer instanceof Customer)) {
                throw new BadRequest(NOT_EXISTS('Customer'));
            }
        
            card = await CardService.getCardByUser(req.user, cardId);
        
            if(!card) {
                throw new BadRequest(CARD_NOT_FOUND);
            }
        
            booking = await BookingService.getBookingById(bookingId);
        
            if(!booking) {
                throw new BadRequest(NOT_EXISTS('Booking'));
            }
        
            if((booking.is_bankstatements_passed === null && booking.is_equifax_passed === null) ||
                (booking.is_bankstatements_passed === null && !booking.is_equifax_passed) ||
                (!booking.is_bankstatements_passed && booking.is_equifax_passed === null)) {
                throw new BadRequest(NOT_AUTH_BOOKING);
            }
        
            if (!booking.is_bankstatements_passed && !booking.is_equifax_passed) {
            
                booking = BookingService.patchAndFetchBooking(booking, {
                    status: DECLINED
                });
            
                throw new BadRequest(NOT_AUTH_BOOKING);
            }
        
            if(booking.status === APPROVED) {
                throw new BadRequest(BOOKING_APPROVED);
            }

            let merUser = await UserService.getUserById(booking.merchant_id);
    
            if(!merUser) {
                throw new Conflict(NOT_EXISTS('Merchant'));
            }
            
            paymentSubscription = await PaymentService.createSubscription(booking.plan_id, customer.payment_customer_id, card.card_id);

            if(!paymentSubscription) {
                throw new Conflict(NOT_EXISTS('Payment subscription'));
            }
        
            if(paymentSubscription && paymentSubscription.error) {
                throw new Conflict(paymentSubscription.error, paymentSubscription);
            }

            booking = await BookingService.patchAndFetchBooking(booking, {
                status: APPROVED,
                subscription_id: paymentSubscription.token
            });
        
            if(!booking) {
                throw new Conflict(NOT_EXISTS('Booking'));
            }

            await MailService.sendMerchantApprovalMail({
                email: merUser.email,
                name: booking.merchant_name
            }, appUrl, {
                weeklyPrice: booking.weekly_price,
                paymentMethod: card.card_id,
                merchantName: booking.merchant_name,
                totalAmount: booking.base_value,
                bookingId: booking.id,
                currentPaymentDate: moment.utc(paymentSubscription.current_period_started_at),
                finalPaymentDate: moment.utc(paymentSubscription.current_period_started_at).add(11, 'week')
            });
            
            return res.status(SUCCESS_CODE).json({
                message: SUCCESSFULLY_CONFIRMED_BOOKING,
                data: booking,
                errors: null
            });
        
        } catch (err) {
            next(err);
        }
    }
}
