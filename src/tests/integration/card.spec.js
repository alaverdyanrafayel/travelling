import { stub } from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import moment from 'moment';
import * as jwt from 'jsonwebtoken';
import params from '../../app/configs/params';
import App from '../../app/app.js';
import {
    SUCCESS_CODE,
    BAD_REQUEST_CODE,
    UNAUTHORIZED_CODE,
    VALIDATION_ERROR_CODE
} from '../../app/configs/status-codes';
import {
    CARD_NOT_FOUND,
    NOT_EXISTS,
    VALIDATION_ERROR,
    REQUIRED,
    INVALID_CARD_COUNTRY,
    INVALID_CARD_EXPIRE_DATE,
    PAYMENT_CUSTOMER_NOT_FOUND,
    MAX_CARDS_LIMIT
} from '../../app/configs/messages';
import {
    insertingCustomerUser,
    insertingCustomer,
    insertingCard,
    pinCustomerToken
} from '../../database/data';
import { PaymentService, UserService, CardService } from '../../app/services';

const app = App();
const expect = chai.expect;

chai.should();
chai.use(chaiHttp);

describe('Card Module', () => {
    const id = insertingCustomerUser.id,
        cardId = insertingCard.card_id;
    let invalidExpMonth, invalidExpYear;
    // Set date 12 weeks later
    const expDate = moment().add(12, 'week')
            .add(1, 'month')
            .date(1);
    const expMonth = expDate.month() + 1,
        expYear = expDate.year();
    const token = jwt.sign({ id }, params.tokenSecret, { expiresIn: 900 });

    if (expMonth === 1) {
        invalidExpMonth = expDate.month(11).month() + 1;
        invalidExpYear = expDate.subtract(1, 'year').year();
    } else {
        invalidExpMonth = expMonth - 1;
        invalidExpYear = expYear;
    }

    const commonPaymentCard = {
        token: 'card_pIQJKMs93GsCc9vLSLevbw',
        scheme: 'master',
        display_number: 'XXXX-XXXX-XXXX-0000',
        expiry_month: expMonth,
        expiry_year: expYear,
        name: 'Roland Robot',
        address_line1: '42 Sevenoaks St',
        address_city: 'Lathlain',
        address_country: 'AU',
        customer_token: insertingCustomer.payment_customer_id,
        primary: null
    };

    let createCustomerStub,
        getCustomerSourcesStub,
        getCustomerSourceStub,
        deleteCustomerSourceStub,
        setDefaultSourceStub,
        createCustomerSourceStub;
    
    let getCustomerByUserStub,
        patchAndFetchCardStub,
        patchAndFetchCustomerStub,
        insertAndFetchCardStub,
        getCardByUserStub;

    describe(`/api/cards POST(Add payment token id)`, () => {
        let tokenId = commonPaymentCard.token;

        before(() => {
            createCustomerStub = stub(PaymentService, 'createCustomer');
            createCustomerSourceStub = stub(PaymentService, 'createCustomerSource');
            getCustomerSourcesStub = stub(PaymentService, 'getCustomerSources');
    
            getCustomerByUserStub = stub(UserService, 'getCustomerByUser');
            patchAndFetchCustomerStub = stub(UserService, 'patchAndFetchCustomer');
            insertAndFetchCardStub = stub(CardService, 'insertAndFetchCard');
        });
    
        it(`should give validation error for missing header`, (done) => {
            chai.request(app)
                    .post('/api/cards')
                    .set('origin', params.appUrl)
                    .send({ tokenId })
                    .end((err, res) => {
                        res.should.have.status(UNAUTHORIZED_CODE);
                        done();
                    });
        });

        it(`should give validation error for missing payment token`, (done) => {
            chai.request(app)
                    .post('/api/cards')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.tokenId.should.not.be.null;
                        res.body.errors.tokenId.msg.should.be.equal(REQUIRED('Payment token'));
                        done();
                    });
        });

        it(`should give validation error for missing customer`, (done) => {
            getCustomerByUserStub.returns(undefined);
            chai.request(app)
                    .post('/api/cards')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ tokenId })
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.be.null;
                        res.body.message.should.be.equal(NOT_EXISTS('Customer'));

                        done();
                    });
        });

        it(`should give validation error for limit payment source`, (done) => {
            let paymentCard = Object.assign({}, commonPaymentCard);
            let cards = [];
            for(let i = 0; i < 5; i++) {
                cards.push(paymentCard);
            }
            let payCard = {
                cards: cards,
                count: cards.length
            };
            getCustomerByUserStub.returns(insertingCustomer);
            getCustomerSourcesStub.returns(payCard);

            chai.request(app)
                    .post('/api/cards')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ tokenId })
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.be.null;
                        res.body.message.should.be.equal(MAX_CARDS_LIMIT);

                        done();
                    });
        });
    
        it(`should create payment source and add to base`, (done) => {
            let paymentCard = Object.assign({}, commonPaymentCard);

            let payCard = {
                cards: [paymentCard],
                count: 1
            };
            getCustomerByUserStub.returns(insertingCustomer);
            getCustomerSourcesStub.returns(payCard);
            createCustomerSourceStub.returns(paymentCard);
            insertAndFetchCardStub.returns(true);

            chai.request(app)
                    .post('/api/cards')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ tokenId })
                    .end((err, res) => {
                        res.should.have.status(SUCCESS_CODE);
                        expect(res.body).to.not.be.null;

                        done();
                    });
        });

        after(() => {
            createCustomerStub.restore();
            getCustomerSourcesStub.restore();
            createCustomerSourceStub.restore();
            
            getCustomerByUserStub.restore();
            insertAndFetchCardStub.restore();
            patchAndFetchCustomerStub.restore();
        });
    });

    describe(`/api/cards GET(Get all user cards)`, () => {

        before(() => {
            getCustomerSourcesStub = stub(PaymentService, 'getCustomerSources');
            getCustomerByUserStub = stub(UserService, 'getCustomerByUser');
        });

        it(`should give validation error for missing header`, (done) => {
            chai.request(app)
                    .get('/api/cards')
                    .set('origin', params.appUrl)
                    .end((err, res) => {
                        res.should.have.status(UNAUTHORIZED_CODE);
                        done();
                    });
        });

        it(`should give validation error for not existing customer`, (done) => {
            getCustomerByUserStub.returns(undefined);
            chai.request(app)
                    .get('/api/cards')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.be.null;
                        res.body.message.should.be.equal(NOT_EXISTS('Customer'));

                        done();
                    });
        });

        it(`should return null when customer's don't have payment id`, (done) => {
            insertingCustomer.payment_customer_id = null;
            getCustomerByUserStub.returns(insertingCustomer);
            chai.request(app)
                    .get('/api/cards')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(SUCCESS_CODE);
                        expect(res.body.length).to.not.be.null;
                        expect(res.body.length).to.be.equal(0);

                        done();
                    });
        });

        it(`should return user's all cards`, (done) => {
            insertingCustomer.payment_customer_id = pinCustomerToken;
            let paymentCard = Object.assign({}, commonPaymentCard, {
                customer_token: insertingCustomer.payment_customer_id,
                primary: true
            });
            let payCard = {
                cards: [paymentCard],
                count: 1
            };

            getCustomerByUserStub.returns(insertingCustomer);
            getCustomerSourcesStub.returns(payCard);
            chai.request(app)
                    .get('/api/cards')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(SUCCESS_CODE);
                        expect(res.body.length).to.not.be.null;
                        expect(res.body.length).to.not.be.equal(0);

                        done();
                    });
        });

        after(() => {
            getCustomerByUserStub.restore();
            getCustomerSourcesStub.restore();
        });

    });

    describe(`/api/cards/:id PUT(Add payment token id and card id as params.id)`, () => {
        let tokenId = commonPaymentCard.token;

        before(() => {
            createCustomerSourceStub = stub(PaymentService, 'createCustomerSource');
            getCustomerSourceStub = stub(PaymentService, 'getCustomerSource');
            deleteCustomerSourceStub = stub(PaymentService, 'deleteCustomerSource');
            getCustomerByUserStub = stub(UserService, 'getCustomerByUser');
            getCardByUserStub = stub(CardService, 'getCardByUser');
            patchAndFetchCardStub = stub(CardService, 'patchAndFetchCard');
        });

        it(`should give validation error for missing header`, (done) => {
            chai.request(app)
                    .put(`/api/cards/${cardId}`)
                    .set('origin', params.appUrl)
                    .send({ tokenId })
                    .end((err, res) => {
                        res.should.have.status(UNAUTHORIZED_CODE);
                        done();
                    });
        });

        it(`should give validation error for missing payment token`, (done) => {
            chai.request(app)
                    .put(`/api/cards/${cardId}`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.tokenId.should.not.be.null;
                        res.body.errors.tokenId.msg.should.be.equal(REQUIRED('Payment token'));

                        done();
                    });
        });

        it(`should give validation error for not existing customer`, (done) => {
            getCustomerByUserStub.returns(undefined);
            chai.request(app)
                    .put(`/api/cards/${cardId}`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ tokenId })
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.be.null;
                        res.body.message.should.be.equal(NOT_EXISTS('Customer'));

                        done();
                    });
        });

        it(`should give validation error for not existing payment customer`, (done) => {
            insertingCustomer.payment_customer_id = null;
            getCustomerByUserStub.returns(insertingCustomer);
            chai.request(app)
                    .put(`/api/cards/${cardId}`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ tokenId })
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.be.null;
                        res.body.message.should.be.equal(NOT_EXISTS('Payment customer'));

                        insertingCustomer.payment_customer_id = pinCustomerToken;

                        done();
                    });
        });

        it(`should give validation error for invalid payment source country`, (done) => {
            let paymentSource = Object.assign({}, commonPaymentCard, {
                address_country: 'USA'
            });
            createCustomerSourceStub.returns(paymentSource);
            chai.request(app)
                    .put(`/api/cards/${cardId}`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ tokenId })
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.message.should.be.equal(INVALID_CARD_COUNTRY);
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.be.null;

                        done();
                    });
        });

        it(`should give validation error for invalid payment source expiration date`, (done) => {
            let paymentSource = Object.assign({}, commonPaymentCard, {
                expiry_month: invalidExpMonth,
                expiry_year: invalidExpYear
            });
            createCustomerSourceStub.returns(paymentSource);
            chai.request(app)
                    .put(`/api/cards/${cardId}`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ tokenId })
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.message.should.be.equal(INVALID_CARD_EXPIRE_DATE);
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.be.null;
                        done();
                    });
        });

        it(`should give validation error for not existing card`, (done) => {
            let paymentSource = Object.assign({}, commonPaymentCard);
            createCustomerSourceStub.returns(paymentSource);
            getCustomerSourceStub.returns(true);
            getCardByUserStub.returns(undefined);
            chai.request(app)
                    .put(`/api/cards/${cardId}`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ tokenId })
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.be.null;
                        res.body.message.should.be.equal(CARD_NOT_FOUND);

                        done();
                    });
        });

        it(`should update card data in base for this user and return updated card data`, (done) => {
            let paymentSource = Object.assign({}, commonPaymentCard);
            let card = insertingCard;
            createCustomerSourceStub.returns(paymentSource);
            getCardByUserStub.returns(card);
            getCustomerSourceStub.returns(true);
            deleteCustomerSourceStub.returns();
            patchAndFetchCardStub.returns(card);
            chai.request(app)
                    .put(`/api/cards/${cardId}`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ tokenId })
                    .end((err, res) => {
                        res.should.have.status(SUCCESS_CODE);
                        expect(res.body).to.not.be.null;
                        expect(res.body.cardId).to.not.be.equal(cardId);

                        done();
                    });
        });

        after(() => {
            createCustomerSourceStub.restore();
            getCustomerSourceStub.restore();
            deleteCustomerSourceStub.restore();
            getCustomerByUserStub.restore();
            getCardByUserStub.restore();
            patchAndFetchCardStub.restore();
        });
    });

    describe(`/api/cards/:id DELETE(Add payment card id as params.id)`, () => {

        before(() => {
            getCustomerSourceStub = stub(PaymentService, 'getCustomerSource');
            deleteCustomerSourceStub = stub(PaymentService, 'deleteCustomerSource');
            getCustomerByUserStub = stub(UserService, 'getCustomerByUser');
            getCardByUserStub = stub(CardService, 'getCardByUser');
        });

        it(`should give validation error for missing header`, (done) => {
            chai.request(app)
                    .delete(`/api/cards/${cardId}`)
                    .set('origin', params.appUrl)
                    .end((err, res) => {
                        res.should.have.status(UNAUTHORIZED_CODE);
                        done();
                    });
        });

        it(`should give validation error for not existing customer`, (done) => {
            getCustomerByUserStub.returns(undefined);
            chai.request(app)
                    .delete(`/api/cards/${cardId}`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.be.null;
                        res.body.message.should.be.equal(NOT_EXISTS('Customer'));

                        done();
                    });
        });

        it(`should give validation error for not existing payment customer`, (done) => {
            insertingCustomer.payment_customer_id = null;
            getCustomerByUserStub.returns(insertingCustomer);
            chai.request(app)
                    .delete(`/api/cards/${cardId}`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.be.null;
                        res.body.message.should.be.equal(PAYMENT_CUSTOMER_NOT_FOUND);

                        insertingCustomer.payment_customer_id = pinCustomerToken;

                        done();
                    });
        });

        it(`should give validation error for not existing card`, (done) => {
            getCustomerByUserStub.returns(insertingCustomer);
            getCustomerSourceStub.returns(commonPaymentCard);
            getCardByUserStub.returns(undefined);
            chai.request(app)
                    .delete(`/api/cards/${cardId}`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.be.null;
                        res.body.message.should.be.equal(CARD_NOT_FOUND);

                        done();
                    });
        });

        it(`should delete card data from base and return success status code`, (done) => {
            let paymentCard = Object.assign({}, commonPaymentCard, {
                token: cardId
            });

            let payCard = {
                cards: [paymentCard],
                count: 1
            };
            getCustomerByUserStub.returns(insertingCustomer);
            getCustomerSourceStub.returns(paymentCard);
            getCardByUserStub.returns(insertingCard);
            deleteCustomerSourceStub.returns();
            getCustomerSourcesStub.returns(payCard);
            chai.request(app)
                    .delete(`/api/cards/${cardId}`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(SUCCESS_CODE);

                        done();
                    });
        });

        after(() => {
            getCustomerSourceStub.restore();
            getCustomerSourcesStub.restore();
            deleteCustomerSourceStub.restore();
            getCustomerByUserStub.restore();
            getCardByUserStub.restore();
        });
    });

    describe(`/api/cards/default/:id PUT(Add payment card id as params.id)`, () => {

        before(() => {
            setDefaultSourceStub = stub(PaymentService, 'setDefaultSource');
            getCustomerSourcesStub = stub(PaymentService, 'getCustomerSources');
            getCustomerByUserStub = stub(UserService, 'getCustomerByUser');
        });

        it(`should give validation error for missing header`, (done) => {
            chai.request(app)
                    .put(`/api/cards/default/${cardId}`)
                    .set('origin', params.appUrl)
                    .end((err, res) => {
                        res.should.have.status(UNAUTHORIZED_CODE);
                        done();
                    });
        });

        it(`should give validation error for not existing customer`, (done) => {
            getCustomerByUserStub.returns(undefined);
            chai.request(app)
                    .put(`/api/cards/default/${cardId}`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.be.null;
                        res.body.message.should.be.equal(NOT_EXISTS('Customer'));

                        done();
                    });
        });

        it(`should give validation error for not existing payment customer`, (done) => {
            insertingCustomer.payment_customer_id = null;
            getCustomerByUserStub.returns(insertingCustomer);
            chai.request(app)
                    .put(`/api/cards/default/${cardId}`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.be.null;
                        res.body.message.should.be.equal(PAYMENT_CUSTOMER_NOT_FOUND);

                        insertingCustomer.payment_customer_id = pinCustomerToken;
                        done();
                    });
        });

        it(`should set and return default card data from base`, (done) => {
            let paymentCard = Object.assign({}, commonPaymentCard);
            let payCard = {
                cards: [paymentCard],
                count: 1
            };
            getCustomerByUserStub.returns(insertingCustomer);
            setDefaultSourceStub.returns(paymentCard);
            getCustomerSourcesStub.returns(payCard);
            chai.request(app)
                    .put(`/api/cards/default/${cardId}`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(SUCCESS_CODE);

                        done();
                    });
        });

        after(() => {
            getCustomerSourcesStub.restore();
            setDefaultSourceStub.restore();
            getCustomerByUserStub.restore();
        });
    });
});
