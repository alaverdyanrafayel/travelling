import moment from 'moment';
import {
    NO_CONTENT_CODE,
    SUCCESS_CODE
} from '../../configs/status-codes';
import * as jwt from 'jsonwebtoken';
import params from '../../configs/params';
import {
    ServiceUnavailable,
    BadRequest,
    Conflict,
} from '../../errors';
import {
    INVALID_REFRESH_TOKEN,
    USER_NOT_EXIST,
    ACCOUNT_ACTIVATED,
    PASSWORD_RESET_REASON,
    EMAIL_SENDING_ERROR,
    INVALID_MAIL_TOKEN,
    NOT_EXISTS,
    EXPIRED_MAIL_TOKEN,
    MAIL_TOKEN_LENGTH,
    DATE_FORMAT,
    TOKEN_REMOVE_ERROR,
    MERCHANT_ENUM,
    REFRESH_TOKEN_COOKIE_CONFIG
} from '../../configs/messages';
import File from '../../helpers/file';
import { User } from '../../../models';
import {
    TokenService,
    UserService,
    MailService
} from '../../services';
import Utils from '../../helpers/utils';
import { MerchantService } from '../../services/merchant.service';

export class AuthController {

    /**
     * Check if given email doesn't exist in database before sign-up process
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async checkEmail(req, res, next) {
        if (!req.body || !req.body.email) {
            return next(new BadRequest());
        }

        const { email } = req.body;

        let user;

        try {
            // Find user with email
            user = await UserService.getUserByEmail(email);

            if (user && (user instanceof User)) {
                return res.status(SUCCESS_CODE).json({
                    verified: true
                });
            } else {
                return res.status(SUCCESS_CODE).json({
                    verified: false
                });
            }
        }
        catch (err) {
            return next(err);
        }
    }

    /**
     * Sign In User to the app.
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async signIn(req, res, next) {
        const { email, password } = req.body;

        let user;
        try {
            // Check if user exists by given email
            user = await UserService.getUserByEmail(email);

            // Check password
            if (!user || !(user instanceof User) || !user.validatePassword(password) || user.role === MERCHANT_ENUM) {
                return next(new BadRequest(USER_NOT_EXIST));
            }

            const tokenInfo = Utils.signJWTToken(user);
            res.cookie('refresh_token', tokenInfo.refreshToken, REFRESH_TOKEN_COOKIE_CONFIG);

            const customer = await UserService.getCustomerByUser(user);

            return res.status(SUCCESS_CODE).json({
                access_token: tokenInfo.token,
                refresh_token: tokenInfo.refreshToken,
                user: {
                    id: user.id,
                    status: user.status,
                    email: user.email,
                    customer: customer ? customer : {}
                }
            });
        }
        catch (err) {
            return next(err);
        }
    }

    /**
     * Request to reset the user password
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async resetPassword(req, res, next) {
        if(!req.body || !req.body.email) {
            return next(new BadRequest());
        }

        const appUrl = `${req.get('ORIGIN')}`;

        const { email } = req.body;

        let user, dbToken, mailResponse, profile;
        try {
            user = await UserService.getUserByEmail(email);

            if(!user) {
                mailResponse = await MailService.sendEmailNotFoundMail(email, appUrl);
            } else {
                const token = Utils.codeGenerate(MAIL_TOKEN_LENGTH);
                const expiration = moment.utc().add(3, 'hours')
                        .format(DATE_FORMAT);

                dbToken = await TokenService.insertAndFetchToken(user, {
                    token,
                    expiration,
                    user_id: user.id,
                    reason: PASSWORD_RESET_REASON
                });

                if(!dbToken) {
                    throw new Conflict(NOT_EXISTS('Token'));
                }

                let recipient = {
                    email,
                    name: null
                };

                if (user.role === MERCHANT_ENUM) {
                    profile = await MerchantService.getMerchantByUser(user);
                } else {
                    profile = await UserService.getCustomerByUser(user);
                }

                if (profile && profile.first_name && profile.last_name) {
                    recipient.name = `${profile.first_name} ${profile.last_name}`;
                } else if (profile && profile.business_name) {
                    recipient.name = `${profile.business_name}`;
                }

                mailResponse = await MailService.sendResetPasswordMail(recipient, appUrl, token, user.role);
            }

            if(!mailResponse || !mailResponse.length) {
                throw new Conflict(EMAIL_SENDING_ERROR);
            }

            return res.status(NO_CONTENT_CODE).json();
        } catch (err) {
            next(err);
        }

    }

    /**
     * Check if given token doesn't exist in database
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async checkMailToken(req, res, next) {
        if(!req.body || !req.body.token) {
            return next(new BadRequest());
        }

        const { token } = req.body;

        let dbToken;

        try {
            dbToken = await TokenService.getTokenByToken(token);

            if(!dbToken) {
                throw new BadRequest(INVALID_MAIL_TOKEN);
            }

            const expDate = new Date(moment(dbToken.expiration).format(DATE_FORMAT));
            const today = new Date(moment.utc().format(DATE_FORMAT));

            if(expDate <= today) {
                throw new BadRequest(EXPIRED_MAIL_TOKEN);
            }

            return res.status(SUCCESS_CODE).json({
                isValid: true
            });

        } catch(err) {
            next(err);
        }

    }

    /**
     * User password confirmation based on temporary token which is valid 3 hrs after creation
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise.<*>}
     */
    static async resetPasswordConfirm(req, res, next) {
        if(!req.body || !req.body.password || !req.body.token) {
            return next(new BadRequest());
        }

        const { password, token } = req.body;

        let user, dbToken, profile;

        try {
            dbToken = await TokenService.getTokenByToken(token);

            if(!dbToken) {
                throw new BadRequest(INVALID_MAIL_TOKEN);
            }

            const expDate = new Date(moment(dbToken.expiration).format(DATE_FORMAT));
            const today = new Date(moment.utc().format(DATE_FORMAT));

            if(expDate <= today) {
                throw new BadRequest(EXPIRED_MAIL_TOKEN);
            }

            user = await UserService.getUserById(dbToken.user_id);

            const tokenRemoved = await TokenService.deleteToken(dbToken.id);

            if(!tokenRemoved) {
                throw new Conflict(TOKEN_REMOVE_ERROR);
            }
            user = await UserService.patchAndFetchUser(user, { password });

            const tokenInfo = Utils.signJWTToken(user);
            res.cookie('refresh_token', tokenInfo.refreshToken, REFRESH_TOKEN_COOKIE_CONFIG);

            if (user.role === MERCHANT_ENUM) {
                profile = await MerchantService.getMerchantByUser(user);

                return res.status(SUCCESS_CODE).json({
                    access_token: tokenInfo.token,
                    refresh_token: tokenInfo.refreshToken,
                    user: {
                        id: user.id,
                        status: user.status,
                        email: user.email,
                        merchant: profile ? profile : {}
                    }
                });
            } else {
                profile = await UserService.getCustomerByUser(user);

                return res.status(SUCCESS_CODE).json({
                    access_token: tokenInfo.token,
                    refresh_token: tokenInfo.refreshToken,
                    user: {
                        id: user.id,
                        email: user.email,
                        status: user.status,
                        customer: profile ? profile : {}
                    }
                });
            }
        } catch (err) {
            next(err);
        }
    }

