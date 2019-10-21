import {
    host,
    apiURL,
    greenIdAccountId,
    greenIdApiCode,
    greenIdCountryCode,
    greenIdCountryState,
    greenIdEnv,
    mailChimpPostURL,
    bankStatementsCheckDevUrl,
    bankStatementsCheckLiveUrl,
    pinPaymentPublicKey,
    pinPaymentEnv
} from 'helpers/config';

const params = {
    development: {
        hostname: host,
        apiUrl: apiURL,
        greenId: {
            accountId: greenIdAccountId,
            apiCode: greenIdApiCode,
            countryCode: greenIdCountryCode,
            countryState: greenIdCountryState,
            environment: greenIdEnv,
        },
        mailchimp: {
            postUrl: mailChimpPostURL
        },
        pinPayment: {
            environment: pinPaymentEnv,
            publicKey: pinPaymentPublicKey
        },
        bankStatementsCheckUrl: bankStatementsCheckDevUrl
    },
    production: {
        hostname: host,
        apiUrl: '/api',
        greenId: {
            accountId: greenIdAccountId,
            apiCode: greenIdApiCode,
            countryCode: greenIdCountryCode,
            countryState: greenIdCountryState,
            environment: greenIdEnv,
        },
        mailchimp: {
            postUrl: mailChimpPostURL
        },
        pinPayment: {
            environment: pinPaymentEnv,
            publicKey: pinPaymentPublicKey
        },
        bankStatementsCheckUrl: bankStatementsCheckLiveUrl
    },
    test: {
        hostname: 'localhost',
        apiUrl: 'http://localhost:5000/api',
        greenId: {
            accountId: 'holipay',
            apiCode: 'XS4-PpP-7bX-wg9',
            countryCode: 'AU',
            countryState: 'NSW',
            environment: 'test',
        },
        mailchimp: {
            postUrl: 'https://holipay.us16.list-manage.com/subscribe/post?u=7b6415c1fb82a05f708e3db2e&amp;id=23fcc58fd3'
        },
        pinPayment: {
            environment: pinPaymentEnv,
            publicKey: pinPaymentPublicKey
        },
        bankStatementsCheckUrl: bankStatementsCheckDevUrl
    }
};

export default params[process.env.NODE_ENV || 'development'];
