import { spy, stub } from 'sinon';
import { MerchantController } from '../../app/modules/merchant/merchant.controller';
import * as ErrorHandlers from '../../app/errors';
import chai from 'chai';
import { MerchantService, UserService } from '../../app/services';
import { Merchant, MerchantVerification, User } from '../../models';
import { SUCCESS_CODE } from '../../app/configs/status-codes';
import { genSaltSync, hashSync } from 'bcryptjs';

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

describe('Merchant Controller', () => {

    describe('"validateMerchant" method', () => {
        let BadRequest, ValidationError, Error, userStub, merchantStub, merchantUserStub, merchantPatchStub;

        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            Error = stub(Error);
            userStub = stub(UserService, 'getUserByEmail');
            merchantStub = stub(MerchantService, 'getMerchantVerificationByUser');
            merchantUserStub = stub(MerchantService, 'getMerchantByUser');
            merchantPatchStub = stub(MerchantService, 'patchAndFetchMerchant');
        });

        let res = {};
        let next = spy();

        it('should bring BadRequest error', (done) => {
            let req = { };

            MerchantController.validateMerchant(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should return success response with merchant', async () => {
            let req = { body: { email: 'user@test.com', inviteCode: 'ABCDEF' } };
            let res = new MockResponse(req);

            const user = User.fromJson({
                id: 1,
                email: 'user@test.com',
                password: 'user_pass1'
            });

            const merchant = Merchant.fromJson({
                business_name: 'Hotel Bright',
                business_type: 'HOTEL',
                abn: '123456789',
                contact_no: '+12345678',
                is_verified: false,
                user_id: 1
            });

            const merchantVerification = MerchantVerification.fromJson({
                verification_code: 'ABCDEF',
                agreement_link: 'http://localhost:3000',
                send_on: '2017-10-10',
                user_id: 1
            });

            userStub.returns(user);
            merchantStub.returns(merchantVerification);
            merchantUserStub.returns(merchant);

            await MerchantController.validateMerchant(req, res, next);
            expect(res.statusCode).to.equal(SUCCESS_CODE);
        });
        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            merchantStub.restore();
            merchantPatchStub.restore();
            merchantUserStub.restore();
            userStub.restore();
        });
    });

    describe('"addMerchant" method', () => {
        let BadRequest, ValidationError, Error, userStub, merchantPatchStub, userPatchStub;

        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            Error = stub(Error);
            userStub = stub(UserService, 'getUserById');
            userPatchStub = stub(UserService, 'patchAndFetchUser');
            merchantPatchStub = stub(MerchantService, 'patchAndFetchMerchant');
        });

        let res = {};
        let next = spy();

        it('should bring BadRequest error', (done) => {
            let req = { };

            MerchantController.addMerchant(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should return success response and add merchant', async () => {
            let req = { body: { userId: 1 } };
            let res = new MockResponse(req);

            const user = User.fromJson({
                id: 1,
                email: 'user@test.com',
                password: 'user_pass1'
            });

            const merchant = Merchant.fromJson({
                business_name: 'Hotel Bright',
                business_type: 'HOTEL',
                abn: '123456789',
                contact_no: '+12345678',
                is_verified: true,
                user_id: 1
            });

            userStub.returns(user);
            userPatchStub.returns(user);
            merchantPatchStub.returns(merchant);

            await MerchantController.addMerchant(req, res, next);
            expect(res.statusCode).to.equal(SUCCESS_CODE);
        });
        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            merchantPatchStub.restore();
            userStub.restore();
        });
    });

    describe('"signIn" method', () => {
        let BadRequest, ValidationError, Error, userByEmailStub, merchantByUserStub;

        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            Error = stub(Error);
            userByEmailStub = stub(UserService, 'getUserByEmail');
            merchantByUserStub = stub(UserService, 'getMerchantByUser');
        });

        let res = {};
        let next = spy();

        it('should bring BadRequest error', (done) => {
            let req = { };

            MerchantController.signIn(req, res, next);
            next.should.have.been.calledWith(new BadRequest);

            done();
        });

        it('should return success response and signIn merchant', async () => {
            let req = { body: { email: 'user@test.com', password: 'user_pass1' } };

            let res = new MockResponse(reqObj);

            const user = User.fromJson({
                id: 1,
                email: 'user@test.com',
                password: hashSync('user_pass1', genSaltSync(8)),
                role: 'M'
            });

            const merchant = Merchant.fromJson({
                business_name: 'Hotel Bright',
                business_type: 'HOTEL',
                abn: '123456789',
                contact_no: '+12345678',
                is_verified: true,
                user_id: 1
            });

            userByEmailStub.returns(user);
            merchantByUserStub.returns(merchant);

            await MerchantController.signIn(req, res, next);
            expect(res.statusCode).to.equal(SUCCESS_CODE);
        });
        after(() => {
            BadRequest.restore();
            ValidationError.restore();
            userByEmailStub.restore();
            merchantByUserStub.restore();
        });
    });
});
