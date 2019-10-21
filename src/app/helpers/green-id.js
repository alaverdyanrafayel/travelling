import params from '../configs/params';
import { get } from 'https';
import { RollbarService } from '../services';

const accountId = params.greenId.accountId;
const webServicePassword = params.greenId.webServicePassword;
const verificationApiUrl = params.greenId.verificationApiUrl;

export class GreenId {

    constructor () {}

    static getVerificationResult(verification, useVerificationId = false) {
        let verify;
        if(useVerificationId) {
            verify = `verificationId=${verification}`;
        } else {
            verify = `verificationToken=${verification}`;
        }
        const greenUrl = `${verificationApiUrl}/verificationResult?accountId=${accountId}&webServicePassword=${webServicePassword}&${verify}`;

        return new Promise((resolve, reject) => {
            get(greenUrl, (resp) => {

                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', async () => {
                    await RollbarService.info({ data: JSON.parse(data), URL: greenUrl, verification: verification, useVerificationId: useVerificationId });
                    resolve(JSON.parse(data));
                });

            }, (err) => {
                reject(err);
            }).end();
        });
    }
}
