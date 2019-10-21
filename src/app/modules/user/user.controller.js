import { SUCCESS_CODE } from '../../configs/status-codes';
import {
    USER_NOT_EXIST,
    USER_ADDED,
    CUSTOMER_ADDED,
    UNIQUE,
    ACCEPT,
    VERIFICATION_SEND,
    REFERRAL_SEND,
    REFERRAL_ALREADY_SENT,
    VERIFICATION_INVALID,
    SOMETHING_WENT_WRONG,
    VERIFIED_PHONE,
    NOT_EXISTS,
    VERIFIED_CUSTOMER,
    NOT_VERIFIED_PHONE,
    ACTIVE,
    CUSTOMER_ENUM,
    VERIFICATION_RESULTS,
    ID_VERIFIED_STATUSES,
    INVALID_ID_VERIFICATION_MESSAGE,
    PENDING
} from '../../configs/messages';
import { User, Customer, Mobile, Booking } from '../../../models';
import {
    UserService,
    SMSService,
    MobileService,
    EquifaxService,
    GreenIDService,
    MailService,
    BookingService,
    MailchimpService
} from '../../services';
import {
    BadRequest,
    Conflict
} from '../../errors';
import Utils from '../../helpers/utils';
import { each } from 'lodash';

export class UserController {
    /**
     * This function is used to fetch a user based on the user id.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async getUser(req, res, next) {

        let user, customer, merchant;

        if (!req.user.id) {
            return next(new BadRequest(USER_NOT_EXIST));
        }

        try{
            user = await UserService.getUserById(req.user.id);

            if (!user || !(user instanceof User)) {
                return next(new BadRequest(USER_NOT_EXIST));
            }

            if(user.role === CUSTOMER_ENUM) {
                customer = await UserService.getCustomerByUser(req.user);

                return res.status(SUCCESS_CODE).json({
                    id: user.id,
                    status: user.status,
                    email: user.email,
                    role: user.role,
                    customer: customer ? customer : {}
                });
            }
            else{
                merchant = await UserService.getMerchantByUser(req.user);

                return res.status(SUCCESS_CODE).json({
                    id: user.id,
                    status: user.status,
                    email: user.email,
                    role: user.role,
                    merchant: merchant ? merchant : {}
                });
            }
        }
        catch(err) {
            next(err);
        }
    }

    /**
     * This function is used to add a new user in the system.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async addUser(req, res, next) {

        if (!req.body || !req.body.email || !req.body.password) {
            return next(new BadRequest());
        }

        const { email, password } = req.body;

        let ipAddress = req.ip;

        if (ipAddress.substr(0, 7) === '::ffff:') {
            ipAddress = ipAddress.substr(7);
        }

        let user;
        try {
            user = await UserService.getUserByEmail(email);

            if(user) {
                throw new BadRequest(UNIQUE('User'));
            }

            // Insert User details.
            user = await UserService.insertAndFetchUser({
                ip_address: ipAddress,
                email: email,
                password: password
            });

            if (!user || !(user instanceof User)) {
                throw new Conflict(USER_NOT_EXIST);
            }

            await MailchimpService.addMember({ email: user.email });

            return res.status(SUCCESS_CODE).json({
                message: USER_ADDED,
                data: user,
                errors: null
            });
        }
        catch (err) {
            next(err);
        }
    }

    /**
     * This function is used to add customer for existing user.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async addCustomer(req, res, next) {

        if (!req.body || !req.body.firstName || !req.body.lastName || !req.body.dob || !req.body.userId) {
            return next(new BadRequest());
        }

        const { firstName, middleName, lastName, dob, userId } = req.body;

        let customer;
        try {
            customer = await UserService.getCustomerById(userId);

            if (customer) {
                throw new BadRequest(UNIQUE('Customer'));
            }

            // Insert Customer details.
            customer = await UserService.insertAndFetchCustomer({
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                dob: dob,
                user_id: userId
            });
            if (!customer || !(customer instanceof Customer)) {
                throw new Conflict(NOT_EXISTS('Customer'));
            }

            return res.status(SUCCESS_CODE).json({
                message: CUSTOMER_ADDED,
                data: customer,
                errors: null
            });

        }
        catch (err) {
            next(err);
        }
    }

    /**
     *  This function is used to send referral to a friend.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async sendReferral(req, res, next) {
        if (!req.body || !req.body.email) {
            return next(new BadRequest());
        }
        const { email } = req.body;

        const appUrl = `${req.get('ORIGIN')}`;

        let customer;

        try {
            customer = await UserService.getCustomerByUser(req.user);

            if (!customer || !(customer instanceof Customer)) {
                throw new BadRequest(NOT_EXISTS('Customer'));
            }

            // Check if an invite has been send to this person by the user before.
            let invite = await UserService.getCustomerInvites(req.user, email);

            if(!invite) {
                // Send Referral email to friend.
                await MailService.sendReferralEmailToFriend({
                    name: `${customer.first_name}`,
                    email: email
                }, appUrl);

                await UserService.insertAndFetchCustomerInvite(req.user, email);

                return res.status(SUCCESS_CODE).json({
                    message: REFERRAL_SEND,
                    fields: {
                        email: email
                    },
                    errors: null
                });
            }
            else{
                return res.status(SUCCESS_CODE).json({
                    message: REFERRAL_ALREADY_SENT,
                    fields: {
                        email: email
                    },
                    errors: null
                });
            }

        } catch (err) {
            next(err);
        }
    }

    /**
     *  This function is used to check the equifax score for the customer
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async equifaxCheck(req, res, next) {
        const appUrl = `${req.get('ORIGIN')}`;

        let customer, status, booking;

        try {
            const { id } = req.body;
            booking = await BookingService.getBookingById(id);

            if (!booking || !(booking instanceof Booking)) {
                throw new BadRequest(NOT_EXISTS('Booking'));
            }

            customer = await UserService.getCustomerByUser(req.user);

            if (!customer || !(customer instanceof Customer)) {
                throw new BadRequest(NOT_EXISTS('Customer'));
            }

            let score = {};

            score = await EquifaxService.checkScore( req.user, appUrl);
            if(score.scoreCheck === ACCEPT && score.defaultsCheck === ACCEPT) {
                booking.is_equifax_passed = true;
                await BookingService.patchAndFetchBooking(booking);
                status = true;
            }
                
            return res.status(SUCCESS_CODE).json({
                message: null,
                status: status,
                errors: null
            });
        } catch (err) {
            booking.is_equifax_passed = false;
            await BookingService.patchAndFetchBooking(booking);
            status = false;
            next(err);
        }
    }

    /**
     *  This function is used to validate mobile number.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async phoneValidation(req, res, next) {
        if (!req.body || !req.body.mobileNumber) {
            return next(new BadRequest());
        }
        const userId = req.user.id;

        const { mobileNumber } = req.body;

        const customerPhone = {
            mobile_no: mobileNumber,
            is_mobile_verified: false
        };

        let customer;

        try {
            customer = await UserService.getCustomerByUser(req.user);

            if (!customer || !(customer instanceof Customer)) {
                throw new BadRequest(NOT_EXISTS('Customer'));
            }

            if (customer.is_mobile_verified) {
                throw new BadRequest(VERIFIED_PHONE);
            }

            customer = await UserService.patchAndFetchCustomer(customer, customerPhone);

            if (!customer || !(customer instanceof Customer)) {
                throw new BadRequest(NOT_EXISTS('Customer'));
            }

            const verifyCode = Utils.codeGenerate(6).toUpperCase();
            let mobile;

            mobile = await MobileService.getMobileByCustomer(customer);

            if (!mobile) {
                mobile = await MobileService.insertAndFetchMobile(customer, {
                    verification_code: verifyCode,
                    user_id: userId,
                    send_on: new Date()
                });
            } else {
                mobile = await MobileService.patchAndFetchMobile(mobile, {
                    verification_code: verifyCode,
                    user_id: userId,
                    send_on: new Date()
                });
            }

            await SMSService.sendSMS(mobileNumber, verifyCode);

            if (!mobile) {
                throw new BadRequest(SOMETHING_WENT_WRONG);
            }

            return res.status(SUCCESS_CODE).json({
                message: VERIFICATION_SEND,
                data: {
                    mobileNumber: mobileNumber
                },
                errors: null
            });

        } catch (err) {
            next(err);
        }
    }

    /**
     *  This function is used to verify mobile number.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async smsVerification(req, res, next) {
        if (!req.body || !req.body.code) {
            return next(new BadRequest());
        }

        const { code } = req.body;

        let customer, mobile;
        try {
            customer = await UserService.getCustomerByUser(req.user);

            if (!customer || !(customer instanceof Customer)) {
                throw new BadRequest(NOT_EXISTS('Customer'));
            }

            mobile = await MobileService.getMobileByCustomer(customer);

            if (!mobile || !(mobile instanceof Mobile)) {
                throw new BadRequest(SOMETHING_WENT_WRONG);
            }

            if (mobile.verification_code !== code) {
                throw new BadRequest(VERIFICATION_INVALID);
            }

            customer = await UserService.patchAndFetchCustomer(customer, { is_mobile_verified: true });

            if (customer) {
                return res.status(SUCCESS_CODE).json({
                    message: VERIFIED_PHONE,
                    data: null,
                    errors: null
                });
            }

        } catch (err) {
            next(err);
        }
    }

    /**
     *  This function is used to verify Identity (eg. passport, driving licence, etc).
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async IDVerification(req, res, next) {
        if (!req.body || !req.body.verificationToken) {
            return next(new BadRequest());
        }

        const { verificationToken } = req.body;

        const appUrl = `${req.get('ORIGIN')}`;

        let gIDResult, customer, user;
        try {
            customer = await UserService.getCustomerByUser(req.user);

            if (!customer || !(customer instanceof Customer)) {
                throw new BadRequest(NOT_EXISTS('Customer'));
            }

            if (customer.is_identity_verified) {
                throw new BadRequest(VERIFIED_CUSTOMER);
            }

            if (!customer.is_mobile_verified) {
                throw new BadRequest(NOT_VERIFIED_PHONE);
            }
            gIDResult = await GreenIDService.getVerificationResult(verificationToken);
            if (!gIDResult) {
                throw new BadRequest(SOMETHING_WENT_WRONG);
            }

            if (gIDResult.error) {
                throw new BadRequest(gIDResult.errorMessage);
            }

            if (!VERIFICATION_RESULTS.includes(gIDResult.verificationResult)) {
                throw new BadRequest(INVALID_ID_VERIFICATION_MESSAGE);
            }
            let updateUser = {},
                updateCustomer = {
                    id_status: gIDResult.verificationResult,
                    state: gIDResult.state,
                    middle_name: gIDResult.middleNames,
                    verification_id: gIDResult.verificationId
                };

            if (gIDResult.verificationResult === PENDING) {
                updateCustomer.is_identity_verified = false;

            } else if (ID_VERIFIED_STATUSES.includes(gIDResult.verificationResult)) {
                updateCustomer.is_identity_verified = true;
                updateUser.status = ACTIVE;
            }
            customer = await UserService.patchAndFetchCustomer(customer, updateCustomer);

            if (!customer || !(customer instanceof Customer)) {
                throw new Conflict(NOT_EXISTS('Customer'));
            }

            if (ID_VERIFIED_STATUSES.includes(gIDResult.verificationResult)) {
                user = await UserService.patchAndFetchUser(req.user, updateUser);

                if(!user || !(user instanceof User)) {
                    throw new Conflict(USER_NOT_EXIST);
                }
            }

            // Checking if any existing bookings need to be linked with this customer.
            let bookings = await BookingService.getBookingsByEmail(req.user.email);

            if(bookings.length > 0) {
                each(bookings, async(booking) => {
                    await BookingService.patchAndFetchBooking(booking, {
                        customer_id: req.user.id
                    });
                });
            }

            await MailchimpService.updateMember({
                email: user.email,
                firstName: customer.first_name,
                lastName: customer.last_name
            });

            // Send Welcome Email to Customer
            await MailService.sendWelcomeEmailToCustomer({
                name: `${customer.first_name} ${customer.last_name}`,
                email: req.user.email
            }, appUrl);

            return res.status(SUCCESS_CODE).json({
                message: null,
                data: customer,
                errors: null
            });

        } catch (err) {
            next(err);
        }
    }
}
