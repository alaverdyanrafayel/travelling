import moment from 'moment';

export const ACTIVE = 'active';

export const INACTIVE = 'inactive';

export const GENERAL = 'general';

export const BANNED = 'banned';

export const DELETED = 'deleted';

export const CAPTURE = 'capture';

export const REFUND = 'refund';

export const CRONTIMEZONE = 'Australia/Sydney';
// CronTime config for every 5 minute
export const CRONTIME = '*/5 * * * *';
// CronTime config for every day 10:00
export const REMINDERS_CRONTIME = '0 10 * * *';

export const REFRESH_TOKEN_VALIDITY_SECONDS = 30 * 24 * 60 * 60; // 30 days
export const REFRESH_TOKEN_COOKIE_CONFIG = {
    path: '/',
    expires: moment().add(REFRESH_TOKEN_VALIDITY_SECONDS, 'seconds')
            .toDate(),
    httpOnly: true
};

export const UPCOMING = 'upcoming';
export const INVOICE_UPDATED = 'updated';
export const INVOICE_CREATED = 'created';
export const INVOICE_FAILED = 'failed';
export const INVOICE_SENT = 'sent';
export const PAYMENT_SUCCEED = 'payment_succeeded';
export const INVOICE_TYPES = [
    UPCOMING,
    INVOICE_UPDATED,
    INVOICE_CREATED,
    INVOICE_FAILED,
    PAYMENT_SUCCEED,
    INVOICE_SENT
];

export const SEND_REMINDERS_FIELDS = [
    'first_name',
    'last_name',
    'email',
    'mobile_no',
    'dob',
    'customer:bookings.status as status',
    'base_value',
    'total_charge',
    'weekly_price',
    'final_payment_date',
    'plan_id',
    'subscription_id'
];

export const FAILED = 'FAILED';
export const NEW = 'NEW';
export const PASSED = 'PASSED';
export const PENDING = 'PENDING';
export const VERIFIED = 'VERIFIED';
export const APPROVED = 'APPROVED';
export const DECLINED = 'DECLINED';
export const VERIFIED_WITH_CHANGES = 'VERIFIED_WITH_CHANGES';
export const VERIFIED_ADMIN = 'VERIFIED_ADMIN';

export const CURRENCY = 'AUD';
export const VERIFICATION_RESULTS = [
    FAILED,
    PENDING,
    VERIFIED,
    VERIFIED_WITH_CHANGES,
    VERIFIED_ADMIN
];
export const ID_VERIFIED_STATUSES = [
    VERIFIED,
    VERIFIED_WITH_CHANGES,
    VERIFIED_ADMIN
];

export const EMAIL = 'info@holipay.com.au';

export const NOT_AUTHORIZED = 'User is not authorized';

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const ACTIVATION_REASON = 'activation';

export const PASSWORD_RESET_REASON = 'reset-password';

export const CUSTOMER_ENUM = 'C';

export const MERCHANT_ENUM = 'M';

export const BOOKING_ENUMS = [
    PENDING,
    APPROVED,
    DECLINED
];

export const PASSWORD_MIN_LENGTH = 8;

export const SMS_REMINDER_LEFT_COUNT = 1;

export const MAIL_REMINDER_LEFT_COUNT = 3;

export const PASSWORD_MAX_LENGTH = 64;

export const VERIFY_CODE_LENGTH = 6;

export const NAME_MAX_LENGTH = 32;

export const MAIL_TOKEN_LENGTH = 20;

export const STREET_TYPE_MAX_LENGTH = 3;

export const STATE_MAX_LENGTH = 3;

export const POSTCODE_MAX_LENGTH = 4;

export const GENDER_MAX_LENGTH = 1;

export const HOME_ADDRESS_MAX_LENGTH = 45;

export const MOBILE_MAX_LENGTH = 45;

export const VERIFICATION_ID_MAX_LENGTH = 45;

export const EMAIL_MAX_LENGTH = 64;

export const IP_MAX_LENGTH = 15;

