import passport from './passport';
import passportBasic from './passport-basic';
import token from './token';
import validator from './validator';
import role from './role';
import { BASIC_AUTH, BEARER_AUTH } from '../configs/messages';

export default (schemas, actionName) => {
    let middlewares = [];

    if (!schemas[actionName]) {
        return middlewares;
    }

    if (schemas[actionName].authentication === BEARER_AUTH) {
        middlewares.push(token());
        middlewares.push(passport);
        if(schemas[actionName].role) {
            middlewares.push(role(schemas[actionName].role));
        }
    }
    else if(schemas[actionName].authentication === BASIC_AUTH) {
        middlewares.push(passportBasic);
    }

    if (schemas[actionName].validation) {
        middlewares.push(validator(schemas[actionName].validation, schemas[actionName].additional));
    } else if (schemas[actionName].additional) {
        middlewares.push(validator({}, schemas[actionName].additional));
    }

    return middlewares;
};
