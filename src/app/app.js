import express from 'express';
import cors from 'cors';
import RateLimit from 'express-rate-limit';
import httpsRedirect from 'express-https-redirect';
import logger from 'morgan';
import passport from 'passport';
import helmet from 'helmet';
import { json, urlencoded } from 'body-parser';
import enableModules from './modules';
import limiter from './configs/limiter';
import corsOptions from './configs/cors';
import params from './configs/params';
import configPassport from './strategies/passport-jwt';
import configBasicPassport from './strategies/passport-basic';
import {
    BAD_REQUEST_CODE,
    VALIDATION_ERROR_CODE } from './configs/status-codes';
import cookieParser from 'cookie-parser';
import expressValidator from 'express-validator';
import Utils from './helpers/utils';
import { ServiceUnavailable } from './errors';
import { RollbarService } from './services';
import verificationCronJob from '../cron/id-verification.scheduler';
import sendReminderCronJob from '../cron/send-reminders';
import { handleSSR } from '../../client/src/helpers/ssr/ssrProvider';
const compression = require('compression');
const helpers = require('../../build/helpers');

class Application {
    app;
    router;

    constructor () {
        this.app = express();
        this.initApp();
    }
    initApp() {
        this.configApp();
        this.configPassport();
        this.setParams();
        this.setRouter();
        this.setErrorHandler();
        this.enableModules();
        this.configCron();
    }

    configApp() {
        if (this.app.get('env') !== 'production') {
            this.app.use(logger('dev'));
            this.app.use(cors(corsOptions));
        }

        if (this.app.get('env') === 'production') {
            this.app.use('/', httpsRedirect(false))
                    .set('views', helpers.root('client/production'))
                    .set('view engine', 'ejs');
            this.app.use(this.createLimiter());
        }

        this.app.use(compression())
                .use(json())
                .use(expressValidator({
                    customValidators: {
                        isValidPhone: Utils.validatePhone
                    }
                }))
                .use(urlencoded({ extended: true }))
                .use(cookieParser())
                .use(helmet());
    }

    createLimiter() {
        return new RateLimit(limiter);
    }

    setParams() {
        this.app.set('json spaces', 4);
    }

    configPassport() {
        configPassport(params.tokenSecret, passport);
        configBasicPassport(passport);
        this.app.use(passport.initialize())
                .use(passport.session());
    }

    setRouter() {
        this.router = express.Router();
        this.app.use(`/api`, this.router);
        if (process.env.NODE_ENV === 'production') {
            let options = {
                maxAge: '30m',
                index: false
            };
            this.app.use(express.static(helpers.root('client/production'), options));
            // this.app.use(handleSSR);
            this.app.get('bundle.js', (req, res, next) => {
                req.url = req.url + '.gz';
                res.set('Content-Encoding', 'gzip');
                next();
            });
        }
    }

    configCron() {
        verificationCronJob.start();
        sendReminderCronJob.start();
    }

    setErrorHandler() {
        this.app.use(async (err, req, res, next) => {
            if (this.app.get('env') === 'production' && err.status !== VALIDATION_ERROR_CODE) {
                await RollbarService.error(err.errors, err.message, req.body);
            }

            if(!err.status) {
                next(new ServiceUnavailable(err.message));
            }

            let status = err.status || BAD_REQUEST_CODE;

            return res.status (status).json({
                status: status,
                data: null,
                message: err.message || '',
                errors: err.errors || null,
                body: req.body
            });
        });
    }

    enableModules() {
        enableModules(this.router);
    }
}

export default () => new Application().app;
