import moment from 'moment';
import File from '../helpers/file';
import params from '../configs/params';

export class LogService {
    appLog;
    errorLog;
    blackListLog;

    constructor() {
        this.appLog = new File(params.appLogFile, 'a+');
        this.errorLog = new File(params.errorLogFile, 'a+');
        this.blackListLog = new File(params.blackListFile, 'a+');
    }

    async log(errors, message) {
        await this.appLog.open();
        let content = await this.appLog.read();
        const log =
            `Date and Time: ${moment().format('YYYY-MM-DD HH:mm:ss')}
             Actual Status: ${errors ? errors.status : 'no status'}
             Developer Message: ${message}
             Error Message: ${errors ? errors.message : ''}`;

        const newContent = content ? `${content}\n\n${log}` : log;
        await this.appLog.replaceContent(newContent);
    }

    async error(errors, message) {
        await this.errorLog.open();
        let content = await this.errorLog.read();
        const log =
            `Date and Time: ${moment().format('YYYY-MM-DD HH:mm:ss')}
             Actual Status: ${errors ? errors.status : 'no status'}
             Developer Message: ${message}
             Error Message: ${errors ? errors.message : ''}`;

        const newContent = content ? `${content}\n\n${log}` : log;
        await this.errorLog.replaceContent(newContent);
    }
    
    async blackList(token) {
        await this.blackListLog.open();
        let content = await this.blackListLog.read();
        const log =
            `${token} - ${moment().format('YYYY-MM-DD HH:mm:ss')}`;
    
        const newContent = content ? `${content}\n${log}` : log;
        await this.blackListLog.replaceContent(newContent);
    }
}
