import { spy, stub } from 'sinon';
import { UserController } from '../../app/modules/user/user.controller';
import * as ErrorHandlers from '../../app/errors';
import chai from 'chai';
import { UserService, MobileService, MailService, GreenIDService } from '../../app/services';
import { User, Customer, Mobile } from '../../models';
import { SUCCESS_CODE } from '../../app/configs/status-codes';
import { VERIFICATION_SEND, VERIFIED_PHONE } from '../../app/configs/messages';

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

const reqObj = {
    authorization: null,
    cookies: {
        refreshToken: null
    },
    origin: 'http://localhost:3000'
};

describe('User Controller', () => {

    describe('"getUser" method', () => {
        let BadRequest, ValidationError, Error, userStub, customerStub;

        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            Error = stub(Error);
            userStub = stub(UserService, 'getUserById');
            customerStub = stub(UserService, 'getCustomerByUser');
        });

        let res = {};
        let next = spy();

        it('should bring BadRequest error', (done) => {
            let req = { user: { id: null } };

            UserController.getUser(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when user does not exist', (done) => {
            let req = { user: { id: 1 } };
            let res = new MockResponse(req);

            const user = undefined;

            userStub.returns(user);

            UserController.getUser(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should return success response with empty customer', async () => {
            let req = { user: { id: 1 } };
            let res = new MockResponse(req);

            const user = User.fromJson({
                id: req.user.id,
                email: 'user@test.com',
                ip_address: '255.255.255.255',
                password: 'qwerty123',
                role: 'C'
            });

            userStub.returns(user);
            customerStub.returns(undefined);

            await UserController.getUser(req, res, next);
            expect(res.statusCode).to.equal(SUCCESS_CODE);
            expect(res.data.id).to.equal(req.user.id);
        });

        it('should return success response with customer', async () => {
            let req = { user: { id: 1 } };
            let res = new MockResponse(req);

            const user = User.fromJson({
                id: req.user.id,
                email: 'user@test.com',
                ip_address: '255.255.255.255',
                password: 'qwerty123',
                role: 'C'
            });

            const customer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true
            });

            userStub.returns(user);
            customerStub.returns(customer);

            await UserController.getUser(req, res, next);
            expect(res.statusCode).to.equal(SUCCESS_CODE);
            expect(res.data.id).to.equal(req.user.id);
            expect(res.data.customer).to.equal(customer);
        });

        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            userStub.restore();
            customerStub.restore();
        });
    });

    describe('"addUser" method', () => {
        let BadRequest, ValidationError, ServiceUnavailable, Error, userStub, addStub;

        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            Error = stub(Error);
            userStub = stub(UserService, 'getUserByEmail');
            addStub = stub(UserService, 'insertAndFetchUser');
        });

        let res = {};
        let next = spy();

        it('should bring BadRequest error', done => {
            let req = {};
            UserController.addUser(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest ValidationError', done => {
            let req = { body: { email: 'user' } };
            let res = new MockResponse(req);

            UserController.addUser(req, res, next);
            next.should.have.been.calledWith(new ValidationError);

            done();
        });

        it('should bring ServiceUnavailable', done => {
            let req = { body: { email: 'user@test.com' } };
            let res = new MockResponse(req);

            UserController.addUser(req, res, next);
            next.should.have.been.calledWith(new ValidationError);

            done();
        });

        it('should return success response', done => {
            let req = { body: { email: 'user@test.com', password: 'user_pass2' }, ip: '255.255.255.255', role: 'C' };
            let res = new MockResponse(req);

            let user = new User({
                email: req.body.email,
                ip_address: req.ip,
                password: req.body.password,
                role: req.body.role
            });

            userStub.returns(undefined);
            addStub.returns(user);

            UserController.addUser(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);
                        expect(res.data).to.have.property('message', 'User successfully added.');

                        return res;
                    })
                    .catch(err => err);

            done();
        });

        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            ServiceUnavailable.restore();
            userStub.restore();
            addStub.restore();
        });
    });

    describe('"addCustomer" method', () => {
        let BadRequest, ValidationError, ServiceUnavailable, Error, userStub, addStub;

        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            Error = stub(Error);
            userStub = stub(UserService, 'getUserByEmail');
            addStub = stub(UserService, 'insertAndFetchCustomer');
        });

        let res = {};
        let next = spy();

        it('should bring BadRequest error', done => {
            let req = {};
            UserController.addCustomer(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest ValidationError', done => {
            let req = { body: { firstName: 'user' } };
            let res = new MockResponse(req);

            UserController.addCustomer(req, res, next);
            next.should.have.been.calledWith(new ValidationError);

            done();
        });

        it('should bring ServiceUnavailable', done => {
            let req = { body: { firstName: 'user' } };
            let res = new MockResponse(req);

            UserController.addCustomer(req, res, next);
            next.should.have.been.calledWith(new ValidationError);

            done();
        });

        it('should return success response', done => {
            let req = { body: { firstName: 'user_first_name', lastName: 'user_last_name', dob: '2017-10-10', userId: 1 } };
            let res = new MockResponse(req);

            let user = new User({
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                dob: req.body.dob,
                user_id: req.body.userId
            });

            userStub.returns(undefined);
            addStub.returns(user);

            UserController.addCustomer(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);
                        expect(res.data).to.have.property('message', 'Customer successfully added.');

                        return res;
                    })
                    .catch(err => err);

            done();
        });

        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            ServiceUnavailable.restore();
            userStub.restore();
            addStub.restore();
        });

    });

    describe('"sendReferral" method', () => {
        let BadRequest, ValidationError, ServiceUnavailable, Error,
            customerStub, sendReferralEmailToFriendStub,
            res = {}, next = spy();

        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            Error = stub(Error);
            sendReferralEmailToFriendStub = stub(MailService, 'sendReferralEmailToFriend');
            customerStub = stub(UserService, 'getCustomerByUser');
        });

        it('should bring BadRequest error when request is empty', (done) => {
            let req = {};
            UserController.sendReferral(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring ServiceUnavailable error', (done) => {
            let req = {
                body: { email: 'user@test.com' },
                user: { id: 1 },
                get: (val) => {
                    return reqObj[val];
                }
            };
            let res = new MockResponse(req);

            customerStub.returns(undefined);

            UserController.sendReferral(req, res, next);
            next.should.have.been.calledWith(new ValidationError);

            done();
        });

        it('should bring BadRequest error when customer does not exist', (done) => {
            let req = {
                body: { email: 'user@test.com' },
                user: { id: 1 },
                get: (val) => {
                    return reqObj[val];
                }
            };
            let res = new MockResponse(req);

            const customer = undefined;

            customerStub.returns(customer);

            UserController.sendReferral(req, res, next);
            next.should.have.been.calledWith(new ValidationError);

            done();
        });

        it('should return success response', (done) => {

            let req = {
                body: { email: 'user@test.com' },
                user: { id: 1 },
                get: (val) => {
                    return reqObj[val];
                }
            };
            let res = new MockResponse(req);

            const customer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true
            });

            customerStub.returns(customer);

            UserController.sendReferral(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);

                        return res;
                    })
                    .catch(err => err);

            done();
        });

        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            ServiceUnavailable.restore();
            sendReferralEmailToFriendStub.restore();
            customerStub.restore();
        });
    });

    describe('"phoneValidation" method', () => {
        let BadRequest, ValidationError, ServiceUnavailable, Error,
            customerStub, updateStub, mobileStub, addMobileStub, updateMobileStub,
            res = {}, next = spy();

        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            Error = stub(Error);
            customerStub = stub(UserService, 'getCustomerByUser');
            updateStub = stub(UserService, 'patchAndFetchCustomer');
            mobileStub = stub(MobileService, 'getMobileByCustomer');
            addMobileStub = stub(MobileService, 'insertAndFetchMobile');
            updateMobileStub = stub(MobileService, 'patchAndFetchMobile');
        });

        it('should bring BadRequest error when request is empty', (done) => {
            let req = {};
            UserController.phoneValidation(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring ServiceUnavailable error', (done) => {
            let req = {
                body: { mobileNumber: '+12345678910' },
                user: { id: 1 }
            };
            let res = new MockResponse(req);

            customerStub.returns(undefined);
            mobileStub.returns(undefined);
            updateStub.returns(undefined);
            addMobileStub.returns(undefined);
            updateMobileStub.returns(undefined);

            UserController.phoneValidation(req, res, next);
            next.should.have.been.calledWith(new ValidationError);

            done();
        });

        it('should bring BadRequest error when customer does not exist', (done) => {
            let req = {
                body: { mobileNumber: '+12345678910' },
                user: { id: 1 }
            };
            let res = new MockResponse(req);

            const customer = undefined;

            customerStub.returns(customer);

            UserController.phoneValidation(req, res, next);
            next.should.have.been.calledWith(new ValidationError);

            done();
        });

        it('should return forbidden response when trying to add already verified number', (done) => {
            let req = {
                body: { mobileNumber: '+12345678910' },
                user: { id: 1 }
            };
            let res = new MockResponse(req);

            const customer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
            });

            customerStub.returns(customer);
            // mobileStub.returns(mobile)

            UserController.phoneValidation(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should send code and also save into `mobile_verifications` table', (done) => {
            let req = {
                body: { mobileNumber: '+12345678910' },
                user: { id: 1 }
            };
            let res = new MockResponse(req);

            const customer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id
            });

            const newCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
            });

            const mobile = Mobile.fromJson({
                verification_code: 'AB25CD',
                send_on: '2017-10-10',
                user_id: req.user.id
            });

            customerStub.returns(customer);
            updateStub.returns(newCustomer);
            mobileStub.returns(undefined);
            addMobileStub.returns(mobile);

            UserController.phoneValidation(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);
                        expect(res.data).to.have.property('message', VERIFICATION_SEND);

                        return res;
                    })
                    .catch(err => err);

            done();
        });

        it('should send a new code and patch existing row in `mobile_verifications` table', (done) => {
            let req = {
                body: { mobileNumber: '+12345678910' },
                user: { id: 1 }
            };
            let res = new MockResponse(req);

            const customer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id
            });

            const newCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
            });

            const mobile = Mobile.fromJson({
                verification_code: 'AB25CD',
                send_on: '2017-10-10',
                user_id: req.user.id
            });

            customerStub.returns(customer);
            updateStub.returns(newCustomer);
            mobileStub.returns(mobile);
            updateMobileStub.returns(mobile);

            UserController.phoneValidation(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);
                        expect(res.data).to.have.property('message', VERIFICATION_SEND);

                        return res;
                    })
                    .catch(err => err);

            done();
        });

        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            ServiceUnavailable.restore();
            customerStub.restore();
            updateStub.restore();
            mobileStub.restore();
            addMobileStub.restore();
            updateMobileStub.restore();
        });
    });

    describe('"smsVerification" method', () => {
        let BadRequest, ValidationError, ServiceUnavailable, Error,
            customerStub, updateStub, mobileStub,
            res = {}, next = spy();

        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            Error = stub(Error);
            customerStub = stub(UserService, 'getCustomerByUser');
            updateStub = stub(UserService, 'patchAndFetchCustomer');
            mobileStub = stub(MobileService, 'getMobileByCustomer');
        });

        it('should bring BadRequest error when request is empty', (done) => {
            let req = {};
            UserController.smsVerification(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring ServiceUnavailable error', (done) => {
            let req = {
                body: { code: 'AB12CD' },
                user: { id: 1 }
            };
            let res = new MockResponse(req);

            customerStub.returns(undefined);
            updateStub.returns(undefined);
            mobileStub.returns(undefined);

            UserController.smsVerification(req, res, next);
            next.should.have.been.calledWith(new ServiceUnavailable);

            done();
        });

        it('should bring BadRequest error when customer does not exist', (done) => {
            let req = {
                body: { code: 'AB12CD' },
                user: { id: 1 }
            };
            let res = new MockResponse(req);

            const oldCustomer = undefined;
            const newCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
            });
            const mobile = Mobile.fromJson({
                verification_code: req.body.code,
                send_on: '2017-10-10',
                user_id: req.user.id
            });

            customerStub.returns(oldCustomer);
            mobileStub.returns(mobile);
            updateStub.returns(newCustomer);

            UserController.smsVerification(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when code does not exist in `mobile_verifications` table', (done) => {
            let req = {
                body: { code: 'AB12CD' },
                user: { id: 1 }
            };
            let res = new MockResponse(req);

            const oldCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: false,
            });
            const newCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
            });

            customerStub.returns(oldCustomer);
            mobileStub.returns(undefined);
            updateStub.returns(newCustomer);

            UserController.smsVerification(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest ServiceUnavailable error when trying to update customer details', (done) => {
            let req = {
                body: { code: 'AB12CD' },
                user: { id: 1 }
            };
            let res = new MockResponse(req);

            const oldCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: false,
            });
            const newCustomer = undefined;
            const mobile = Mobile.fromJson({
                verification_code: req.body.code,
                send_on: '2017-10-10',
                user_id: req.user.id
            });

            customerStub.returns(oldCustomer);
            mobileStub.returns(mobile);
            updateStub.returns(newCustomer);

            UserController.smsVerification(req, res, next);
            next.should.have.been.calledWith(new ValidationError);

            done();
        });

        it('should return success response', (done) => {
            let req = {
                body: { code: 'AB12CD' },
                user: { id: 1 }
            };
            let res = new MockResponse(req);

            const oldCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: false,
            });
            const newCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
            });
            const mobile = Mobile.fromJson({
                verification_code: req.body.code,
                send_on: '2017-10-10',
                user_id: req.user.id
            });

            customerStub.returns(oldCustomer);
            mobileStub.returns(mobile);
            updateStub.returns(newCustomer);

            UserController.smsVerification(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);
                        expect(res.data).to.have.property('message', VERIFIED_PHONE);

                        return res;
                    })
                    .catch(err => err);

            done();
        });

        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            ServiceUnavailable.restore();
            customerStub.restore();
            updateStub.restore();
            mobileStub.restore();
        });
    });

    describe('"IDVerification" method', () => {
        let BadRequest, ValidationError, ServiceUnavailable, Error,
            customerStub, updateStub, greenIDStub,
            res = {}, req = {}, next = spy();

        beforeEach(() => {
            req = {
                body: { verificationToken: 'abcdef123456789' },
                user: { id: 1 },
                get: (val) => {
                    return reqObj[val];
                }
            };
            res = new MockResponse(req);
        });

        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            Error = stub(Error);
            customerStub = stub(UserService, 'getCustomerByUser');
            updateStub = stub(UserService, 'patchAndFetchCustomer');
            greenIDStub = stub(GreenIDService, 'getVerificationResult');
        });

        it('should bring BadRequest error when request is empty', (done) => {
            let req = {};
            UserController.IDVerification(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring ServiceUnavailable error', (done) => {
            customerStub.returns(undefined);
            updateStub.returns(undefined);
            greenIDStub.returns(undefined);

            UserController.IDVerification(req, res, next);
            next.should.have.been.calledWith(new ServiceUnavailable);

            done();
        });

        it('should bring BadRequest error when customer does not exist', (done) => {
            const oldCustomer = undefined;
            const newCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: false
            });

            const gidResult = {
                givenName: 'user',
                surname: 'test'
            };

            customerStub.returns(oldCustomer);
            greenIDStub.returns(gidResult);
            updateStub.returns(newCustomer);

            UserController.IDVerification(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should return BadRequest error when trying to verify already verified customer', (done) => {
            const customer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true
            });

            customerStub.returns(customer);

            UserController.IDVerification(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when greenID result does not exist', (done) => {
            const oldCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: false
            });
            const newCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: false
            });

            const gidResult = undefined;

            customerStub.returns(oldCustomer);
            greenIDStub.returns(gidResult);
            updateStub.returns(newCustomer);

            UserController.IDVerification(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when verification token is invalid', (done) => {
            const oldCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: false
            });
            const newCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: false
            });

            const gidResult = {
                error: true,
                verificationToken: req.body.verificationToken
            };

            customerStub.returns(oldCustomer);
            greenIDStub.returns(gidResult);
            updateStub.returns(newCustomer);

            UserController.IDVerification(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when greenID returned [name, surname] and customer [name, surname] does not equal', (done) => {

            const oldCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: false
            });
            const newCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: false
            });

            const gidResult = {
                error: false,
                verificationResult: 'qwert',
                surname: 'abc',
                givenName: 'cde',
                dob: '2017-09-10',
                verificationToken: req.body.verificationToken
            };

            customerStub.returns(oldCustomer);
            greenIDStub.returns(gidResult);
            updateStub.returns(newCustomer);

            UserController.IDVerification(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest error when trying to update customer details', (done) => {

            const oldCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: false
            });
            const newCustomer = undefined;

            const gidResult = {
                error: false,
                verificationResult: 'VERIFIED',
                surname: 'user_last_name',
                givenName: 'user_first_name',
                dob: '2017-09-10',
                verificationId: 'verificationId',
                verificationToken: req.body.verificationToken
            };

            customerStub.returns(oldCustomer);
            greenIDStub.returns(gidResult);
            updateStub.returns(newCustomer);

            UserController.IDVerification(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should return success response', (done) => {

            const oldCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: false
            });
            const newCustomer = Customer.fromJson({
                first_name: 'user_first_name',
                middle_name: 'user_middle_name',
                last_name: 'user_last_name',
                dob: '2017-10-10',
                user_id: req.user.id,
                mobile_no: '+12345678910',
                is_mobile_verified: true,
                is_identity_verified: true,
                verification_id: 'verificationId'
            });

            const gidResult = {
                error: false,
                verificationResult: 'VERIFIED',
                surname: 'user_last_name',
                givenName: 'user_first_name',
                middleNames: 'user_middle_name',
                dob: '2017-09-10',
                verificationId: 'verificationId',
                verificationToken: req.body.verificationToken
            };

            customerStub.returns(oldCustomer);
            greenIDStub.returns(gidResult);
            updateStub.returns(newCustomer);

            UserController.IDVerification(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);
                        expect(res.data.data).to.equal(newCustomer);

                        return res;
                    })
                    .catch(err => err);

            done();
        });

        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            ServiceUnavailable.restore();
            customerStub.restore();
            updateStub.restore();
            greenIDStub.restore();
        });
    });
});