export const SUBSCRIPTION_PERIOD_COUNT = 12;

export const MIN_LENGTH = 1;

export const ACCEPT = 'ACCEPT';

export const DECLINE = 'DECLINE';

export const BASIC_AUTH = 'basic';

export const BEARER_AUTH = 'bearer';

export const CREDENTIALS_NOT_MATCHING = 'Authentication failed. Credentials do not match.';

export const USER_NOT_EXIST = 'The email or password you entered is incorrect. Please try again.';

export const SUCCESSFULLY_AUTHORIZED = 'You are successfully authorized.';

export const SUCCESSFULLY_CONFIRMED_BOOKING = 'This booking is successfully confirmed.';

export const SUCCESSFULLY_CAPTURED = 'You are successfully captured.';

export const SUCCESSFULLY_REFUNDED = 'You are successfully refunded.';

export const BOOKING_APPROVED = 'This booking already approved.';

export const SOMETHING_WENT_WRONG = 'Something went wrong. Try again.';

export const MAX_CARDS_LIMIT = `You can't have more than 5 cards.`;

export const ALREADY_SIGNED_OUT = `You're signed out, to perform this action sign in again.`;

export const INVALID_REFRESH_TOKEN = 'Refresh token is not valid.';

export const ACCOUNT_ACTIVATED = 'Account successfully activated.';

export const USER_ADDED = 'User successfully added.';

export const BOOKING_ADDED = 'Booking successfully created.';

export const MERCHANT_VALIDATED = 'Merchant successfully validated.';

export const CUSTOMER_ADDED = 'Customer successfully added.';

export const VALIDATION_ERROR = `Request didn't pass validation.`;

export const PERMISSION_DENIED = 'Permission Denied.';

export const REQUIRED = resource => `${resource} is required!`;

export const UPDATED = resource => `${resource} is updated.`;

export const UNIQUE = resource => `${resource} must be unique!`;

export const VALID_LENGTH =  (resource, oprtions) => `${resource} must contain ${oprtions} characters!`;

export const INVALID = (resource) => `${resource} is invalid.`;

export const ONLY_ALPHA_NUMERIC = resource => `${resource} must contain only alphabetic and numeric characters!`;

export const NOT_EXISTS = resource => `${resource} doesn't exist!`;

export const LENGTH_REQUIRED = (resource, options) => {
    const { min, max } = options;
    if (min && max) {
        return `${resource} must be at least ${min} and maximum ${max} characters!`;
    } else if (min) {
        return `${resource} must be at least ${min} characters!`;
    } else {
        return `${resource} must be maximum ${max} characters!`;
    }
};

export const INVALID_REQUEST_PARAMS = 'Invalid request params';

export const INVALID_PASSWORD = 'Password must contain at least one character and one number!';

export const INVALID_PHONE = 'Invalid mobile number';

export const VERIFICATION_SEND = 'Verification code was sent to your mobile number';

export const REFERRAL_SEND = 'Invite was sent successfully';

export const REFERRAL_ALREADY_SENT = 'Invite has already been sent to this email address';

export const VERIFICATION_INVALID = 'Invalid verification code';

export const VERIFIED_CUSTOMER = 'Customer is verified!';

export const VERIFIED_PHONE = 'Your mobile number is verified!';

export const VERIFIED_CODE = 'Your invite code is verified!';

export const NOT_VERIFIED_PHONE = `Your mobile number isn't verified!`;

export const INVALID_CARD_COUNTRY = 'Country code on card must be australian only';

export const INVALID_CARD_EXPIRE_DATE = 'Card expiration date must not be less then 12 weeks';

export const PAYMENT_CUSTOMER_NOT_FOUND = `You don't have card added.`;

export const CARD_NOT_FOUND = 'This card was not found.';

export const CARD_UPDATE_ERROR = 'There was an error while updating card information.';

export const CC_VALID_COUNTRY_CODE = 'AU';

export const EMAIL_SENDING_ERROR = 'There was an error while sending the message.';

