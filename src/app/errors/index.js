import {
    UNAUTHORIZED_CODE,
    BAD_REQUEST_CODE,
    GONE_CODE,
    FORBIDDEN_CODE,
    VALIDATION_ERROR_CODE,
    CONFLICT_CODE,
    NOT_FOUND_CODE
} from '../configs/status-codes';
import {
    PERMISSION_DENIED,
    SOMETHING_WENT_WRONG,
    VALIDATION_ERROR
} from '../configs/messages';
import { LogService } from '../services/log.service';

export class AuthError extends Error {
    status = UNAUTHORIZED_CODE;
    message;
    errors;
    logService;

    constructor(message, errors = null) {
        super();
        this.logService = new LogService();
        this.message = message;
        this.errors = errors;
    }
    
    async log() {
        await this.logService.error(this.errors, this.message);
    }
}

export class BadRequest extends Error {
    status = BAD_REQUEST_CODE;
    message;
    errors;
    logService;

    constructor(message, errors = null) {
        super();
        this.logService = new LogService();
        this.message = message;
        this.errors = errors;
    }

    async log() {
        await this.logService.error(this.errors, this.message);
    }
}

export class Conflict extends Error {
    status = CONFLICT_CODE;
    message;
    errors;
    logService;
  
    constructor(message, errors = null) {
        super();
        this.logService = new LogService();
        this.message = message;
        this.errors = errors;
    }

    async log() {
        await this.logService.error(this.errors, this.message);
    }
}

export class NotFound extends Error {
    status = NOT_FOUND_CODE;
    message;
    errors;
    logService;
    
    constructor(message, errors = null) {
        super();
        this.logService = new LogService();
        this.message = message;
        this.errors = errors;
    }
    
    async log() {
        await this.logService.error(this.errors, this.message);
    }
}

export class Forbidden extends Error {
    status = FORBIDDEN_CODE;
    message = PERMISSION_DENIED;
    errors;
    logService;

    constructor (errors = null) {
        super();
        this.logService = new LogService();
        this.errors = errors;
    }

    async log() {
        await this.logService.error(this.errors, this.message);
    }
}

export class Gone extends Error {
    status = GONE_CODE;
    message;
    errors;
    logService;

    constructor(message, errors = null) {
        super();
        this.logService = new LogService();
        this.message = message;
        this.errors = errors;

    }

    async log() {
        await this.logService.error(this.errors, this.message);
    }
}

export class ValidationError extends Error {
    status = VALIDATION_ERROR_CODE;
    message = VALIDATION_ERROR;
    errors;
    logService;

    constructor(errors) {
        super();
        this.logService = new LogService();
        this.errors = errors;

    }

    async log() {
        await this.logService.error(this.errors, this.message);
    }
}

export class ServiceUnavailable extends Error {
    status = BAD_REQUEST_CODE;
    message = SOMETHING_WENT_WRONG;
    errors;
    logService;

    constructor(message, errors = null) {
        super();
        this.logService = new LogService();

        if (errors) {
            this.message = message;
            this.errors = errors;
        } else {
            if (typeof message === 'string') {
                this.message = message;
            } else {
                this.errors = message;
            }
        }
    }

    async log() {
        await this.logService.error(this.errors, this.message);
    }
}
