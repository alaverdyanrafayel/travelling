import { User } from '../../models';
import { USER_NOT_EXIST, CREDENTIALS_NOT_MATCHING } from '../configs/messages';
import { AuthError } from '../errors';
import { ServiceUnavailable } from '../errors';
import { compareSync } from 'bcryptjs';
const BasicStrategy = require('passport-http').BasicStrategy;

export default (passport) => {

    let basic = new BasicStrategy((username, password, next) => {
        let { user, err } = User.query().where('email', username)
                .first()
                .then((user) => {
                    if (!user) { return(new AuthError(USER_NOT_EXIST), false); }
                    if (!compareSync(password,user.password)) { return(new AuthError(CREDENTIALS_NOT_MATCHING)); }
                    else { return(null, user); }
                })
                .catch((err) => {
                    return(new ServiceUnavailable({ message: err.message }), false);
                });
        if( user ) {
            next(null, user);
        }
        else{
            next(err);
        }
    });

    passport.use(basic);
};
