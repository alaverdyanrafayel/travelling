import { User } from '../../models';
import { USER_NOT_EXIST } from '../configs/messages';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthError } from '../errors';

export default (secret, passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        let user = await User.query().findById(id)
                .first();
        user ? done(null, user) : done(new AuthError(USER_NOT_EXIST), null);
    });

    let jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret
    };

    let strategy = new Strategy (jwtOptions, async (payload, next) => {
        let user = await User.query().findById(payload.id)
                .first();
        if (user) {
            next(null, user);
        } else {
            next(new AuthError(USER_NOT_EXIST), false);
        }
    });
    passport.use(strategy);
};
