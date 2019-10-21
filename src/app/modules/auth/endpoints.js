import { AuthController } from './auth.controller.js';
import middlewares from '../../middlewares';
import schemas from './schemas';

export default (router) => {
    const {
        signIn,
        checkEmail,
        signOut,
        resetPassword,
        checkMailToken,
        resetPasswordConfirm,
        refreshToken
    } = AuthController;

    router.post('/sign-in', ...middlewares(schemas, 'signIn'), signIn);
    
    router.get('/sign-out', ...middlewares(schemas, 'signOut'), signOut);
    
    router.post('/check-email', ...middlewares(schemas, 'checkEmail'), checkEmail);

    router.post('/password-reset', ...middlewares(schemas, 'resetPassword'), resetPassword);
    
    router.post('/password-reset/check-token', ...middlewares(schemas, 'checkMailToken'), checkMailToken);
    
    router.post('/password-reset/confirm', ...middlewares(schemas, 'resetPasswordConfirm'), resetPasswordConfirm);

    router.get('/refresh-token', refreshToken);
};
