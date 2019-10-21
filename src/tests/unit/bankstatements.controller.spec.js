import { spy, stub } from 'sinon';
import * as ErrorHandlers from '../../app/errors';
import chai from 'chai';
import { Booking, Customer } from '../../models';
import {  SUCCESS_CODE } from '../../app/configs/status-codes';
import {
    BookingService,
} from '../../app/services';
import { BankStatementsController } from '../../app/modules/bankstatements/bankstatements.controller';
import { CUSTOMER_ENUM } from '../../app/configs/messages';

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

describe('Bankstatements Controller', () => {
    let BadRequest,
        NotFound,
        ValidationError,
        ServiceUnavailable,
        req = {},
        res = {},
        next = spy(),
        getBookingStub;

    describe(`'getStatus' method`, () => {
        before(() => {
            BadRequest = stub(ErrorHandlers, 'BadRequest');
            NotFound = stub(ErrorHandlers, 'NotFound');
            ValidationError = stub(ErrorHandlers, 'ValidationError');
            ServiceUnavailable = stub(ErrorHandlers, 'ServiceUnavailable');
            getBookingStub = stub(BookingService, 'getBookingById');
        });
    
        beforeEach(() => {
            req = {
                params: { id: 1 },
                user: {
                    id: 1,
                    role: CUSTOMER_ENUM
                }
            };
            res = new MockResponse(req);
        });
    
        it('should bring BadRequest error when request is empty', (done) => {
            req.params = {};
            res = new MockResponse(req);
            BankStatementsController.getStatus(req, res, next);
            next.should.have.been.calledWith(new BadRequest);
        
            done();
        });
    
        it('should bring ServiceUnavailable error', (done) => {
            getBookingStub.returns(undefined);
    
            BankStatementsController.getStatus(req, res, next);
            next.should.have.been.calledWith(new ServiceUnavailable);
        
            done();
        });
    
        it('should bring NotFound error when booking does not exist for customer', (done) => {
            req.user.role = CUSTOMER_ENUM;

            const booking = undefined;

            getBookingStub.returns(booking);

            BankStatementsController.getStatus(req, res, next);
            next.should.have.been.calledWith(new NotFound);

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
                is_bankstatements_passed: true,
                merchant_id: 2
            });
          
            getBookingStub.returns(booking);

            BankStatementsController.getStatus(req, res, next)
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
            ValidationError.restore();
            ServiceUnavailable.restore();
            getBookingStub.restore();
        });
    });
});
