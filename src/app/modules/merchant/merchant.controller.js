import { SUCCESS_CODE } from '../../configs/status-codes';
import {
    USER_NOT_EXIST,
    MERCHANT_VALIDATED,
    VERIFICATION_INVALID,
    VERIFIED_CODE,
    ACTIVE,
    SOMETHING_WENT_WRONG,
    MERCHANT_ENUM,
    REFRESH_TOKEN_COOKIE_CONFIG
} from '../../configs/messages';
import { User, MerchantVerification } from '../../../models';
import { UserService, MerchantService } from '../../services';
import { BadRequest } from '../../errors';
import Utils from '../../helpers/utils';

export class MerchantController {
    /**
     * This function will be used to validate the merchant after he has provided the email and invite code.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async validateMerchant(req, res, next) {

        if (!req.body || !req.body.email) {
            return next(new BadRequest());
        }

        const { email, inviteCode } = req.body;

        let user, merchant;

        try {
            // Find merchant with email
            user = await UserService.getUserByEmail(email);

            if (user && (user instanceof User)) {

                let merchantVerify = await MerchantService.getMerchantVerificationByUser(user);

                if (!merchantVerify || !(merchantVerify instanceof MerchantVerification)) {
                    return next(new BadRequest(SOMETHING_WENT_WRONG));
                }

                if (merchantVerify.verification_code !== inviteCode) {
                    return next(new BadRequest(VERIFICATION_INVALID));
                }

                merchant = await MerchantService.getMerchantByUser(user);

                merchant.agreementLink = merchantVerify.agreement_link;

                return res.status(SUCCESS_CODE).json({
                    verified: true,
                    message: MERCHANT_VALIDATED,
                    data: user,
                    errors: null
                });
            } else {
                return res.status(SUCCESS_CODE).json({
                    verified: false
                });
            }
        } catch (err) {
            next(err);
        }

    }

    /**
     * This function will be used to add a new merchant. This function will only be setting the is_verified flag to true.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async addMerchant(req, res, next) {

        if (!req.body || !req.body.userId) {
            return next(new BadRequest());
        }

        const { userId } = req.body;

        let user, merchant;

        try {
            // Find user with Id
            user = await UserService.getUserById(userId);

            user = await UserService.patchAndFetchUser(user, {
                status: ACTIVE
            });

            merchant = await MerchantService.patchAndFetchMerchant(user, { is_verified: true });

            if (merchant) {
                return res.status(SUCCESS_CODE).json({
                    message: VERIFIED_CODE,
                    data: merchant,
                    errors: null
                });
            }
        } catch (err) {
            next(err);
        }

    }

    /**
     * Sign In Merchant to the app.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async signIn(req, res, next) {

        if (!req.body || !req.body.email || !req.body.password) {
            return next(new BadRequest());
        }

        const { email, password } = req.body;

        let user;
        try {
            // Check if user exists by given email
            user = await UserService.getUserByEmail(email);

            // Check password
            if (!user || !(user instanceof User) || !user.validatePassword(password) || user.role !== MERCHANT_ENUM ) {
                return next(new BadRequest(USER_NOT_EXIST));
            }

            const tokenInfo = Utils.signJWTToken(user);
            res.cookie('refresh_token', tokenInfo.refreshToken, REFRESH_TOKEN_COOKIE_CONFIG);

            const merchant = await UserService.getMerchantByUser(user);

            return res.status(SUCCESS_CODE).json({
                access_token: tokenInfo.token,
                refresh_token: tokenInfo.refreshToken,
                user: {
                    id: user.id,
                    status: user.status,
                    email: user.email,
                    merchant: merchant ? merchant : {}
                },
                errors: null
            });
        } catch (err) {
            next(err);
        }
    }
}
