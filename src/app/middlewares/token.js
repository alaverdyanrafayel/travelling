import { ALREADY_SIGNED_OUT, SOMETHING_WENT_WRONG } from '../configs/messages';
import { ServiceUnavailable, AuthError } from '../errors';
import params from '../configs/params';
import File from '../helpers/file';

export default () => {
    return async (req, res, next) => {
        const authToken = req.header('Authorization'),
            file = new File(params.blackListFile, 'a+');

        let data, error = false;

        try {
            await file.open();
            data = await file.read();
        } catch (error) {
            return next(new ServiceUnavailable(SOMETHING_WENT_WRONG, { message: error.message }));
        }

        if (data) {
            const tokensWithDate = data.split('\n');
            tokensWithDate.forEach((tokenWithDate) => {
                const token = tokenWithDate.split(' - ')[0];
                if (authToken === token) {
                    error = true;
                }
            });
        }

        if (error) {
            return next(new AuthError(ALREADY_SIGNED_OUT));
        }

        next();
    };
};
