import chai from 'chai';
import chaiHttp from 'chai-http';
import moment from 'moment';
import Knex from 'knex';
import database from '../../app/configs/database';
import params from '../../app/configs/params';
import App from '../../app/app.js';
import {
    BAD_REQUEST_CODE,
    NO_CONTENT_CODE,
    SUCCESS_CODE,
    VALIDATION_ERROR_CODE
} from '../../app/configs/status-codes';
import {
    EMAIL_MAX_LENGTH,
    USER_NOT_EXIST,
    VALIDATION_ERROR,
    REQUIRED,
    LENGTH_REQUIRED,
    INVALID_PASSWORD,
    INVALID,
    INVALID_MAIL_TOKEN,
    EXPIRED_MAIL_TOKEN,
    DATE_FORMAT
} from '../../app/configs/messages';
import {
    testPass,
    insertingCustomerUser,
    insertingUserToken
} from '../../database/data';

const app = App();
const expect = chai.expect;
const knex = Knex(database);

chai.should();
chai.use(chaiHttp);

describe('Auth Module', () => {
    const email = insertingCustomerUser.email,
        expiration = insertingUserToken.expiration,
        id = insertingCustomerUser.id,
        emailToken = insertingUserToken.token,
        password = testPass,
        invalidLengthEmail = 'asdfasdfasdfasdfasdfasdfasdfasdf@qwerqwerqwerqwerqwerqw.erqwerqwer',
        notExistingEmail = 'customer-new@test.com',
        invalidEmail = 'user',
        invalidPassword = '123',
        invalidExpDate = moment.utc().subtract(10, 'minute')
                .format(DATE_FORMAT);

    describe('/api/auth/check-email POST(Check email for existing)', () => {

        it('should give validation error for missing email', (done) => {
            chai.request(app)
                    .post('/api/auth/check-email')
                    .set('origin', params.appUrl)
                    .send()
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

        it('should give validation error for long email', (done) => {
            chai.request(app)
                    .post('/api/auth/check-email')
                    .set('origin', params.appUrl)
                    .send({ email: invalidLengthEmail })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.email.should.not.be.null;
                        res.body.errors.email.msg.should.be.equal(LENGTH_REQUIRED('Email', { max: EMAIL_MAX_LENGTH }));
                        done();
                    });
        });

        it('should give validation error for invalid email', (done) => {
            chai.request(app)
                    .post('/api/auth/check-email')
                    .set('origin', params.appUrl)
                    .send({ email: invalidEmail })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.not.be.null;
                        res.body.errors.email.msg.should.be.equal(INVALID('Email'));
                        done();
                    });
        });

        it('should give boolean for existing email', (done) => {
            chai.request(app)
                    .post('/api/auth/check-email')
                    .set('origin', params.appUrl)
                    .send({ email })
                    .end((err, res) => {
                        res.should.have.status(SUCCESS_CODE);
                        res.body.verified.should.be.equal(true);
                        done();
                    });
        });
    });

    describe('/api/auth/sign-in POST(Sign user in)', () => {

        it('should give validation error from missing password', (done) => {
            chai.request(app)
                    .post('/api/auth/sign-in')
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

        it('should give validation error for invalid password', (done) => {
            chai.request(app)
                    .post('/api/auth/sign-in')
                    .set('origin', params.appUrl)
                    .send({ email, password: invalidPassword })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.password.should.not.be.null;
                        res.body.errors.password.msg.should.be.equal(INVALID_PASSWORD);
                        done();
                    });
        });

        it('should give validation error for missing email', (done) => {
            chai.request(app)
                    .post('/api/auth/sign-in')
                    .set('origin', params.appUrl)
                    .send({ password })
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

        it('should give validation error for invalid email', (done) => {
            chai.request(app)
                    .post('/api/auth/sign-in')
                    .set('origin', params.appUrl)
                    .send({ email: invalidEmail, password })
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

        it('should give validation error for long email', (done) => {
            chai.request(app)
                    .post('/api/auth/sign-in')
                    .set('origin', params.appUrl)
                    .send({ email: invalidLengthEmail, password })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.email.should.not.be.null;
                        res.body.errors.email.msg.should.be.equal(LENGTH_REQUIRED('Email', { max: EMAIL_MAX_LENGTH }));
                        done();
                    });
        });

        it('should give authentication error for not matching credentials', (done) => {
            chai.request(app)
                    .post('/api/auth/sign-in')
                    .set('origin', params.appUrl)
                    .send({ email: notExistingEmail, password })
                    .end((err, res) => {
                        res.should.have.status(BAD_REQUEST_CODE);
                        res.body.message.should.be.equal(USER_NOT_EXIST);
                        res.body.status.should.be.equal(BAD_REQUEST_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.be.null;
                        done();
                    });
        });

        it('should sign in user', (done) => {
            chai.request(app)
                    .post('/api/auth/sign-in')
                    .set('origin', params.appUrl)
                    .send({ email, password })
                    .end((err, res) => {
                        res.should.have.status(SUCCESS_CODE);
                        res.body.should.not.be.null;
                        res.body['access_token'].should.not.be.null;
                        res.body['refresh_token'].should.not.be.null;
                        res.body.user.should.not.be.null;
                        res.body.user.email.should.be.equal(email);
                        done();
                    });
        });
    });

    describe('/api/auth/password-reset POST(Add email to reset password)', () => {
        it('should give validation error for missing email', (done) => {
            chai.request(app)
                    .post('/api/auth/password-reset')
                    .set('origin', params.appUrl)
                    .send()
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

        it('should give validation error for long email', (done) => {
            chai.request(app)
                    .post('/api/auth/password-reset')
                    .set('origin', params.appUrl)
                    .send({ email: invalidLengthEmail })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.email.should.not.be.null;
                        res.body.errors.email.msg.should.be.equal(LENGTH_REQUIRED('Email', { max: EMAIL_MAX_LENGTH }));
                        done();
                    });
        });

        it('should give validation error for invalid email', (done) => {
            chai.request(app)
                    .post('/api/auth/password-reset')
                    .set('origin', params.appUrl)
                    .send({ email: invalidEmail })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        expect(res.body.errors).to.not.be.null;
                        res.body.errors.email.msg.should.be.equal(INVALID('Email'));
                        done();
                    });
        });

        it('should send email when user exist', (done) => {
            chai.request(app)
                    .post('/api/auth/password-reset')
                    .set('origin', params.appUrl)
                    .send({ email })
                    .end((err, res) => {
                        res.should.have.status(NO_CONTENT_CODE);

                        done();
                    });
        });

        it('should send email when user doesn`t exist', (done) => {
            chai.request(app)
                    .post('/api/auth/password-reset')
                    .set('origin', params.appUrl)
                    .send({ email: notExistingEmail })
                    .end((err, res) => {
                        res.should.have.status(NO_CONTENT_CODE);

                        done();
                    });
        });
    });

    describe('/api/auth/password-reset/check-token POST(Check token for valid)', () => {

        it('should give validation error for missing token', (done) => {
            chai.request(app)
                    .post('/api/auth/password-reset/check-token')
                    .set('origin', params.appUrl)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.token.should.not.be.null;
                        res.body.errors.token.msg.should.be.equal(REQUIRED('Token'));
                        done();
                    });
        });

        it('should give badRequest error when token missing in `user_tokens` table', (done) => {
            (async () => {
                await knex('user_tokens').del()
                        .where('user_id', id);

                chai.request(app)
                        .post('/api/auth/password-reset/check-token')
                        .set('origin', params.appUrl)
                        .send({ token: emailToken })
                        .end(async (err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.message.should.be.equal(INVALID_MAIL_TOKEN);
                            res.body.status.should.be.equal(BAD_REQUEST_CODE);
                            expect(res.body.data).to.be.null;
                            expect(res.body.errors).to.be.null;

                            await knex('user_tokens').insert([insertingUserToken]);

                            done();
                        });
            })();
        });

        it('should give badRequest error when token expiration date is invalid', (done) => {
            (async () => {
                await knex('user_tokens')
                        .where('user_id', id)
                        .update({ expiration: invalidExpDate });
                
                chai.request(app)
                        .post('/api/auth/password-reset/check-token')
                        .set('origin', params.appUrl)
                        .send({ token: emailToken })
                        .end(async (err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.message.should.be.equal(EXPIRED_MAIL_TOKEN);
                            res.body.status.should.be.equal(BAD_REQUEST_CODE);
                            expect(res.body.data).to.be.null;
                            expect(res.body.errors).to.be.null;

                            await knex('user_tokens')
                                    .where('user_id', id)
                                    .update({ expiration });

                            done();
                        });
            })();
        });

        it('should give success response when token is valid', (done) => {
            chai.request(app)
                    .post('/api/auth/password-reset/check-token')
                    .set('origin', params.appUrl)
                    .send({ token: emailToken })
                    .end((err, res) => {
                        res.should.have.status(SUCCESS_CODE);
                        res.body.should.not.be.null;
                        res.body.isValid.should.be.equal(true);

                        done();
                    });
        });
    });

    describe('/api/auth/password-reset/confirm POST(Add password to confirm it)', () => {

        it('should give validation error for missing password', (done) => {
            chai.request(app)
                    .post('/api/auth/password-reset/confirm')
                    .set('origin', params.appUrl)
                    .send({ token: emailToken })
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

        it('should give validation error for missing token', (done) => {
            chai.request(app)
                    .post('/api/auth/password-reset/confirm')
                    .set('origin', params.appUrl)
                    .send({ password })
                    .end((err, res) => {
                        res.should.have.status(VALIDATION_ERROR_CODE);
                        res.body.message.should.be.equal(VALIDATION_ERROR);
                        res.body.status.should.be.equal(VALIDATION_ERROR_CODE);
                        expect(res.body.data).to.be.null;
                        res.body.errors.should.not.be.null;
                        res.body.errors.token.should.not.be.null;
                        res.body.errors.token.msg.should.be.equal(REQUIRED('Token'));
                        done();
                    });
        });

        it('should give badRequest error when token missing in `user_tokens` table', (done) => {
            (async () => {
                await knex('user_tokens').del()
                        .where('user_id', id);

                chai.request(app)
                        .post('/api/auth/password-reset/confirm')
                        .set('origin', params.appUrl)
                        .send({ password, token: emailToken })
                        .end(async (err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.message.should.be.equal(INVALID_MAIL_TOKEN);
                            res.body.status.should.be.equal(BAD_REQUEST_CODE);
                            expect(res.body.data).to.be.null;
                            expect(res.body.errors).to.be.null;

                            await knex('user_tokens').insert([insertingUserToken]);

                            done();
                        });
            })();
        });

        it('should give badRequest error when token expiration date is invalid', (done) => {
            (async () => {
                await knex('user_tokens')
                        .where('user_id', id)
                        .update({ expiration: invalidExpDate });
                
                chai.request(app)
                        .post('/api/auth/password-reset/confirm')
                        .set('origin', params.appUrl)
                        .send({ password, token: emailToken })
                        .end(async (err, res) => {
                            res.should.have.status(BAD_REQUEST_CODE);
                            res.body.message.should.be.equal(EXPIRED_MAIL_TOKEN);
                            res.body.status.should.be.equal(BAD_REQUEST_CODE);
                            expect(res.body.data).to.be.null;
                            expect(res.body.errors).to.be.null;

                            await knex('user_tokens')
                                    .where('user_id', id)
                                    .update({ expiration });

                            done();
                        });
            })();
        });

        it('should sign in user', (done) => {
            chai.request(app)
                    .post('/api/auth/password-reset/confirm')
                    .set('origin', params.appUrl)
                    .send({ password, token: emailToken })
                    .end((err, res) => {
                        res.should.have.status(SUCCESS_CODE);
                        res.body.should.not.be.null;
                        res.body['access_token'].should.not.be.null;
                        res.body['refresh_token'].should.not.be.null;
                        res.body.user.should.not.be.null;
                        res.body.user.email.should.be.equal(email);

                        done();
                    });
        });
    });

    describe('/api/auth/sign-out GET(Sign user out)', () => {
        it('should sign out user', (done) => {
            chai.request(app)
                    .get('/api/auth/sign-out')
                    .set('origin', params.appUrl)
                    .end((err, res) => {
                        res.should.have.status(NO_CONTENT_CODE);

                        done();
                    });
        });
    });
});
