import { spy, stub } from 'sinon';
import * as ErrorHandlers from '../../app/errors';
import chai from 'chai';
import {
    Booking,
    Customer,
    Card,
    Merchant } from '../../models';
import {  SUCCESS_CODE } from '../../app/configs/status-codes';
import {
    MailService,
    BookingService,
    MerchantService,
    PaymentService,
    CardService,
    UserService } from '../../app/services';
import { BookingController } from '../../app/modules/booking/booking.controller';
import { CUSTOMER_ENUM, MERCHANT_ENUM, PENDING } from '../../app/configs/messages';

const sinonChai = require('sinon-chai');
const expect = chai.expect;

chai.should();
chai.use(sinonChai);

class MockResponse {
    statusCode;
    data;
    req;

    constructor(req) {
        this.req = req;
    }

    status(code) {
        this.statusCode = code;

        return this;
    }
    
    cookie(name, value) {
        this.req.cookies[name] = value;
        
        return this;
    }
    
    clearCookie(name) {
        delete this.req.cookies[name];
        
        return this;
    }
    
    json(data) {
        this.data = data;

        return this;
    }
}

const reqObj = {
    authorization: null,
    cookies: {
        refreshToken: null
    },
    origin: 'http://localhost:3000'
};

describe('Booking Controller', () => {
    let BadRequest,
        NotFound,
        Conflict,
        ValidationError,
        ServiceUnavailable,
        req = {},
        res = {},
        next = spy(),
        createBookingStub,
        createPlanStub,
        getBookingStub,
        sendCreateBookingMailStub,
        getMerchantStub,
        getUserByEmailStub,
        getCustomerStub,
        getCardStub,
        createSubscriptionStub,
        sendEmailNotFoundMailStub;

    describe(`'createBooking' method`, () => {

        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            createBookingStub = stub(BookingService, 'insertAndFetchBooking');
            sendCreateBookingMailStub = stub(MailService, 'sendCreateBookingMail');
            sendEmailNotFoundMailStub = stub(MailService, 'sendEmailNotFoundMail');
            getMerchantStub = stub(MerchantService, 'getMerchantByUser');
            createPlanStub = stub(PaymentService, 'createBookingPlan');
            getUserByEmailStub = stub(UserService, 'getUserByEmail');
        });

        beforeEach(() => {
            req = {
                body: {
                    merchantReference: 'Mer Ref',
                    merchantName: 'Mer Name',
                    baseValue: 1000,
                    surcharge: 3,
                    email: 'test@gmail.com',
                    uploadedDocs: [],
                    totalCharged: '1030',
                    weeklyPrice: '82',
                    lastPaymentDate: '15th Feb 2018',
                },user: { id: 1 },
                get: (val) => {
                    return reqObj[val];
                }
            };
            res = new MockResponse(req);
        });

        it('should bring BadRequest error when request is empty', (done) => {
            req = {};
            res = new MockResponse(req);
            BookingController.createBooking(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest ValidationError', done => {
            req = { body: { baseValue: '', surcharge: '', email: '' } };
            res = new MockResponse(req);

            createBookingStub.throws(ValidationError);
            BookingController.createBooking(req, res, next);
            next.should.have.been.calledWith(new ValidationError);

            done();
        });

        it('should return success response with booking', async () => {
            const plan = {
                name: 'Coffee Plan',
                amount: 1000,
                currency: 'USD',
                setup_amount: 0,
                trial_amount: 0,
                interval: 30,
                interval_unit: 'day',
                trial_interval: 7,
                trial_interval_unit: 'day',
                expiration_interval: 12,
                expiration_interval_unit: 'month',
                created_at: '2018-02-09T09:47:56Z',
                token: 'plan_ZyDee4HNeUHFHC4SpM2idg',
                active_subscriptions: 0,
                trial_subscriptions: 0
            };
            const booking = Booking.fromJson({
                merchant_ref: 'Mer Ref',
                merchant_name: 'Mer Name',
                plan_id: plan.token,
                base_value: 1000,
                surcharge: 3,
                customer_email: 'test@gmail.com',
                uploadedDocs: [],
                total_charge: '1030',
                weekly_price: '82',
                final_payment_date: '15th Feb 2018',
                status: PENDING,
                merchant_id: 0
            });

            createPlanStub.returns(plan);
            createBookingStub.returns(booking);

            getUserByEmailStub.returns(undefined);
            sendCreateBookingMailStub.returns(null);
            sendEmailNotFoundMailStub.returns(null);
            getMerchantStub.returns({ businessName: '' });

            await BookingController.createBooking(req, res, next);
            expect(res.statusCode).to.equal(SUCCESS_CODE);
            expect(res.data.data).to.equal(booking);
        });

        afterEach(() => {
            req = {};
            res = {};
        });
        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            ServiceUnavailable.restore();
            sendCreateBookingMailStub.restore();
            sendEmailNotFoundMailStub.restore();
            getUserByEmailStub.restore();
            getMerchantStub.restore();
            createPlanStub.restore();
            createBookingStub.restore();
        });
    });
    
    describe(`'getBooking' method`, () => {
        let getCustomerStub,
            getMerchantUserStub;
        
        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            NotFound = stub(ErrorHandlers, 'NotFound');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            getCustomerStub = stub(UserService, 'getCustomerByUser');
            getMerchantStub = stub(MerchantService, 'getMerchantByUser');
            getBookingStub = stub(BookingService, 'getBookingByProfileAndId');
            getMerchantUserStub = stub(UserService, 'getUserById');
        });
    
        beforeEach(() => {
            req = {
                params: { id: 1 },
                user: {
                    id: 1,
                    role: MERCHANT_ENUM
                }
            };
            res = new MockResponse(req);
        });
    
        it('should bring BadRequest error when request is empty', (done) => {
            req.params = {};
            res = new MockResponse(req);
            BookingController.getBooking(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
        
            done();
        });
    
        it('should bring ServiceUnavailable error', (done) => {
            getCustomerStub.returns(undefined);
            getMerchantStub.returns(undefined);
            getBookingStub.returns(undefined);
            getMerchantUserStub.returns(undefined);
    
            BookingController.getBooking(req, res, next);
            next.should.have.been.calledWith(new ServiceUnavailable);
        
            done();
        });
    
        it('should bring BadRequest error when customer does not exist', (done) => {
            req.user.role = CUSTOMER_ENUM;
            
            const customer = undefined;
        
            getCustomerStub.returns(customer);
    
            BookingController.getBooking(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
        
            done();
        });
    
        it('should bring BadRequest error when merchant does not exist', (done) => {
            const merchant = undefined;
        
            getMerchantStub.returns(merchant);
        
            BookingController.getBooking(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
        
            done();
        });
    
        it('should bring NotFound error when booking does not exist for customer', (done) => {
            req.user.role = CUSTOMER_ENUM;
            
            const customer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+61444444444',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const booking = undefined;
        
            getCustomerStub.returns(customer);
            getBookingStub.returns(booking);
        
            BookingController.getBooking(req, res, next);
            next.should.have.been.calledWith(new NotFound);
        
            done();
        });
    
        it('should bring NotFound error when booking does not exist for merchant', (done) => {
            const merchant = Merchant.fromJson({
                business_type: 'HOTEL',
                business_name: 'Hotel Bright',
                abn: '12345678910',
                is_verified: true,
                msf: 5,
                surcharge: 5,
                contact_no: '+61444444444',
                user_id: req.user.id
            });
            const booking = undefined;
        
            getMerchantStub.returns(merchant);
            getBookingStub.returns(booking);
        
            BookingController.getBooking(req, res, next);
            next.should.have.been.calledWith(new NotFound);
        
            done();
        });
        
        it('should bring BadRequest error when merchant user does not exist for booking', (done) => {
            req.user.role = CUSTOMER_ENUM;
        
            const customer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+61444444444',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const booking = Booking.fromJson({
                id: 1,
                merchant_ref: 'Mer Ref',
                merchant_name: 'Mer Name',
                plan_id: 'plan_ZyDee4HNeUHFHC4SpM2idg',
                base_value: 1000,
                surcharge: 3,
                customer_email: 'test@gmail.com',
                uploadedDocs: [],
                total_charge: 1030,
                weekly_price: 82,
                final_payment_date: '15th Feb 2018',
                status: 'NEW',
                customer_id: customer.user_id,
                merchant_id: 2
            });
        
            const merchantUser = undefined;
            
            getCustomerStub.returns(customer);
            getBookingStub.returns(booking);
            getMerchantUserStub.returns(merchantUser);
        
            BookingController.getBooking(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
        
            done();
        });
        
        it('should return success response with booking for customer', () => {
            req.user.role = CUSTOMER_ENUM;

            const customer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+61444444444',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const booking = Booking.fromJson({
                id: 1,
                merchant_ref: 'Mer Ref',
                merchant_name: 'Mer Name',
                base_value: 1000,
                plan_id: 'plan_ZyDee4HNeUHFHC4SpM2idg',
                surcharge: 3,
                customer_email: 'test@gmail.com',
                uploadedDocs: [],
                total_charge: 1030,
                weekly_price: 82,
                final_payment_date: '15th Feb 2018',
                status: 'NEW',
                customer_id: customer.user_id,
                merchant_id: 2
            });
            const merchantUser = undefined;
            
            getCustomerStub.returns(customer);
            getBookingStub.returns(booking);
            getMerchantUserStub.returns(merchantUser);

            BookingController.getBooking(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);

                        return res;
                    })
                    .catch((err) => err);
        });

        it('should return success response with booking for merchant', () => {
            const merchant = Merchant.fromJson({
                business_type: 'HOTEL',
                business_name: 'Hotel Bright',
                abn: '12345678910',
                is_verified: true,
                msf: 5,
                surcharge: 5,
                contact_no: '+61444444444',
                user_id: req.user.id
            });
            const booking = Booking.fromJson({
                id: 1,
                merchant_ref: 'Mer Ref',
                merchant_name: 'Mer Name',
                base_value: 1000,
                surcharge: 3,
                plan_id: 'plan_ZyDee4HNeUHFHC4SpM2idg',
                customer_email: 'test@gmail.com',
                uploadedDocs: [],
                total_charge: 1030,
                weekly_price: 82,
                final_payment_date: '15th Feb 2018',
                status: 'NEW',
                customer_id: 2,
                merchant_id: merchant.user_id
            });

            getCustomerStub.returns(merchant);
            getBookingStub.returns(booking);

            BookingController.getBooking(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);

                        return res;
                    })
                    .catch((err) => err);
        });
    
        afterEach(() => {
            req = {};
            res = {};
        });
        
        after(() => {
            BadRequest.restore();
            NotFound.restore();
            ValidationError.restore();
            ServiceUnavailable.restore();
            getCustomerStub.restore();
            getMerchantStub.restore();
            getBookingStub.restore();
            getMerchantUserStub.restore();
        });
    });
    
    describe(`'confirmBooking' method`, () => {
        
        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            Conflict = stub(ErrorHandlers, 'Conflict');
            getCustomerStub = stub(UserService, 'getCustomerByUser');
            getCardStub = stub(CardService, 'getCardByUser');
            getBookingStub = stub(BookingService, 'getBookingByProfileAndId');
            createSubscriptionStub = stub(PaymentService, 'createSubscription');
        });
        
        beforeEach(() => {
            req = {
                body: {
                    cardId: 'card_123456789'
                },
                params: {
                    id: 1
                },
                get: (val) => {
                    return reqObj[val];
                },
                user: { id: 1 }
            };
            res = new MockResponse(req);
        });
        
        it('should bring BadRequest error when request is empty', (done) => {
            req = {};
            res = new MockResponse(req);
            BookingController.confirmBooking(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
            
            done();
        });
        
        it('should bring ServiceUnavailable error', (done) => {
            getCustomerStub.returns(undefined);
            getCardStub.returns(undefined);
            getBookingStub.returns(undefined);
            createSubscriptionStub.returns(undefined);
    
            BookingController.confirmBooking(req, res, next);
            next.should.have.been.calledWith(new ServiceUnavailable);
            
            done();
        });
        
        it('should bring BadRequest error when customer does not exist', (done) => {
            const customer = undefined;
            
            getCustomerStub.returns(customer);
    
            BookingController.confirmBooking(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
            
            done();
        });
        
        it('should bring BadRequest error when card does not exist', (done) => {
            const customer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+61444444444',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const card = undefined;
            
            getCustomerStub.returns(customer);
            getCardStub.returns(card);
    
            BookingController.confirmBooking(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
            
            done();
        });
        
        it('should bring BadRequest error when booking does not exist', (done) => {
            const customer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+61444444444',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const card = Card.fromJson({
                card_id: req.body.cardId,
                user_id: req.user.id,
                is_verified: true
            });
            const booking = undefined;
            
            getCustomerStub.returns(customer);
            getCardStub.returns(card);
            getBookingStub.returns(booking);
    
            BookingController.confirmBooking(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
            
            done();
        });
        
        it(`should bring BadRequest error when payment subscribe isn't done`, (done) => {
            const customer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+61444444444',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const card = Card.fromJson({
                card_id: req.body.cardId,
                user_id: req.user.id,
                is_verified: true
            });
            const booking = Booking.fromJson({
                merchant_ref: 'Mer Ref',
                merchant_name: 'Mer Name',
                base_value: 1000,
                surcharge: 3,
                plan_id: 'plan_ZyDee4HNeUHFHC4SpM2idg',
                customer_email: 'test@gmail.com',
                uploadedDocs: [],
                total_charge: '1030',
                weekly_price: '82',
                final_payment_date: '15th Feb 2018',
                status: 'NEW',
                customer_id: customer.user_id,
                merchant_id: 2,
                is_bankstatements_passed: true,
                is_equifax_passed: false
            });
            const paymentSubscription = undefined;
            
            getCustomerStub.returns(customer);
            getCardStub.returns(card);
            getBookingStub.returns(booking);
            createSubscriptionStub.returns(paymentSubscription);
    
            BookingController.confirmBooking(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
            
            done();
        });
        
        it('should return success response with charge', () => {
            const customer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+61444444444',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const card = Card.fromJson({
                card_id: req.body.cardId,
                user_id: req.user.id,
                is_verified: true
            });
            const booking = Booking.fromJson({
                id: req.body.bookingId,
                merchant_ref: 'Mer Ref',
                merchant_name: 'Mer Name',
                plan_id: 'plan_ZyDee4HNeUHFHC4SpM2idg',
                base_value: 1000,
                surcharge: 3,
                customer_email: 'test@gmail.com',
                uploadedDocs: [],
                total_charge: 1030,
                weekly_price: 82,
                final_payment_date: '15th Feb 2018',
                status: 'NEW',
                customer_id: customer.user_id,
                merchant_id: 2,
                is_bankstatements_passed: true,
                is_equifax_passed: false
            });
            const paymentSubscribe = {
                token: 'ch_1Bb5FRK7Q4GRPM5Yc7MGxjpt',
                amount: booking.total_charge,
                amount_refunded: 0,
                captured: false,
                total_fees: 0,
                created_at: '2018-02-10T03:10:49Z',
                currency: 'AUD',
                card: {
                    token: req.body.cardId,
                    customer_token: customer.payment_customer_id
                }
            };
            
            getCustomerStub.returns(customer);
            getCardStub.returns(card);
            getBookingStub.returns(booking);
            createSubscriptionStub.returns(paymentSubscribe);
            
            BookingController.confirmBooking(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);
                        expect(res.data).to.have.property('id', booking.id);
                        expect(res.data).to.have.property('plan_id', booking.plan_id);
                        expect(res.data).to.have.property('customer_id', booking.customer_id);
                        expect(res.data).to.have.property('total_charge', booking.total_charge);
                        expect(res.data).to.have.property('weekly_price', booking.weekly_price);
                        
                        return res;
                    })
                    .catch((err) => err);
        });
        
        afterEach(() => {
            req = {};
            res = {};
        });
        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            ServiceUnavailable.restore();
            Conflict.restore();
            getCustomerStub.restore();
            getCardStub.restore();
            getBookingStub.restore();
            createSubscriptionStub.restore();
        });
    });
});
