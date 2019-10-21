import { spy, stub } from 'sinon';
import { AuthController } from '../../app/modules/auth/auth.controller';
import * as ErrorHandlers from '../../app/errors';
import chai from 'chai';
import { UserService, MailService, TokenService } from '../../app/services';
import { User } from '../../models';
import { NO_CONTENT_CODE, SUCCESS_CODE } from '../../app/configs/status-codes';
import moment from 'moment';
import { DATE_FORMAT } from '../../app/configs/messages';

const sinonChai = require('sinon-chai');
const expect = chai.expect;

chai.should();
chai.use(sinonChai);

const reqObj = {
    authorization: null,
    cookies: {
        refreshToken: null
    },
    origin: 'http://localhost:3000'
};

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
    
    cookie(name, value) {
        this.req.cookies[name] = value;
        
        return this;
    }
    
    clearCookie(name) {
        delete this.req.cookies[name];
        
        return this;
    }
}

describe('Auth Controller', () => {
    let BadRequest,
        ValidationError,
        ServiceUnavailable,
        Conflict,
        req = {},
        res = {},
        next = spy(),
        getUserByEmailStub,
        createTokenStub,
        signUpStub,
        resetPasswordStub,
        getUserByIdStub,
        updateUserStub,
        getTokenStub,
        deleteTokenStub;
        
    describe('"checkEmail" method', () => {
        
        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            getUserByEmailStub = stub(UserService, 'getUserByEmail');
    
            req = {};
            res = {};
            next = spy();
        });
        
        it('should bring BadRequest error', (done) => {
            AuthController.checkEmail(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should bring BadRequest ValidationError', done => {
            req = { body: { email: 'user' } };
            res = new MockResponse(req);
    
            getUserByEmailStub.throws(ValidationError);
            AuthController.checkEmail(req, res, next);
            next.should.have.been.calledWith(new ValidationError);

            done();
        });

        it('should bring ServiceUnavailable', (done) => {
            req = { body: { email: 'user@test.com' } };
            res = new MockResponse(req);

            getUserByEmailStub.returns(undefined);

            AuthController.checkEmail(req, res, next);
            next.should.have.been.calledWith(new ValidationError);

            done();
        });

        it('should return success response with {verified: false}', () => {
            req = { body: { email: 'user@test.com' } };
            res = new MockResponse(req);
    
            getUserByEmailStub.returns(null);

            AuthController.checkEmail(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);
                        expect(res.data).to.have.property('verified', false);
                        
                        return res;
                    })
                    .catch(err => err);
        });

        it('should return success response with {verified: true}', () => {
            req = { body: { email: 'user@test.com' } };
            res = new MockResponse(req);

            let user = new User({
                email: req.body.email,
                name: 'user',
                password: '123'
            });
    
            getUserByEmailStub.returns(user);

            AuthController.checkEmail(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);
                        expect(res.data).to.have.property('verified', true);
                        
                        return res;
                    })
                    .catch(err => err);
        });

        after(function () {
            BadRequest.restore();
            ValidationError.restore();
            ServiceUnavailable.restore();
            getUserByEmailStub.restore();
        });

    });
    
    describe('"resetPassword" method', () => {
    
        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            Conflict = stub(ErrorHandlers, 'Conflict');
            getUserByEmailStub = stub(UserService, 'getUserByEmail');
            signUpStub = stub(MailService, 'sendEmailNotFoundMail');
            resetPasswordStub = stub(MailService, 'sendResetPasswordMail');
            createTokenStub = stub(TokenService, 'insertAndFetchToken');
        });
    
        beforeEach(() => {
            req = {
                body: { email: 'user@test.com' },
                get: (val) => {
                    return reqObj[val];
                }
            };
            res = new MockResponse(req);
        });
        
        it('should bring BadRequest error when request is empty', (done) => {
            req.body.email = null;
            res = new MockResponse(req);
            AuthController.resetPassword(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });
    
        it('should bring ServiceUnavailable error', (done) => {
            signUpStub.returns(undefined);
            createTokenStub.returns(undefined);
            resetPasswordStub.returns(undefined);

            AuthController.resetPassword(req, res, next);
            next.should.have.been.calledWith(new ServiceUnavailable);

            done();
        });
    
        it('should bring Conflict error', (done) => {
            const user = {
                id: 1,
                email: 'user@test.com',
                ip_address: '255.255.255.255',
                password: 'qwerty123'
            };
            
            getUserByEmailStub.returns(user);
            createTokenStub.returns(undefined);
        
            AuthController.resetPassword(req, res, next);
            next.should.have.been.calledWith(new Conflict);
        
            done();
        });

        it('should bring Conflict error when trying send email', (done) => {
            getUserByEmailStub.returns(undefined);
            signUpStub.returns(undefined);
        
            AuthController.resetPassword(req, res, next);
            next.should.have.been.calledWith(new Conflict);
        
            done();
        });
    
        it('should return success response and send signup message', () => {
            const message = [{
                email: 'user@test.com',
                status: 'sent',
                reject_reason: 'hard-bounce',
                _id: 'abc123abc123abc123abc123abc123'
            }];
            
            getUserByEmailStub.returns(undefined);
            signUpStub.returns(message);
    
            AuthController.resetPassword(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(NO_CONTENT_CODE);
                
                        return res;
                    })
                    .catch(err => err);
        });
    
        it('should return success response and send password reset message', () => {
            const user = {
                id: 1,
                email: 'user@test.com',
                ip_address: '255.255.255.255',
                password: 'qwerty123'
            };
        
            const token = {
                id: 1,
                token: 'abcdefgh123456tuvwxyz',
                expiration: '2017-10-10',
                user_id: user.id,
                reason: 'reset-password'
            };
        
            const message = [{
                email: user.email,
                status: 'sent',
                reject_reason: 'hard-bounce',
                _id: 'abc123abc123abc123abc123abc123'
            }];
        
            getUserByEmailStub.returns(user);
            createTokenStub.returns(token);
            resetPasswordStub.returns(message);
        
            AuthController.resetPassword(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(NO_CONTENT_CODE);
                    
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
            Conflict.restore();
            getUserByEmailStub.restore();
            signUpStub.restore();
            resetPasswordStub.restore();
            createTokenStub.restore();
        });
    });
    
    describe('"checkMailToken" method', () => {
        const expDate = moment.utc().add(3, 'hours')
                .format(DATE_FORMAT);
        const invalidExpDate = moment.utc().subtract(10, 'minute')
                .format(DATE_FORMAT);
        
        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            getTokenStub = stub(TokenService, 'getTokenByToken');
        });
        
        beforeEach(() => {
            req = { body: { token: 'abcdef12346' } };
            res = new MockResponse(req);
        });
        
        it('should bring BadRequest error when request is empty', (done) => {
            req.body.token = null;
            res = new MockResponse(req);
            AuthController.checkMailToken(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
            
            done();
        });
        
        it('should bring ServiceUnavailable error', (done) => {
            getTokenStub.returns(undefined);
            
            AuthController.checkMailToken(req, res, next);
            next.should.have.been.calledWith(new ServiceUnavailable);
            
            done();
        });
        
        it('should bring BadRequest error when token doesn\'t found in \'user_tokens\' table', (done) => {
            
            const token = undefined;
            
            getTokenStub.returns(token);
            
            AuthController.checkMailToken(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
            
            done();
        });
        
        it('should bring BadRequest error when token expiration date is invalid', (done) => {
    
            const token = {
                id: 1,
                token: req.body.token,
                expiration: invalidExpDate,
                user_id: 1,
                reason: 'reset-password'
            };
            
            getTokenStub.returns(token);
            
            AuthController.checkMailToken(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
            
            done();
        });
        
        it('should return success response', () => {
            const token = {
                id: 1,
                token: req.body.token,
                expiration: expDate,
                user_id: 1,
                reason: 'reset-password'
            };
         
            getTokenStub.returns(token);
            
            AuthController.checkMailToken(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);
                        expect(res.body.isValid).to.equal(true);
                        
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
            getTokenStub.restore();
        });
    });
    
    describe('"resetPasswordConfirm" method', () => {
        const expDate = moment.utc().add(3, 'hours')
                .format(DATE_FORMAT);
        const invalidExpDate = moment.utc().subtract(10, 'minute')
                .format(DATE_FORMAT);
        
        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            Conflict = stub(ErrorHandlers, 'Conflict');
            getTokenStub = stub(TokenService, 'getTokenByToken');
            deleteTokenStub = stub(TokenService, 'deleteToken');
            getUserByIdStub = stub(UserService, 'getUserById');
            updateUserStub = stub(UserService, 'patchAndFetchUser');
        });
        
        beforeEach(() => {
            req = { body: { token: 'abcdef12346', password: 'user1234' } };
            res = new MockResponse(req);
        });
        
        it('should bring BadRequest error when request is empty', (done) => {
            req.body.token = null;
            req.body.password = null;
            res = new MockResponse(req);
            AuthController.resetPasswordConfirm(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
            
            done();
        });
        
        it('should bring ServiceUnavailable error', (done) => {
            getTokenStub.returns(undefined);
            getUserByIdStub.returns(undefined);
            deleteTokenStub.returns(undefined);
            updateUserStub.returns(undefined);
    
            AuthController.resetPasswordConfirm(req, res, next);
            next.should.have.been.calledWith(new ServiceUnavailable);
            
            done();
        });
        
        it('should bring BadRequest error when token doesn\'t found in \'user_tokens\' table', (done) => {
          
            const token = undefined;
    
            getTokenStub.returns(token);
            
            AuthController.resetPasswordConfirm(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
            
            done();
        });
    
        it('should bring BadRequest error when token expiration date is invalid', (done) => {
        
            const token = {
                id: 1,
                token: req.body.token,
                expiration: invalidExpDate,
                user_id: 1,
                reason: 'reset-password'
            };
        
            getTokenStub.returns(token);
        
            AuthController.resetPasswordConfirm(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
        
            done();
        });
        
        it('should bring BadRequest error when user not exist', (done) => {
    
            const token = {
                id: 1,
                token: req.body.token,
                expiration: expDate,
                user_id: 1,
                reason: 'reset-password'
            };
            
            const user = undefined;
    
            getTokenStub.returns(token);
            getUserByIdStub.returns(user);
            
            AuthController.resetPasswordConfirm(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
            
            done();
        });
    
        it('should bring Conflict error when trying to remove token from \'user_tokens\' table', (done) => {
        
            const token = {
                id: 1,
                token: req.body.token,
                expiration: expDate,
                user_id: 1,
                reason: 'reset-password'
            };
    
            const user = {
                id: token.user_id,
                email: 'user@test.com',
                ip_address: '255.255.255.255',
                password: 'qwerty123'
            };
            
            const tokenRemoved = undefined;
        
            getTokenStub.returns(token);
            getUserByIdStub.returns(user);
            deleteTokenStub.returns(tokenRemoved);
        
            AuthController.resetPasswordConfirm(req, res, next);
            next.should.have.been.calledWith(new Conflict);
        
            done();
        });
        
        it('should bring Conflict error when trying update user data in \'users\' table', (done) => {
            const token = {
                id: 1,
                token: req.body.token,
                expiration: expDate,
                user_id: 1,
                reason: 'reset-password'
            };
    
            const user = {
                id: token.user_id,
                email: 'user@test.com',
                ip_address: '255.255.255.255',
                password: 'qwerty123'
            };
            
            const tokenRemoved = 1;
            const newUser = undefined;
    
            getTokenStub.returns(token);
            getUserByIdStub.returns(user);
            deleteTokenStub.returns(tokenRemoved);
            updateUserStub.returns(newUser);
    
            AuthController.resetPasswordConfirm(req, res, next);
            next.should.have.been.calledWith(new Conflict);
    
            done();
        });
        
        it('should return success response', () => {
            const token = {
                id: 1,
                token: req.body.token,
                expiration: expDate,
                user_id: 1,
                reason: 'reset-password'
            };
    
            const user = {
                id: token.user_id,
                email: 'user@test.com',
                ip_address: '255.255.255.255',
                password: 'qwerty123'
            };
            const tokenRemoved = 1;
            const newUser = Object.assign({}, user);
            newUser.password = req.body.password;
    
            getTokenStub.returns(token);
            getUserByIdStub.returns(user);
            deleteTokenStub.returns(tokenRemoved);
            updateUserStub.returns(newUser);
            
            AuthController.resetPasswordConfirm(req, res, next)
                    .then(() => {
                        expect(res.statusCode).to.equal(SUCCESS_CODE);
                        expect(res.body.email).to.equal(newUser.email);
                        
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
            Conflict.restore();
            getTokenStub.restore();
            getUserByIdStub.restore();
            deleteTokenStub.restore();
            updateUserStub.restore();
        });
    });
});
