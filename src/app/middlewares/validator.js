import { ServiceUnavailable, ValidationError } from '../errors/index';

export default (schema = null, additional = null) => {

    return async (req, res, next) => {
        if (schema) {
            req.check(schema);
        }

        if (additional && Array.isArray(additional)) {

            additional.forEach((obj) => {
                switch (obj.place) {
                        case 'Headers':
                            if (obj.validationFunction === 'notEmpty') {
                                req.checkHeaders(obj.param, obj.message).notEmpty();
                            } else if (obj.validationFunction === 'isIn' && obj.functionOptions) {
                                req.checkHeaders(obj.param, obj.message).isIn(obj.functionOptions);
                            }
                            break;
                        case 'Cookies':
                            if (obj.validationFunction === 'notEmpty') {
                                req.checkHeaders(obj.param, obj.message).notEmpty();
                            }
                            break;
                        default:
                            break;
                }
            });
        }

        let result;
        try {
            result = await req.getValidationResult();	
        } catch (error) {
            return next(new ServiceUnavailable(error.message));
        }

        if (result && !result.isEmpty()) {
            return next(new ValidationError(result.mapped()));
        }

        next();
    };
};
