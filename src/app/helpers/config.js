if (process.env.NODE_ENV === 'test') {
    require('dotenv').load({ path: '.env.test' });
} else if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

import env from 'env-var';

export const jawsDb = env.get('JAWSDB_URL').asString();
export const twilioSid = env.get('HOLIPAY_TWILIO_SID').required()
        .asString();
export const twilioToken = env.get('HOLIPAY_TWILIO_TOKEN').required()
        .asString();
export const twilioPhone = env.get('HOLIPAY_TWILIO_PHONE').required()
        .asString();
export const mandrillApiKey = env.get('HOLIPAY_MANDRILL_API_KEY').required()
        .asString();
export const mailchimpApiKey = env.get('HOLIPAY_MAIL_CHIMP_API_KEY').required()
        .asString();
export const mailchimpListId = env.get('HOLIPAY_MAIL_CHIMP_LIST_ID').required()
        .asString();
export const mailchimpVerifiedInterestId = env.get('HOLIPAY_MAIL_CHIMP_VERIFIED_USERS_INTEREST_ID').required()
        .asString();
export const mailchimpUnverifiedInterestId = env.get('HOLIPAY_MAIL_CHIMP_UNVERIFIED_USERS_INTEREST_ID').required()
        .asString();
export const appEmail = env.get('HOLIPAY_EMAIL').required()
        .asString();
export const greenIDAccountId = env.get('HOLIPAY_GREEN_ID_ACCOUNT_ID').required()
        .asString();
export const greenIDApiCode = env.get('HOLIPAY_GREEN_ID_API_CODE').required()
        .asString();
export const greenIDPassword = env.get('HOLIPAY_GREEN_ID_PASSWORD').required()
        .asString();
export const greenIDVerificationApiUrl = env.get('HOLIPAY_GREEN_ID_VERIFICATION_API_URL').required()
        .asString();
export const dbUsername = env.get('HOLIPAY_DB_USERNAME').asString();
export const dbPassword = env.get('HOLIPAY_DB_PASSWORD').asString();
export const dbDatabase = env.get('HOLIPAY_DB_DATABASE').asString();
export const dbHost = env.get('HOLIPAY_DB_HOST').asString();
export const pinPaymentSecretApiKey = env.get('HOLIPAY_PIN_PAYMENT_SECRET_API_KEY').required()
        .asString();
export const pinPaymentApiUrl = env.get('HOLIPAY_PIN_PAYMENT_API_URL').required()
        .asString();
export const tokenSecret = env.get('HOLIPAY_TOKEN_SECRET').required()
        .asString();
export const refreshSecret = env.get('HOLIPAY_REFRESH_SECRET').required()
        .asString();
export const port = env.get('PORT').asInt();
export const rollbarAccessToken = env.get('ROLLBAR_ACCESS_TOKEN').required()
        .asString();
export const awsAccessKey = env.get('HOLIPAY_AWS_ACCESS_KEY').required()
        .asString();
export const awsAccessSecret = env.get('HOLIPAY_AWS_ACCESS_SECRET').required()
        .asString();
export const awsAccessRegion = env.get('HOLIPAY_AWS_REGION').required()
        .asString();
export const apiURL = env.get('HOLIPAY_API_URL').asString();
export const appURL = env.get('HOLIPAY_APP_URL').asString();
export const equifaxURL = env.get('HOLIPAY_EQUIFAX_URL').asString();
export const equifaxUsername = env.get('HOLIPAY_EQUIFAX_USERNAME').asString();
export const equifaxPassword = env.get('HOLIPAY_EQUIFAX_PASSWORD').asString();
