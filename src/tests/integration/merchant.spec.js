import chai from 'chai';
import chaiHttp from 'chai-http';
import Knex from 'knex';
import database from '../../app/configs/database';
import params from '../../app/configs/params';
import App from '../../app/app.js';
import {
    SUCCESS_CODE,
    VALIDATION_ERROR_CODE
} from '../../app/configs/status-codes';
import {
    VALIDATION_ERROR,
    MERCHANT_VALIDATED,
    REQUIRED,
    INACTIVE
} from '../../app/configs/messages';
import {
    insertingMerchantVerification,
    insertingMerchantUser,
    testPass
} from '../../database/data';

const app = App();
const expect = chai.expect;
const knex = Knex(database);

chai.should();
chai.use(chaiHttp);

describe('Merchant Module', () => {
    const merEmail = insertingMerchantUser.email,
        password = testPass,
        merId = insertingMerchantUser.id;

    describe('/api/merchants/check-merchant POST(Validate Merchant)', () => {
        const inviteCode = insertingMerchantVerification.verification_code;
        
        it('should give validation error for missing email', (done) => {
            chai.request(app)
                    .post('/api/merchants/check-merchant')
                    .set('origin', params.appUrl)
                    .send({ inviteCode })
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

        it('should give validation error for missing invite code', (done) => {
            chai.request(app)
                    .post('/api/merchants/check-merchant')
                    .set('origin', params.appUrl)
                    .send({ email: merEmail })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.inviteCode.should.not.be.null;
                        res.body.errors.inviteCode.msg.should.be.equal(REQUIRED('Verify code'));
                        done();
                    });
        });

        it('should validate merchant', (done) => {
            chai.request(app)
                    .post('/api/merchants/check-merchant')
                    .set('origin', params.appUrl)
                    .send({ email: merEmail, inviteCode })
                    .end((err, res) => {
                        res.should.have.status(SUCCESS_CODE);
                        expect(res.body.data).to.have.property('id').to.be.a('number');
                        expect(res.body.errors).to.be.null;
                        res.body.message.should.be.equal(MERCHANT_VALIDATED);
                        done();
                    });
        });
    });

    describe('/api/merchants POST(Add Merchant)', () => {

        it('should give validation error for missing user Id', (done) => {
            chai.request(app)
                    .post('/api/merchants')
                    .set('origin', params.appUrl)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.userId.should.not.be.null;
                        res.body.errors.userId.msg.should.be.equal(REQUIRED('UserId'));
                        done();
                    });
        });

        it('should add merchant', (done) => {
            (async () => {
                await knex('users')
                        .where('id', merId)
                        .update({ status: INACTIVE });
                await knex('merchants')
                        .where('user_id', merId)
                        .update({ is_verified: false });

                chai.request(app)
                        .post('/api/merchants')
                        .set('origin', params.appUrl)
                        .send({ userId: merId })
                        .end((err, res) => {
                            res.should.have.status(SUCCESS_CODE);
                            expect(res.body.errors).to.be.null;
                            expect(res.body.data).to.have.property('id').to.be.a('number');
                            done();
                        });
            })();
        });
    });

    describe('/api/merchants/sign-in POST(SignIn Merchant)', () => {

        it('should give validation error for missing email', (done) => {
            chai.request(app)
                    .post('/api/merchants/sign-in')
                    .set('origin', params.appUrl)
                    .send({ password: 'user_pass1' })
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

        it('should give validation error for missing password', (done) => {
            chai.request(app)
                    .post('/api/merchants/sign-in')
                    .set('origin', params.appUrl)
                    .send({ email: 'user@test.com' })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.password.should.not.be.null;
                        res.body.errors.password.msg.should.be.equal(REQUIRED('Password'));
                        done();
                    });
        });

        it('should signIn merchant', (done) => {
            chai.request(app)
                    .post('/api/merchants/sign-in')
                    .set('origin', params.appUrl)
                    .send({ email: merEmail, password })
                    .end((err, res) => {
                        res.should.have.status(SUCCESS_CODE);
                        expect(res.body.errors).to.be.null;
                        expect(res.body.user).to.have.property('id').to.be.a('number');
                        done();
                    });
        });
    });
});
