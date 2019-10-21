import { spy, stub } from 'sinon';
import * as ErrorHandlers from '../../app/errors';
import chai from 'chai';
import { Customer } from '../../models';
import { NO_CONTENT_CODE, SUCCESS_CODE } from '../../app/configs/status-codes';
import { UserService, PaymentService, CardService } from '../../app/services';
import { CardController } from '../../app/modules/card/card.controller';

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

    json(data) {
        this.data = data;

        return this;
    }
}

describe('Card Controller', () => {
    let BadRequest,
        ValidationError,
        ServiceUnavailable,
        Conflict,
        req = {},
        res = {},
        next = spy(),
        getCustomerStub,
        setCustomerStub,
        createCustomerStub,
        createCustomerSourceStub,
        getCustomerSourceStub,
        deleteCustomerSourceStub,
        createCardStub,
        getCardStub,
        setCardStub,
        deleteCardStub;

    describe('addCard method', () => {

        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            getCustomerStub = stub(UserService, 'getCustomerByUser');
            setCustomerStub = stub(UserService, 'patchAndFetchCustomer');
            createCustomerStub = stub(PaymentService, 'createCustomer');
            createCustomerSourceStub = stub(PaymentService, 'createCustomerSource');
            createCardStub = stub(CardService, 'insertAndFetchCard');
        });

        beforeEach(() => {
            req = {
                body: { tokenId: 'abcdef123456789' },
                user: {
                    id: 1,
                    email: 'customer@test.com'
                }
            };
            res = new MockResponse(req);
        });

        it('should bring BadRequest error when request is empty', (done) => {
            req = {};
            res = new MockResponse(req);
            CardController.addCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring ServiceUnavailable error', (done) => {
            getCustomerStub.returns(undefined);
            setCustomerStub.returns(undefined);
            createCustomerStub.returns(undefined);
            createCustomerSourceStub.returns(undefined);
            createCardStub.returns(undefined);

            CardController.addCard(req, res, next);
            next.should.have.been.calledWith(new ServiceUnavailable);

            done();
        });

        it('should bring BadRequest error when customer does not exist', (done) => {
            const customer = undefined;

            getCustomerStub.returns(customer);

            CardController.addCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when customer does not have payment customer', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: ''
            });
            const paymentCustomer = undefined;

            getCustomerStub.returns(customer);
            createCustomerStub.returns(paymentCustomer);

            CardController.addCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when trying to update customer details and customer does not have customer', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: ''
            });

            const paymentCustomer = {
                token: 'cus_BxAcDPAY8G5FR3',
                email: req.user.email,
                card: {
                    token: 'card_123456789',
                    scheme: 'master',
                    display_number: 'XXXX-XXXX-XXXX-0000',
                    expiry_month: 8,
                    expiry_year: 2018,
                    address_line1: '42 Sevenoaks St',
                    address_city: 'Lathlain',
                    address_country: 'AU',
                    customer_token: 'cus_BxAcDPAY8G5FR3',
                    primary: true
                }
            };

            const newCustomer = undefined;

            getCustomerStub.returns(customer);
            createCustomerStub.returns(paymentCustomer);
            setCustomerStub.returns(newCustomer);

            CardController.addCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when customer has customer but does not have payment source (card details)', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const paymentSource = undefined;

            getCustomerStub.returns(customer);
            createCustomerSourceStub.returns(paymentSource);

            CardController.addCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when customer does not have customer but does not have payment source (card details)', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: ''
            });

            const paymentCustomer = {
                token: 'cus_BxAcDPAY8G5FR3',
                email: req.user.email,
                cards: []
            };

            const newCustomer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: paymentCustomer.id
            });

            getCustomerStub.returns(customer);
            createCustomerStub.returns(paymentCustomer);
            setCustomerStub.returns(newCustomer);

            CardController.addCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when customer has customer but payment source country isn\'t AU', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };

            getCustomerStub.returns(customer);
            createCustomerSourceStub.returns(paymentSource);

            CardController.addCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when customer does not have customer but payment source country isn\'t AU', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: ''
            });

            const paymentCustomer = {
                token: 'cus_BxAcDPAY8G5FR3',
                email: req.user.email,
                card: {
                    token: 'card_123456789',
                    scheme: 'master',
                    display_number: 'XXXX-XXXX-XXXX-0000',
                    expiry_month: 8,
                    expiry_year: 2018,
                    address_line1: '42 Sevenoaks St',
                    address_city: 'Lathlain',
                    address_country: 'AU',
                    customer_token: 'cus_BxAcDPAY8G5FR3',
                    primary: true
                }
            };

            const newCustomer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: paymentCustomer.id
            });

            getCustomerStub.returns(customer);
            createCustomerStub.returns(paymentCustomer);
            setCustomerStub.returns(newCustomer);

            CardController.addCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when customer has customer but payment source expiration date isn\'t less then 12 weeks', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };

            getCustomerStub.returns(customer);
            createCustomerSourceStub.returns(paymentSource);

            CardController.addCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when customer does not have customer but payment source expiration date isn\'t less then 12 weeks', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: ''
            });

            const paymentCustomer = {
                token: 'cus_BxAcDPAY8G5FR3',
                email: req.user.email,
                card: {
                    token: 'card_123456789',
                    scheme: 'master',
                    display_number: 'XXXX-XXXX-XXXX-0000',
                    expiry_month: 8,
                    expiry_year: 2018,
                    address_line1: '42 Sevenoaks St',
                    address_city: 'Lathlain',
                    address_country: 'AU',
                    customer_token: 'cus_BxAcDPAY8G5FR3',
                    primary: true
                }
            };

            const newCustomer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: paymentCustomer.id
            });

            getCustomerStub.returns(customer);
            createCustomerStub.returns(paymentCustomer);
            setCustomerStub.returns(newCustomer);

            CardController.addCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when customer have customer and paymentData not exist', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };
            const payment = undefined;

            getCustomerStub.returns(customer);
            createCustomerSourceStub.returns(paymentSource);
            createCardStub.returns(payment);

            CardController.addCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when customer have not customer and paymentData not exist', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: ''
            });

            const paymentCustomer = {
                token: 'cus_BxAcDPAY8G5FR3',
                email: req.user.email,
                card: {
                    token: 'card_123456789',
                    scheme: 'master',
                    display_number: 'XXXX-XXXX-XXXX-0000',
                    expiry_month: 8,
                    expiry_year: 2018,
                    address_line1: '42 Sevenoaks St',
                    address_city: 'Lathlain',
                    address_country: 'AU',
                    customer_token: 'cus_BxAcDPAY8G5FR3',
                    primary: true
                }
            };

            const newCustomer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: paymentCustomer.id
            });

            const payment = undefined;

            getCustomerStub.returns(customer);
            createCustomerStub.returns(paymentCustomer);
            setCustomerStub.returns(newCustomer);
            createCardStub.returns(payment);

            CardController.addCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should return success response when customer have customer', () => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };

            const payment = {
                customer_id: customer.payment_customer_id,
                card_id: paymentSource.id,
                user_id: req.user.id,
                is_verified: true
            };

            const returnData = {
                cardId: paymentSource.token,
                scheme: paymentSource.scheme,
                expMonth: paymentSource.expiry_month,
                expYear: paymentSource.expiry_year,
                displayNumber: paymentSource.display_number
            };

            getCustomerStub.returns(customer);
            createCustomerSourceStub.returns(paymentSource);
            createCardStub.returns(payment);

            CardController.addCard(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);
                        expect(res.data).to.have.property('cardId', returnData.cardId);
                        expect(res.data).to.have.property('displayNumber', returnData.displayNumber);

                        return res;
                    })
                    .catch(err => err);
        });

        it('should return success response when customer have not customer', () => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: ''
            });

            const paymentCustomer = {
                token: 'cus_BxAcDPAY8G5FR3',
                email: req.user.email,
                card: {
                    token: 'card_123456789',
                    scheme: 'master',
                    display_number: 'XXXX-XXXX-XXXX-0000',
                    expiry_month: 8,
                    expiry_year: 2018,
                    address_line1: '42 Sevenoaks St',
                    address_city: 'Lathlain',
                    address_country: 'AU',
                    customer_token: 'cus_BxAcDPAY8G5FR3',
                    primary: true
                }
            };

            const newCustomer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: paymentCustomer.id
            });

            const payment = {
                card_id: paymentCustomer.card.token,
                user_id: req.user.id,
                is_verified: true
            };

            const returnData = {
                cardId: paymentCustomer.card.token,
                scheme: paymentCustomer.card.scheme,
                expMonth: paymentCustomer.card.expiry_month,
                expYear: paymentCustomer.card.expiry_year,
                displayNumber: paymentCustomer.card.display_number
            };

            getCustomerStub.returns(customer);
            createCustomerStub.returns(paymentCustomer);
            setCustomerStub.returns(newCustomer);
            createCardStub.returns(payment);

            CardController.addCard(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);
                        expect(res.data).to.have.property('cardId', returnData.cardId);
                        expect(res.data).to.have.property('displayNumber', returnData.displayNumber);

                        return res;
                    })
                    .catch(err => err);
        });

        afterEach(() => {
            req = {};
            res = {};
        });
        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            ServiceUnavailable.restore();
            getCustomerStub.restore();
            setCustomerStub.restore();
            createCustomerStub.restore();
            createCustomerSourceStub.restore();
            createCardStub.restore();
        });
    });

    describe('updateCard method', () => {

        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            Conflict = stub(ErrorHandlers, 'Conflict');
            getCustomerStub = stub(UserService, 'getCustomerByUser');
            createCustomerSourceStub = stub(PaymentService, 'createCustomerSource');
            getCustomerSourceStub = stub(PaymentService, 'getCustomerSource');
            deleteCustomerSourceStub = stub(PaymentService, 'deleteCustomerSource');
            getCardStub = stub(CardService, 'getCardByUser');
            setCardStub = stub(CardService, 'patchAndFetchCard');
        });

        beforeEach(() => {
            req = {
                params: { id: 'card_123456789' },
                body: { tokenId: 'abcdef123456789' },
                user: { id: 1 }
            };
            res = new MockResponse(req);
        });

        it('should bring BadRequest error when request is empty', (done) => {
            req = {};
            res = new MockResponse(req);

            CardController.updateCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring ServiceUnavailable error', (done) => {
            getCustomerStub.returns(undefined);
            createCustomerSourceStub.returns(undefined);
            getCustomerSourceStub.returns(undefined);
            deleteCustomerSourceStub.returns(undefined);
            getCardStub.returns(undefined);

            CardController.updateCard(req, res, next);
            next.should.have.been.calledWith(new ServiceUnavailable);

            done();
        });

        it('should bring BadRequest error when customer does not exist', (done) => {
            const customer = undefined;

            getCustomerStub.returns(customer);

            CardController.updateCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when customer does not have payment customer', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: ''
            });

            getCustomerStub.returns(customer);

            CardController.updateCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when customer does not have payment card', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const paymentSource = undefined;

            getCustomerStub.returns(customer);
            createCustomerSourceStub.returns(paymentSource);

            CardController.updateCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when card country isn\'t AU', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };

            getCustomerStub.returns(customer);
            createCustomerSourceStub.returns(paymentSource);

            CardController.updateCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when card expiration date isn\'t less then 12 weeks', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };

            getCustomerStub.returns(customer);
            createCustomerSourceStub.returns(paymentSource);

            CardController.updateCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when card data in \'cards\' table not exist', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };
            const payment = undefined;

            getCustomerStub.returns(customer);
            createCustomerSourceStub.returns(paymentSource);
            getCardStub.returns(payment);

            CardController.updateCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when card in third party service not exist', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };
            const removableCard = undefined;

            getCustomerStub.returns(customer);
            createCustomerSourceStub.returns(paymentSource);
            getCustomerSourceStub.returns(removableCard);

            CardController.updateCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring Conflict error when card in third party doesn\'t deleted', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };
            const cardRemoved = undefined;

            getCustomerStub.returns(customer);
            createCustomerSourceStub.returns(paymentSource);
            getCustomerSourceStub.returns(paymentSource);
            deleteCustomerSourceStub.returns(cardRemoved);

            CardController.updateCard(req, res, next);
            next.should.have.been.calledWith(new Conflict);

            done();
        });

        it('should bring Conflict error with card doesn\'t exist, when trying to update card data in cards table', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };
            const cardRemoved = {
                deleted: true,
                id: 'card_123456789'
            };
            const card = undefined;

            getCustomerStub.returns(customer);
            createCustomerSourceStub.returns(paymentSource);
            getCustomerSourceStub.returns(paymentSource);
            deleteCustomerSourceStub.returns(cardRemoved);
            setCardStub.returns(card);

            CardController.updateCard(req, res, next);
            next.should.have.been.calledWith(new Conflict);

            done();
        });

        it('should return success response with updated card\'s data', () => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };
            const cardRemoved = {
                deleted: true,
                id: 'card_123456789'
            };
            const card = {
                customer_id: customer.payment_customer_id,
                card_id: paymentSource.token,
                user_id: req.user.id,
                is_verified: true
            };

            const returnData = {
                cardId: paymentSource.token,
                scheme: paymentSource.scheme,
                expMonth: paymentSource.expiry_month,
                expYear: paymentSource.expiry_year,
                displayNumber: paymentSource.display_number,
                primary: paymentSource.primary
            };

            getCustomerStub.returns(customer);
            createCustomerSourceStub.returns(paymentSource);
            getCustomerSourceStub.returns(paymentSource);
            deleteCustomerSourceStub.returns(cardRemoved);
            setCardStub.returns(card);

            CardController.updateCard(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);
                        expect(res.data).to.have.property('cardId', returnData.cardId);
                        expect(res.data).to.have.property('displayNumber', returnData.displayNumber);

                        return res;
                    })
                    .catch(err => err);
        });

        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            ServiceUnavailable.restore();
            Conflict.restore();
            getCustomerStub.restore();
            createCustomerSourceStub.restore();
            getCardStub.restore();
            getCustomerSourceStub.restore();
            deleteCustomerSourceStub.restore();
            setCardStub.restore();
        });
    });

    describe('deleteCard method', () => {

        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            getCustomerStub = stub(UserService, 'getCustomerByUser');
            getCustomerSourceStub = stub(PaymentService, 'getCustomerSource');
            deleteCustomerSourceStub = stub(PaymentService, 'deleteCustomerSource');
            getCardStub = stub(CardService, 'getCardByUser');
            deleteCardStub = stub(CardService, 'deleteCardByUser');
        });

        beforeEach(() => {
            req = {
                params: { id: 'card_123456789' },
                user: { id: 1 }
            };
            res = new MockResponse(req);
        });

        it('should bring ServiceUnavailable error when params id is empty', (done) => {
            req.params.id = null;
            res = new MockResponse(req);

            CardController.deleteCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring ServiceUnavailable error', (done) => {
            getCustomerStub.returns(undefined);
            createCustomerSourceStub.returns(undefined);
            getCustomerSourceStub.returns(undefined);
            deleteCustomerSourceStub.returns(undefined);
            getCardStub.returns(undefined);

            CardController.deleteCard(req, res, next);
            next.should.have.been.calledWith(new ServiceUnavailable);

            done();
        });

        it('should bring BadRequest error when customer does not exist', (done) => {
            const customer = undefined;

            getCustomerStub.returns(customer);

            CardController.deleteCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when customer does not have payment customer', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: ''
            });

            getCustomerStub.returns(customer);

            CardController.deleteCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when card data in \'cards\' table not exist', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });

            const card = undefined;

            getCustomerStub.returns(customer);
            getCardStub.returns(card);

            CardController.deleteCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when card in third party service not exist', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const card = {
                card_id: req.params.id,
                user_id: req.user.id,
                is_verified: true
            };

            const paymentCard = undefined;

            getCustomerStub.returns(customer);
            getCardStub.returns(card);
            getCustomerSourceStub.returns(paymentCard);

            CardController.updateCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when card in third party doesn\'t deleted', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const card = {
                card_id: req.params.id,
                user_id: req.user.id,
                is_verified: true
            };
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };
            const cardRemoved = undefined;

            getCustomerStub.returns(customer);
            getCardStub.returns(card);
            getCustomerSourceStub.returns(paymentSource);
            deleteCustomerSourceStub.returns(cardRemoved);

            CardController.updateCard(req, res, next);
            next.should.have.been.calledWith(new Conflict);

            done();
        });

        it('should bring BadRequest error with card doesn\'t exist, when trying to update card data in cards table', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const card = {
                card_id: req.params.id,
                user_id: req.user.id,
                is_verified: true
            };
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };
            const paymentCardRemoved = {
                deleted: true,
                id: 'card_123456789'
            };

            const cardRemoved = undefined;

            getCustomerStub.returns(customer);
            getCardStub.returns(card);
            getCustomerSourceStub.returns(paymentSource);
            deleteCustomerSourceStub.returns(paymentCardRemoved);
            deleteCardStub.returns(cardRemoved);

            CardController.deleteCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should return No_Content response', () => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_BxAcDPAY8G5FR3'
            });
            const card = {
                card_id: req.params.id,
                user_id: req.user.id,
                is_verified: true
            };
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };
            const paymentCardRemoved = {
                deleted: true,
                id: 'card_123456789'
            };

            const cardRemoved = true;

            getCustomerStub.returns(customer);
            getCardStub.returns(card);
            getCustomerSourceStub.returns(paymentSource);
            deleteCustomerSourceStub.returns(paymentCardRemoved);
            deleteCardStub.returns(cardRemoved);

            CardController.deleteCard(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(NO_CONTENT_CODE);

                        return res;
                    })
                    .catch(err => err);
        });

        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            ServiceUnavailable.restore();
            getCustomerStub.restore();
            getCustomerSourceStub.restore();
            deleteCustomerSourceStub.restore();
            getCardStub.restore();
            deleteCardStub.restore();
        });
    });

    describe('defaultCard method', () => {

        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            getCustomerStub = stub(UserService, 'getCustomerByUser');
            getCustomerSourceStub = stub(PaymentService, 'getCustomerSource');
            deleteCustomerSourceStub = stub(PaymentService, 'deleteCustomerSource');
            getCardStub = stub(CardService, 'getCardByUser');
        });

        beforeEach(() => {
            req = {
                params: { id: 'card_123456789' },
                user: { id: 1 }
            };
            res = new MockResponse(req);
        });

        it('should bring ServiceUnavailable error when params id is empty', (done) => {
            req.params.id = null;
            res = new MockResponse(req);

            CardController.defaultCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring ServiceUnavailable error', (done) => {
            getCustomerStub.returns(undefined);
            createCustomerSourceStub.returns(undefined);
            getCustomerSourceStub.returns(undefined);
            deleteCustomerSourceStub.returns(undefined);
            getCardStub.returns(undefined);

            CardController.defaultCard(req, res, next);
            next.should.have.been.calledWith(new ServiceUnavailable);

            done();
        });

        it('should bring BadRequest error when customer does not exist', (done) => {
            const customer = undefined;

            getCustomerStub.returns(customer);

            CardController.defaultCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when customer does not have payment customer', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: ''
            });

            getCustomerStub.returns(customer);

            CardController.defaultCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when card data in \'cards\' table not exist', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_123456789'
            });

            const card = undefined;

            getCustomerStub.returns(customer);
            getCardStub.returns(card);

            CardController.defaultCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when card in third party service not exist', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_123456789'
            });
            const card = {
                card_id: req.params.id,
                user_id: req.user.id,
                is_verified: true
            };

            const paymentCard = undefined;

            getCustomerStub.returns(customer);
            getCardStub.returns(card);
            getCustomerSourceStub.returns(paymentCard);

            CardController.updateCard(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when card in third party doesn\'t become default', (done) => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_123456789'
            });
            const card = {
                card_id: req.params.id,
                user_id: req.user.id,
                is_verified: true
            };
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };
            const cardRemoved = undefined;

            getCustomerStub.returns(customer);
            getCardStub.returns(card);
            getCustomerSourceStub.returns(paymentSource);
            deleteCustomerSourceStub.returns(cardRemoved);

            CardController.defaultCard(req, res, next);
            next.should.have.been.calledWith(new Conflict);

            done();
        });

        it('should return No_Content response', () => {
            const customer =  Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                payment_customer_id: 'cus_123456789'
            });
            const card = {
                card_id: req.params.id,
                user_id: req.user.id,
                is_verified: true
            };
            const paymentSource = {
                token: 'card_123456789',
                scheme: 'master',
                display_number: 'XXXX-XXXX-XXXX-0000',
                expiry_month: 8,
                expiry_year: 2018,
                address_line1: '42 Sevenoaks St',
                address_city: 'Lathlain',
                address_country: 'AU',
                customer_token: 'cus_BxAcDPAY8G5FR3',
                primary: true
            };
            const paymentCardRemoved = {
                deleted: true,
                id: 'card_123456789'
            };

            const cardRemoved = true;

            getCustomerStub.returns(customer);
            getCardStub.returns(card);
            getCustomerSourceStub.returns(paymentSource);
            deleteCustomerSourceStub.returns(paymentCardRemoved);
            deleteCardStub.returns(cardRemoved);

            CardController.defaultCard(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(NO_CONTENT_CODE);

                        return res;
                    })
                    .catch(err => err);
        });

        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            ServiceUnavailable.restore();
            getCustomerStub.restore();
            getCustomerSourceStub.restore();
            deleteCustomerSourceStub.restore();
            getCardStub.restore();
            deleteCardStub.restore();
        });
    });
});