    static async confirmEmail(req, res, next) {
        const { token } = req.params;

        let userToken;
        try {
            // Check if activation token exists
            userToken = await TokenService.getTokenWithUser(token);

            let userActiveData = await UserService.getUserById(userToken.user.id);

            // Activate user
            await userActiveData.$query().patchAndFetch({ 'active': 1 });

            return res.status(SUCCESS_CODE).json({
                message: ACCOUNT_ACTIVATED,
                data: null,
                errors: null
            });

        } catch (error) {
            return next(new ServiceUnavailable(error.message));
        }
    }

    static async refreshToken(req, res, next) {
        const refreshToken = req.cookies['refresh_token'];
        const token = req.header('authorization') || '';

        let decoded;
        let data;

        try {
            // Parse user id from refresh token
            decoded = jwt.verify(refreshToken, params.refreshSecret);

            let user = undefined;

            if (!decoded.id) {
            // Clear refresh token from cookie if user id doesn't exists
                res.clearCookie('refresh_token');

                return next(new BadRequest(INVALID_REFRESH_TOKEN));
            } else {
                user = await UserService.getUserById(decoded.id);
            }

            if (!user || !(user instanceof User)) {
                res.clearCookie('refresh_token');

                return next(new BadRequest(USER_NOT_EXIST));
            }

            if (token) {
                const file = new File(params.blackListFile, 'a+');

                await file.open();
                data = await file.read();

                // Add an old token in blacklist and make it unused in case it's still valid
                if (data) {
                    data = `${data}\n${token} - ${moment().format('YYYY-MM-DD HH:mm:ss')}`;
                } else {
                    data = `${token} - ${moment().format('YYYY-MM-DD HH:mm:ss')}`;
                }

                await file.replaceContent(data);

            }

            // Generate new access token
            const accessToken = jwt.sign({
                id: decoded.id,
                created_at: moment().toString()
            }, params.tokenSecret, { expiresIn: 15 * 60 });

            return res.status(SUCCESS_CODE).json({
                access_token: accessToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    status: user.status
                }
            });
        } catch (err) {
            // Clear refresh token from cookie if there is an error
            res.clearCookie('refresh_token');

            return next(err);
        }
    }

    static async signOut(req, res, next) {

        try {
            res.cookie('refresh_token', '');
            res.clearCookie('refresh_token');
            req.logout();

            return res.status(NO_CONTENT_CODE).json();
        } catch (err) {
            next(err);
        }
    }
}
