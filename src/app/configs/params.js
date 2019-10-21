import {
    appEmail,
    appURL,
    apiURL,
    awsAccessKey,
    awsAccessRegion,
    awsAccessSecret,
    greenIDAccountId,
    greenIDApiCode,
    greenIDPassword,
    greenIDVerificationApiUrl,
    mailchimpApiKey,
    mailchimpListId,
    mailchimpVerifiedInterestId,
    mailchimpUnverifiedInterestId,
    mandrillApiKey,
    port,
    pinPaymentSecretApiKey,
    pinPaymentApiUrl,
    refreshSecret,
    rollbarAccessToken,
    equifaxURL,
    equifaxUsername,
    equifaxPassword,
    tokenSecret,
    twilioSid,
    twilioToken,
    twilioPhone
} from '../helpers/config';

const params = {
    development: {
        apiUrl: apiURL,
        appUrl: appURL,
        apiPort: port,
        appEmail,
        tokenSecret,
        refreshSecret,
        rollbarAccessToken,
        appLogFile: 'storage/application.log',
        errorLogFile: 'storage/error.log',
        blackListFile: 'storage/token-blacklist.log',
        aws: {
            accessKey: awsAccessKey,
            accessSecret: awsAccessSecret,
            accessRegion: awsAccessRegion
        },
        twilio: {
            accountSid: twilioSid,
            authToken: twilioToken,
            phoneNumber: twilioPhone
        },
        greenId: {
            accountId: greenIDAccountId,
            apiCode: greenIDApiCode,
            webServicePassword: greenIDPassword,
            verificationApiUrl: greenIDVerificationApiUrl
        },
        mandrill: {
            apiKey: mandrillApiKey
        },
        equifax: {
            url: equifaxURL,
            userName: equifaxUsername,
            password: equifaxPassword
        },
        pinPayment: {
            secretKey: pinPaymentSecretApiKey,
            apiUrl: pinPaymentApiUrl
        },
        mailchimp: {
            apiKey: mailchimpApiKey,
            listId: mailchimpListId,
            verifiedInterestId: mailchimpVerifiedInterestId,
            unverifiedInterestId: mailchimpUnverifiedInterestId
        }
    },
    production: {
        apiUrl: apiURL,
        appUrl: appURL,
        apiPort: port,
        appEmail,
        tokenSecret,
        refreshSecret,
        rollbarAccessToken,
        appLogFile: 'storage/application.log',
        errorLogFile: 'storage/error.log',
        blackListFile: 'storage/token-blacklist.log',
        aws: {
            accessKey: awsAccessKey,
            accessSecret: awsAccessSecret,
            accessRegion: awsAccessRegion
        },
        twilio: {
            accountSid: twilioSid,
            authToken: twilioToken,
            phoneNumber: twilioPhone
        },
        greenId: {
            accountId: greenIDAccountId,
            apiCode: greenIDApiCode,
            webServicePassword: greenIDPassword,
            verificationApiUrl: greenIDVerificationApiUrl
        },
        mandrill: {
            apiKey: mandrillApiKey
        },
        equifax: {
            url: equifaxURL,
            userName: equifaxUsername,
            password: equifaxPassword
        },
        pinPayment: {
            secretKey: pinPaymentSecretApiKey,
            apiUrl: pinPaymentApiUrl
        },
        mailchimp: {
            apiKey: mailchimpApiKey,
            listId: mailchimpListId,
            verifiedInterestId: mailchimpVerifiedInterestId,
            unverifiedInterestId: mailchimpUnverifiedInterestId
        }
    },
    test: {
        apiUrl: apiURL,
        appUrl: appURL,
        apiPort: port,
        appEmail,
        tokenSecret,
        refreshSecret,
        rollbarAccessToken,
        blackListFile: 'storage/token-blacklist.log',
        aws: {
            accessKey: awsAccessKey,
            accessSecret: awsAccessSecret,
            accessRegion: awsAccessRegion
        },
        twilio: {
            accountSid: twilioSid,
            authToken: twilioToken,
            phoneNumber: twilioPhone
        },
        greenId: {
            accountId: greenIDAccountId,
            apiCode: greenIDApiCode,
            webServicePassword: greenIDPassword,
            verificationApiUrl: greenIDVerificationApiUrl
        },
        mandrill: {
            apiKey: mandrillApiKey
        },
        equifax: {
            url: equifaxURL,
            userName: equifaxUsername,
            password: equifaxPassword
        },
        pinPayment: {
            secretKey: pinPaymentSecretApiKey,
            apiUrl: pinPaymentApiUrl
        },
        mailchimp: {
            apiKey: mailchimpApiKey,
            listId: mailchimpListId,
            verifiedInterestId: mailchimpVerifiedInterestId,
            unverifiedInterestId: mailchimpUnverifiedInterestId
        }
    }
};

export default params[process.env.NODE_ENV || 'development'];
