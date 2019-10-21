import chai from 'chai';
import { stub } from 'sinon';
import moment from 'moment';
import chaiHttp from 'chai-http';
import * as jwt from 'jsonwebtoken';
import params from '../../app/configs/params';
import database from '../../app/configs/database';
import Knex from 'knex';
import App from '../../app/app.js';
import {
    BAD_REQUEST_CODE,
    SUCCESS_CODE,
    UNAUTHORIZED_CODE,
    VALIDATION_ERROR_CODE
} from '../../app/configs/status-codes';
import {
    APPROVED,
    BOOKING_APPROVED,
    CARD_NOT_FOUND,
    PENDING,
    NOT_AUTH_BOOKING,
    NOT_EXISTS,
    REQUIRED,
    SUCCESSFULLY_CONFIRMED_BOOKING,
    VALIDATION_ERROR,
} from '../../app/configs/messages';
import {
    insertingCustomerUser,
    insertingCustomer,
    insertingBooking,
    insertingCard,
    insertingMerchantUser
} from '../../database/data';
import { PaymentService } from '../../app/services/payment.service';

const expect = chai.expect,
    knex = Knex(database);
const app = App();

chai.should();
chai.use(chaiHttp);

describe('Booking Module', () => {
    const email = insertingCustomerUser.email,
        merId = insertingMerchantUser.id,
        bookingId = insertingBooking.id,
        id = insertingCustomerUser.id,
        cardId = insertingCard.card_id;
    
    const commonPaymentSubscription = {
        state: 'active',
        trial_started_at: moment.utc().toDate(),
        trial_ended_at: null,
        next_billing_date: moment.utc().add(1, 'week')
                .toDate(),
        current_period_started_at: moment.utc().toDate(),
        current_period_ends_at: moment.utc().add(1, 'week')
                .toDate(),
        cancelled_at: null,
        created_at: moment.utc().toDate(),
        updated_at: moment.utc().toDate(),
        token: 'sub_bZWXhTzHooKpk9FZjQfzqQ',
        plan_token: insertingBooking.plan_id,
        customer_token: insertingCustomer.payment_customer_id,
        card_token: insertingCard.card_id,
    };
    
    let createSubscriptionStub;

    describe('/api/bookings POST(Create Booking)', () => {
        const baseValue = 1000,
            surcharge = 5,
            weeklyPrice = 82,
            uploadedDocs = [],
            lastPaymentDate = insertingBooking.final_payment_date,
            totalCharged = 1030,
            merchantReference = 'Mer Ref',
            merchantName = 'Mer Name';
        
        let token;
    
        before(() => {
            token = jwt.sign({ id: merId }, params.tokenSecret, { expiresIn: 900 });
        });

        it('should give validation error for missing header', (done) => {
            chai.request(app)
                    .post('/api/bookings')
                    .set('origin', params.appUrl)
                    .end((err, res) => {
                        res.should.have.status(UNAUTHORIZED_CODE);
                        done();
                    });
        });

        it('should give validation error for missing merchant name', (done) => {
            chai.request(app)
                    .post('/api/bookings')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ baseValue, surcharge, email })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.merchantName.should.not.be.null;
                        res.body.errors.merchantName.msg.should.be.equal(REQUIRED('Merchant Name'));
                        done();
                    });
        });

        it('should give validation error for missing base value', (done) => {
            chai.request(app)
                    .post('/api/bookings')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ merchantName, surcharge, email })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.baseValue.should.not.be.null;
                        res.body.errors.baseValue.msg.should.be.equal(REQUIRED('Base Value'));
                        done();
                    });
        });

        it('should give validation error for missing surcharge', (done) => {
            chai.request(app)
                    .post('/api/bookings')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ merchantName, baseValue, email })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.surcharge.should.not.be.null;
                        res.body.errors.surcharge.msg.should.be.equal(REQUIRED('Surcharge'));
                        done();
                    });
        });

        it('should give validation error for missing total charged', (done) => {
            chai.request(app)
                    .post('/api/bookings')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ merchantName, baseValue, surcharge, email })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.totalCharged.should.not.be.null;
                        res.body.errors.totalCharged.msg.should.be.equal(REQUIRED('Total Charged'));
                        done();
                    });
        });

        it('should give validation error for missing weekly price', (done) => {
            chai.request(app)
                    .post('/api/bookings')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ merchantName, baseValue, surcharge, totalCharged, email })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.weeklyPrice.should.not.be.null;
                        res.body.errors.weeklyPrice.msg.should.be.equal(REQUIRED('Weekly Price'));
                        done();
                    });
        });

        it('should give validation error for missing Final Payment Date', (done) => {
            chai.request(app)
                    .post('/api/bookings')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ merchantName, baseValue, surcharge, totalCharged, weeklyPrice, email })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.lastPaymentDate.should.not.be.null;
                        res.body.errors.lastPaymentDate.msg.should.be.equal(REQUIRED('Final Payment Date'));
                        done();
                    });
        });

        it('should give validation error for missing email', (done) => {
            chai.request(app)
                    .post('/api/bookings')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ merchantName, baseValue,  surcharge, totalCharged, weeklyPrice, lastPaymentDate })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.email.should.not.be.null;
                        res.body.errors.email.msg.should.be.equal(REQUIRED('Email'));
                        done();
                    });
        });

        it('should create booking', (done) => {
            chai.request(app)
                    .post('/api/bookings')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ merchantReference, merchantName, baseValue, surcharge, totalCharged, weeklyPrice, uploadedDocs, lastPaymentDate, email })
                    .end((err, res) => {
                        res.should.have.status(SUCCESS_CODE);
                        expect(res.body.data).to.have.property('id').to.be.a('number');
                        done();
                    });
        });
    });
    
    describe(`/api/bookings/:id/confirm PATCH(Confirm booking)`, () => {
    
        let token;
    
        before(() => {
            token = jwt.sign({ id }, params.tokenSecret, { expiresIn: 900 });
            createSubscriptionStub = stub(PaymentService, 'createSubscription');
        });

        it(`should give validation error for missing header`, (done) => {
            chai.request(app)
                    .patch(`/api/bookings/${bookingId}/confirm`)
                    .set('origin', params.appUrl)
                    .send({ cardId })
                    .end((err, res) => {
                        res.should.have.status(UNAUTHORIZED_CODE);
                        done();
                    });
        });

        it(`should give validation error for missing card id`, (done) => {
            chai.request(app)
                    .patch(`/api/bookings/${bookingId}/confirm`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.cardId.should.not.be.null;
                        res.body.errors.cardId.msg.should.be.equal(REQUIRED('Payment card'));
                        done();
                    });
        });

        it(`should give validation error for not existing customer`, (done) => {
            (async () => {
                await knex('customers').del()
                        .where('user_id', id);
                chai.request(app)
                        .patch(`/api/bookings/${bookingId}/confirm`)
                        .set('origin', params.appUrl)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ cardId })
                        .end(async (err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.status.should.be.equal(BAD_REQUEST_CODE);
                            expect(res.body.data).to.be.null;
                            expect(res.body.errors).to.be.null;
                            res.body.message.should.be.equal(NOT_EXISTS('Customer'));

                            await knex('customers').insert([insertingCustomer]);

                            done();
                        });
            })();
        });

        it(`should give validation error for not existing card`, (done) => {
            (async () => {
                await knex('cards').del()
                        .where('user_id', id);
                chai.request(app)
                        .patch(`/api/bookings/${bookingId}/confirm`)
                        .set('origin', params.appUrl)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ cardId })
                        .end(async (err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.status.should.be.equal(BAD_REQUEST_CODE);
                            expect(res.body.data).to.be.null;
                            expect(res.body.errors).to.be.null;
                            res.body.message.should.be.equal(CARD_NOT_FOUND);

                            insertingCard.card_id = cardId;
                            await knex('cards').insert([insertingCard]);

                            done();
                        });
            })();
        });

        it(`should give validation error for not existing booking`, (done) => {
            (async () => {
                await knex('bookings').del()
                        .where('customer_id', id);
                chai.request(app)
                        .patch(`/api/bookings/${bookingId}/confirm`)
                        .set('origin', params.appUrl)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ cardId })
                        .end(async (err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.status.should.be.equal(BAD_REQUEST_CODE);
                            expect(res.body.data).to.be.null;
                            expect(res.body.errors).to.be.null;
                            res.body.message.should.be.equal(NOT_EXISTS('Booking'));

                            await knex('bookings')
                                    .insert([insertingBooking]);

                            done();
                        });
            })();
        });
    
        it(`should give validation error for not authorized booking`, (done) => {
            (async () => {
                await knex('bookings').where('customer_id', id)
                        .update({
                            is_bankstatements_passed: null,
                            is_equifax_passed: null
                        });
                chai.request(app)
                        .patch(`/api/bookings/${bookingId}/confirm`)
                        .set('origin', params.appUrl)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ cardId })
                        .end(async (err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.status.should.be.equal(BAD_REQUEST_CODE);
                            expect(res.body.data).to.be.null;
                            expect(res.body.errors).to.be.null;
                            res.body.message.should.be.equal(NOT_AUTH_BOOKING);
        
                            await knex('bookings').where('customer_id', id)
                                    .update({
                                        is_bankstatements_passed: true,
                                        is_equifax_passed: true
                                    });
                        
                            done();
                        });
            })();
        });
    
        it(`should decline and give validation error for not authorized booking`, (done) => {
            (async () => {
                await knex('bookings').where('customer_id', id)
                        .update({
                            is_bankstatements_passed: false,
                            is_equifax_passed: false
                        });
                chai.request(app)
                        .patch(`/api/bookings/${bookingId}/confirm`)
                        .set('origin', params.appUrl)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ cardId })
                        .end(async (err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.status.should.be.equal(BAD_REQUEST_CODE);
                            expect(res.body.data).to.be.null;
                            expect(res.body.errors).to.be.null;
                            res.body.message.should.be.equal(NOT_AUTH_BOOKING);
                        
                            await knex('bookings').where('customer_id', id)
                                    .update({
                                        status: PENDING,
                                        is_bankstatements_passed: true,
                                        is_equifax_passed: true
                                    });
                        
                            done();
                        });
            })();
        });
    
        it(`should give validation error for approved booking`, (done) => {
            (async () => {
                await knex('bookings').where('customer_id', id)
                        .update({
                            status: APPROVED
                        });
                chai.request(app)
                        .patch(`/api/bookings/${bookingId}/confirm`)
                        .set('origin', params.appUrl)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ cardId })
                        .end(async (err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.status.should.be.equal(BAD_REQUEST_CODE);
                            expect(res.body.data).to.be.null;
                            expect(res.body.errors).to.be.null;
                            res.body.message.should.be.equal(BOOKING_APPROVED);
                        
                            await knex('bookings').where('customer_id', id)
                                    .update({
                                        status: PENDING
                                    });
                        
                            done();
                        });
            })();
        });
        
        it(`should create charge and confirm booking`, (done) => {
            let paymentSubscription = Object.assign({}, commonPaymentSubscription);
            createSubscriptionStub.returns(paymentSubscription);
            chai.request(app)
                    .patch(`/api/bookings/${bookingId}/confirm`)
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ cardId })
                    .end((err, res) => {
                        res.should.have.status(SUCCESS_CODE);
                        expect(res.body).to.not.be.null;
                        res.body.message.should.be.equal(SUCCESSFULLY_CONFIRMED_BOOKING);

                        done();
                    });
        });

        after(() => {
            createSubscriptionStub.restore();
        });
    });
});
