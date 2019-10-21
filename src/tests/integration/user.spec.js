import chai from 'chai';
import chaiHttp from 'chai-http';
import Knex from 'knex';
import * as jwt from 'jsonwebtoken';
import database from '../../app/configs/database';
import params from '../../app/configs/params';
import App from '../../app/app.js';
import {
    BAD_REQUEST_CODE,
    SUCCESS_CODE,
    UNAUTHORIZED_CODE,
    VALIDATION_ERROR_CODE
} from '../../app/configs/status-codes';
import {
    INVALID,
    INVALID_PHONE,
    NOT_EXISTS,
    CUSTOMER_ADDED,
    REQUIRED,
    UNIQUE,
    USER_ADDED,
    VALIDATION_ERROR,
    VERIFY_CODE_LENGTH,
    VALID_LENGTH,
    VERIFIED_PHONE,
    VERIFICATION_SEND,
    NOT_VERIFIED_PHONE, VERIFIED_CUSTOMER
} from '../../app/configs/messages';
import {
    insertingCustomerUser,
    testPass,
    insertingCustomer
} from '../../database/data';

const expect = chai.expect;
const knex = Knex(database);
const app = App();

chai.should();
chai.use(chaiHttp);

describe('User Module', () => {
    const id = insertingCustomerUser.id,
        password = testPass,
        invalidEmail = 'qwerty',
        existingEmail = insertingCustomerUser.email;

    describe('/api/users/user POST(Add User)', () => {
        const email = 'customer-new@test.com';
        
        it('should give validation error for missing email', (done) => {
            chai.request(app)
                    .post('/api/users/user')
                    .set('origin', params.appUrl)
                    .send({ password })
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

        it('should give validation error for invalid email', (done) => {
            chai.request(app)
                    .post('/api/users/user')
                    .set('origin', params.appUrl)
                    .send({ password, email: invalidEmail })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.email.should.not.be.null;
                        res.body.errors.email.msg.should.be.equal(INVALID('Email'));
                        done();
                    });
        });

        it('should give validation error for missing password', (done) => {
            chai.request(app)
                    .post('/api/users/user')
                    .set('origin', params.appUrl)
                    .send({ email })
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

        it('should give validation error for existing email', (done) => {
            chai.request(app)
                    .post('/api/users/user')
                    .set('origin', params.appUrl)
                    .send({ email: existingEmail, password })
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.message.should.be.equal(UNIQUE('User'));
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        done();
                    });
        });

        it('should add user', (done) => {
            chai.request(app)
                    .post('/api/users/user')
                    .set('origin', params.appUrl)
                    .send({ email, password })
                    .end(async (err, res) => {
                        res.should.have.status(SUCCESS_CODE);
                        expect(res.body.data).to.have.property('id').to.be.a('number');
                        expect(res.body.errors).to.be.null;
                        res.body.message.should.be.equal(USER_ADDED);
                        
                        await knex('users').del()
                                .where('email', email);
                        done();
                    });
        });
    });

    describe('/api/users/customer POST(Add Customer)', () => {
        let token;
        const firstName = insertingCustomer.first_name,
            lastName = insertingCustomer.last_name,
            userId = insertingCustomer.user_id,
            dob = insertingCustomer.dob;
        
        before(() => {
            token = jwt.sign({ id }, params.tokenSecret, { expiresIn: 900 });
        });

        it('should give validation error for missing header', (done) => {
            chai.request(app)
                    .post('/api/users/customer')
                    .set('origin', params.appUrl)
                    .send({ firstName, lastName, dob, userId })
                    .end((err, res) => {
                        res.should.have.status(UNAUTHORIZED_CODE);
                        done();
                    });
        });

        it('should give validation error for missing first name', (done) => {
            chai.request(app)
                    .post('/api/users/customer')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ lastName, dob, userId })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.firstName.should.not.be.null;
                        res.body.errors.firstName.msg.should.be.equal(REQUIRED('FirstName'));
                        done();
                    });
        });

        it('should give validation error for missing last name', (done) => {
            chai.request(app)
                    .post('/api/users/customer')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ firstName, dob, userId })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.lastName.should.not.be.null;
                        res.body.errors.lastName.msg.should.be.equal(REQUIRED('LastName'));
                        done();
                    });
        });

        it('should give validation error for missing dob', (done) => {
            chai.request(app)
                    .post('/api/users/customer')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ firstName, lastName, userId })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.dob.should.not.be.null;
                        res.body.errors.dob.msg.should.be.equal(REQUIRED('DOB'));
                        done();
                    });
        });

        it('should give validation error for existing customer', (done) => {
            chai.request(app)
                    .post('/api/users/customer')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ firstName, lastName, dob, userId })
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.message.should.be.equal(UNIQUE('Customer'));
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        expect(res.body.errors).to.be.null;
                        done();
                    });
        });

        it('should add customer', (done) => {
            (async () => {
                await knex('customers').del()
                        .where('user_id', userId);
                
                chai.request(app)
                        .post('/api/users/customer')
                        .set('origin', params.appUrl)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ firstName, lastName, dob, userId })
                        .end((err, res) => {
                            res.should.have.status(SUCCESS_CODE);
                            expect(res.body.data).to.have.property('id').to.be.a('number');
                            expect(res.body.errors).to.be.null;
                            res.body.message.should.be.equal(CUSTOMER_ADDED);
                            done();
                        });
            })();
        });
    });

    describe('/api/users/get-user GET(Get User)', () => {
        let token;

        before(() => {
            token = jwt.sign({ id }, params.tokenSecret, { expiresIn: 900 });
        });

        it('should give validation error for missing header', (done) => {
            chai.request(app)
                    .post('/api/users/customer')
                    .set('origin', params.appUrl)
                    .end((err, res) => {
                        res.should.have.status(UNAUTHORIZED_CODE);
                        done();
                    });
        });

        it('should get user', (done) => {
            chai.request(app)
                    .get('/api/users/me')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(SUCCESS_CODE);
                        expect(res.body).to.have.property('id').to.be.a('number');
                        done();
                    });
        });
    });

    describe('/api/users/phone-validation POST(Add mobile number)', () => {
        let token, mobileNumber, invalidMobileNumber;

        before(() => {
            mobileNumber = insertingCustomer.mobile_no;
            invalidMobileNumber = '61412345678';
            token = jwt.sign({ id }, params.tokenSecret, { expiresIn: 900 });
        });

        it('should give validation error for missing header', (done) => {
            chai.request(app)
                    .post('/api/users/phone-validation')
                    .set('origin', params.appUrl)
                    .send({ mobileNumber })
                    .end((err, res) => {
                        res.should.have.status(UNAUTHORIZED_CODE);
                        done();
                    });
        });
    
        it('should give validation error for missing mobile number', (done) => {
            chai.request(app)
                    .post('/api/users/phone-validation')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.mobileNumber.should.not.be.null;
                        res.body.errors.mobileNumber.msg.should.be.equal(REQUIRED('Mobile number'));
                        done();
                    });
        });
    
        it('should give validation error for invalid mobile number', (done) => {
            chai.request(app)
                    .post('/api/users/phone-validation')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ mobileNumber: invalidMobileNumber })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.mobileNumber.should.not.be.null;
                        res.body.errors.mobileNumber.msg.should.be.equal(INVALID_PHONE);
                        done();
                    });
        });
        
        it('should give validation error for missing customer', (done) => {
            (async () => {
                await knex('customers').del()
                        .where('user_id', id);
                chai.request(app)
                        .post('/api/users/phone-validation')
                        .set('origin', params.appUrl)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ mobileNumber })
                        .end(async (err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.status.should.be.equal(BAD_REQUEST_CODE);
                            expect(res.body.data).to.be.null;
                            expect(res.body.errors).to.be.null;
                            res.body.message.should.be.equal(NOT_EXISTS('Customer'));
                            await knex('customers')
                                    .insert([insertingCustomer]);
                            done();
                        });
            })();
        });

        it('should give message for verified mobile number', (done) => {
            (async () => {
                await knex('customers')
                        .where('user_id', id)
                        .update({
                            is_mobile_verified: true,
                        });
                chai.request(app)
                        .post('/api/users/phone-validation')
                        .set('origin', params.appUrl)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ mobileNumber })
                        .end((err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.message.should.be.equal(VERIFIED_PHONE);
                            expect(res.body.errors).to.be.null;
                            done();
                        });
            })();
        });

        it('should insert mobile number to your customer and send verification code to your mobile number', (done) => {
            (async () => {
                await knex('customers')
                        .where('user_id', id)
                        .update({
                            is_mobile_verified: false,
                        });
                chai.request(app)
                        .post('/api/users/phone-validation')
                        .set('origin', params.appUrl)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ mobileNumber })
                        .end((err, res) => {
                            res.should.have.status(SUCCESS_CODE);
                            res.body.message.should.be.equal(VERIFICATION_SEND);
                            expect(res.body.errors).to.be.null;
                            res.body.data.should.not.be.null;
                            res.body.data.mobileNumber.should.be.equal(mobileNumber);
                            done();
                        });
            })();
        });
    });

    describe('/api/users/sms-verification POST(Add verification code)', () => {
        let token, verificationCode, invalidVerificationCode;

        before(async() => {
            invalidVerificationCode = 'a545';
            verificationCode = (await knex('mobile_verifications').select('verification_code')
                    .where('user_id', id)
                    .first()).verification_code;
            token = jwt.sign({ id }, params.tokenSecret, { expiresIn: 900 });
        });

        it('should give validation error for missing header', (done) => {
            chai.request(app)
                    .post('/api/users/sms-verification')
                    .set('origin', params.appUrl)
                    .send({ code: verificationCode })
                    .end((err, res) => {
                        res.should.have.status(UNAUTHORIZED_CODE);
                        done();
                    });
        });

        it('should give validation error for missing verification code', (done) => {
            chai.request(app)
                    .post('/api/users/sms-verification')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.code.should.not.be.null;
                        res.body.errors.code.msg.should.be.equal(REQUIRED('Verify code'));
                        done();
                    });
        });

        it('should give validation error for invalid verification code', (done) => {
            chai.request(app)
                    .post('/api/users/sms-verification')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ code: invalidVerificationCode })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.code.should.not.be.null;
                        res.body.errors.code.msg.should.be.equal(VALID_LENGTH('Verification code', VERIFY_CODE_LENGTH));
                        done();
                    });
        });

        it('should give validation error for missing customers', (done) => {
            (async () => {
                await knex('customers')
                        .del()
                        .where('user_id', id);

                chai.request(app)
                        .post('/api/users/sms-verification')
                        .set('origin', params.appUrl)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ code: verificationCode })
                        .end(async (err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.status.should.be.equal(BAD_REQUEST_CODE);
                            expect(res.body.data).to.be.null;
                            expect(res.body.errors).to.be.null;
                            res.body.message.should.be.equal(NOT_EXISTS('Customer'));

                            await knex('customers')
                                    .insert([insertingCustomer]);

                            done();
                        });
            })();
        });

        it('should add verification code to base and change is_mobile_verified to true', (done) => {
            (async () => {
                
                chai.request(app)
                        .post('/api/users/sms-verification')
                        .set('origin', params.appUrl)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ code: verificationCode })
                        .end((err, res) => {
                            
                            res.should.have.status(SUCCESS_CODE);
                            res.body.message.should.be.equal(VERIFIED_PHONE);
                            expect(res.body.errors).to.be.null;
                            expect(res.body.data).to.be.null;

                            done();
                        });
            })();
        });
    });

    describe('/api/users/token-verification POST(Add verification token)', () => {
        let token, verificationToken;

        before(() => {
            verificationToken = 'abcdefghij0123456789';
            token = jwt.sign({ id }, params.tokenSecret, { expiresIn: 900 });
        });

        it('should give validation error for missing header', (done) => {
            chai.request(app)
                    .post('/api/users/token-verification')
                    .set('origin', params.appUrl)
                    .send({ verificationToken })
                    .end((err, res) => {
                        res.should.have.status(UNAUTHORIZED_CODE);
                        done();
                    });
        });

        it('should give validation error for missing verification token', (done) => {
            chai.request(app)
                    .post('/api/users/token-verification')
                    .set('origin', params.appUrl)
                    .set('Authorization', `Bearer ${token}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.verificationToken.should.not.be.null;
                        res.body.errors.verificationToken.msg.should.be.equal(REQUIRED('Verification token'));
                        done();
                    });
        });
        
        it('should give validation error for missing customer', (done) => {
            (async () => {
                await knex('customers').del()
                        .where('user_id', id);

                chai.request(app)
                        .post('/api/users/token-verification')
                        .set('origin', params.appUrl)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ verificationToken })
                        .end(async (err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.status.should.be.equal(BAD_REQUEST_CODE);
                            expect(res.body.data).to.be.null;
                            expect(res.body.errors).to.be.null;
                            res.body.message.should.be.equal(NOT_EXISTS('Customer'));

                            await knex('customers')
                                    .insert([insertingCustomer]);
                            done();
                        });
            })();
        });

        it('should give validation error for verified customer', (done) => {
            (async () => {
                await knex('customers')
                        .where('user_id', id)
                        .update({
                            is_identity_verified: true
                        });

                chai.request(app)
                        .post('/api/users/token-verification')
                        .set('origin', params.appUrl)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ verificationToken })
                        .end(async (err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.status.should.be.equal(BAD_REQUEST_CODE);
                            expect(res.body.data).to.be.null;
                            expect(res.body.errors).to.be.null;
                            res.body.message.should.be.equal(VERIFIED_CUSTOMER);

                            await knex('customers')
                                    .where('user_id', id)
                                    .update({ is_identity_verified: false });
                            done();
                        });
            })();
        });

        it('should give validation error for not verified mobile', (done) => {
            (async () => {
                await knex('customers')
                        .where('user_id', id)
                        .update({
                            is_mobile_verified: false
                        });

                chai.request(app)
                        .post('/api/users/token-verification')
                        .set('origin', params.appUrl)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ verificationToken })
                        .end(async (err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.status.should.be.equal(BAD_REQUEST_CODE);
                            expect(res.body.data).to.be.null;
                            expect(res.body.errors).to.be.null;
                            res.body.message.should.be.equal(NOT_VERIFIED_PHONE);

                            await knex('customers')
                                    .where('user_id', id)
                                    .update({ is_mobile_verified: true });
                            done();
                        });
            })();
        });
    });
});
