import { AuthError } from '../errors';
import { NOT_AUTHORIZED } from '../configs/messages';

export default (role) => {

    return async (req, res, next) => {

        if(req.user.role !== role) {
            return next(new AuthError(NOT_AUTHORIZED));
        }

        next();
    };
};