export const INVALID_MAIL_TOKEN = 'Your token is invalid.';

export const EXPIRED_MAIL_TOKEN = 'Expired token date.';

export const NOT_AUTH_BOOKING = `This booking doesn't authorized.`;

export const TOKEN_REMOVE_ERROR = 'There was an error while removing the token.';

export const INVALID_ID_VERIFICATION_MESSAGE = 'Please check that your details are correct and try again.';

export const EQUIFAX_REQUEST = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:vh="http://vedaxml.com/soap/header/v-header-v1-10.xsd" xmlns:ved="http://vedaxml.com/vxml2/vedascore-apply-v2-0.xsd">
   <soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
      <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
         <wsse:UsernameToken>
            <wsse:Username>EQUIFAX_USERNAME</wsse:Username>
            <wsse:Password>EQUIFAX_PASSWORD</wsse:Password>
         </wsse:UsernameToken>
      </wsse:Security>
       <wsa:To>http://vedaxml.com/sys2/vedascore-apply-v2-0</wsa:To>
      <wsa:Action>http://vedaxml.com/vedascore-apply/EnquiryRequest</wsa:Action>
   </soapenv:Header>
   <soapenv:Body>
      <ved:request>
         <ved:enquiry-header>
            <ved:client-reference>Client-Ref</ved:client-reference>
            <ved:operator-id>I1N3</ved:operator-id>
            <ved:operator-name>John Doe</ved:operator-name>
            <ved:permission-type-code>XY</ved:permission-type-code>
            <ved:product-data-level-code>N</ved:product-data-level-code>
            <ved:requested-scores>
            <ved:scorecard-id>VSA_2.0_XY_NR</ved:scorecard-id>
            </ved:requested-scores>
         </ved:enquiry-header>
         <ved:enquiry-data>
            <ved:individual>
               <ved:current-name>
                  <ved:title>EQUIFAX_CUSTOMER_TITLE</ved:title>
                  <ved:family-name>EQUIFAX_CUSTOMER_SURNAME</ved:family-name>
                  <ved:first-given-name>EQUIFAX_CUSTOMER_FIRSTNAME</ved:first-given-name>
                  <ved:other-given-name>EQUIFAX_CUSTOMER_OTHERNAME</ved:other-given-name>
               </ved:current-name>
               <ved:addresses>
                  <ved:address type="C" time-at-address="180">
                     <ved:street-number>EQUIFAX_CUSTOMER_ADDRESS_STREET_NUMBER</ved:street-number>
                     <ved:street-name>EQUIFAX_CUSTOMER_ADDRESS_STREET_NAME</ved:street-name>
                     <ved:street-type>EQUIFAX_CUSTOMER_ADDRESS_STREET_TYPE</ved:street-type>
                     <ved:suburb>EQUIFAX_CUSTOMER_ADDRESS_SUBURB</ved:suburb>
                     <ved:state>EQUIFAX_CUSTOMER_ADDRESS_STATE</ved:state>
                     <ved:country-code>EQUIFAX_CUSTOMER_ADDRESS_COUNTRY_CODE</ved:country-code>
                  </ved:address>
               </ved:addresses>
               <ved:gender-code>M</ved:gender-code>
               <ved:employment>
                  <ved:employer type="C">
                     <ved:name>VEDA</ved:name>
                  </ved:employer>
               </ved:employment>
            </ved:individual>
            <ved:enquiry>
               <ved:account-type-code>RM</ved:account-type-code>
               <ved:enquiry-amount currency-code="AUD">1000</ved:enquiry-amount>
               <ved:relationship-code>1</ved:relationship-code>
               <ved:enquiry-client-reference>TEST1</ved:enquiry-client-reference>
            </ved:enquiry>
         </ved:enquiry-data>
      </ved:request>
   </soapenv:Body>
</soapenv:Envelope>`;

export const MAILCHIMP_SEARCH_EMAIL_REGEX = /[^.]*$/;
