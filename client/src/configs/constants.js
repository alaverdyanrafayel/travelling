export const NOTIFICATION_TYPES = [
    'danger', 'success', 'warning', 'info'
];

export const BUTTONS = {
    SIGN_UP: 'Sign up',
    SIGN_IN: 'Sign in',
    LOGIN: 'Login',
    FACEBOOK: 'Sign in with Facebook',
    LOG_OUT: 'Log out',
    FILTER: 'Filter',
    ME: 'Me'
};

export const DASHBOARD_PAGE_TEXT = {
    TITLE: 'you’re signed in',
    ACCESS_TOKEN: 'Your access token is:',
    REFRESH_TOKEN: 'Your refresh token is:'
};

export const LINKS = {
    FORGOT_PASS: 'Forgot your password?',
    DONT_HAVE_ACCOUNT: 'Dont have an account?'
};

export const SUPPORT_EMAIL = 'support@holipay.com';

export const INFO_EMAIL = 'info@holipay.com';

export const MERCHANT_VERIFICATION_FAILED = 'Merchant verification failed. Please try again.';

export const PASSWORD_NO_NUMBER = 'Password must contain atleast one number.';

export const BRAND = 'Welcome to Holipay';

export const ACTIVE = 'active';

export const DELETED = 'deleted';

export const SUCCESS = 'success';

export const INACTIVE = 'inactive';

export const BANNED = 'banned';

export const STATUS_PENDING = 'PENDING';

export const MAKE_CALLS = 'Let’s start making calls.';

export const PASSWORD_MIN_LENGTH = 8;

export const ACCESS_TOKEN = 'token';

export const APP_MAIN_ROUTE = '/';

export const APP_MERCHANT_ROUTE = '/merchants/';

export const TRAVEL_DIRECTORY_ROUTE = '/travel-directory';

export const CONFIRM_ORDER = '/order/confirm-order';

export const FAQS_ROUTE = '/faqs';

export const ORDER_REVIEW_ROUTE = '/order/review-booking/';

export const HOLIPAY_HELP_URL = 'http://help.holipay.com.au';

export const HOLIPAY_MEDIUM_URL = 'http://medium.com/holipay';

export const APP_MERCHANT_ENQUIRE_ROUTE = '/merchants/#contact';

export const HOW_IT_WORKS_ROUTE = '/how-it-works/';

export const ADD_CUSTOMER_ROUTE = '/add-customer/';

export const PAYMENT_METHODS = '/payment-methods/';

export const MAX_CARD_ERROR = 'You can only add total of 5 cards.';

export const SUCCESSFULLY_CREATED_CARD = 'Card created successfully.';

export const PAYMENT_UPDATED = 'Payment details updated successfully!';

export const CUSTOMER_DASHBOARD_ROUTE = '/customer-dashboard/';

export const MERCHANT_DASHBOARD_ROUTE = '/merchant-dashboard/';

export const CHECK_CARD = 'order/check-card';

export const REFUND = 'refund';

export const CAPTURE = 'capture';

export const BANK_STATEMENTS_CHECK_URL = 'order/bankstatements-check/';

export const EQUIFAX_CHECK_URL = 'order/equifax-check/';

export const MERCHANT_SIGNUP_ROUTE = '/merchant-sign-up/';

export const MERCHANT_SIGNIN_ROUTE = '/merchant-log-in/';

export const TRANSACTION_LOGIN_ROUTE = '/log-in/?mode=transaction&continue=/order/review-booking/';

export const LOGIN_ROUTE = '/log-in/';

export const ADD_MOBILE_VERIFICATION_ROUTE = '/mobile-verification/';

export const ADD_IDENTITY_VERIFICATION = '/identity-verification/';

export const SIGN_UP_ROUTE = '/sign-up/';

export const FORBIDDEN = 403;

export const NOT_FOUND = 404;

export const UNAUTHORIZED = 401;

export const VALIDATION_ERROR = 422;

export const BOOKING_ADDED = `Booking was successfully created.`;

export const BOOKING_ADDED_FAILED = `Failed to create booking. Please try again.`;

export const PASS_MIN_LENGTH = ( resource ) => `${resource} must be at least 8 characters!`;

export const REQUIRED = (resource) => `${resource} is required!`;

export const NUMBER_LETTER = (resource) => `${resource} requires at least one number and letter!`;

export const MATCHING_WITH_PASSWORD = (resource) => `${resource} differs from password!`;

export const PASSWORD_CHANGED_SUCCESS = 'Your password was changed successfully';

export const PENDING_MESSAGE = 'Your ID check is currently in progress. We will send you an email when your account is ready.';

export const PENDING = 'PENDING';

export const PASSED = 'PASSED';

export const FAILED = 'FAILED';

export const BANK_STATEMENTS_PASSED = 'Bankstatements check has passed.';

export const BANK_STATEMENTS_FAILED = 'Bankstatements check has failed.';

export const INVALID_EMAIL = resource => `${resource} is invalid!`;

export const INVALID_EMAIL_MSG = `Please enter a valid email.`;

export const INVALID_URL = resource => `${resource} is invalid URL!`;

export const INVALID_DATE = resource => `${resource} is invalid`;

export const INVALID_NUMBER = resource => `${resource} is invalid`;

export const INVALID_MOBILE_NUMBER = resource => `${resource} is invalid!`;

export const INVALID_SURCHARGE = resource => `Surcharge exceeds limit of ${resource}%`;

export const NEGATIVE_SURCHARGE = () => `Surcharge cannot be less than 0%`;

export const INVALID_BASE_VALUE = resource => `${resource} can't exceed $3000`;

export const IS_ALPHANUMERIC = (resource) => `${resource} should contain only letters and numbers!`;

export const INVALID_VERIFICATION_CODE = resource => `${resource} should contain only letters and numbers!`;

export const ALREADY_EXISTS = 'You already have an account. <a href="https://www.holipay.com.au/log-in/">Sign in here</a>';

export const PASSWORD_NOT_MATCHING = (resource) => `${resource} does not match password.`;

export const EXPIRATION_DATE_ERROR = 'Expiration date should be more than 12 weeks from now';

export const COUNTRY_ERROR = 'Your card is not an Australian';

export const FUNDING_ERROR = 'Your funding must be either credit or debit';

export const CC_VALID_COUNTRY_CODE = 'AU';

export const INITIAL_DOB_VALUE = '2000-01-01';

export const CC_VALID_FUNDING_TYPES = ['credit', 'debit'];

export const IDENTITY_PAGE_HEADER = 'Verify your Identity:';

export const IDENTITY_PAGE_DESCRIPTION = 'To proceed to identity verification, please press continue.';

export const GREEN_ID_CONFIG = 'https://simpleui-au.vixverify.com/df/javascripts/greenidConfig.js';

export const GREEN_UI_ID = 'https://simpleui-au.vixverify.com/df/javascripts/greenidui.min.js';

export const PIN_PAYMENT_URL = 'https://cdn.pinpayments.com/pin.v2.js';

export const EMAIL_SEND_MESSAGE = (resource) => `An email has been sent to <a href= "mailto: ${resource}" target="_top">${resource}</a> with further instructions.`;

export const GREEN_ID_UI = {
    FORM_ID: 'theform',
    FRAME_ID: 'greenid-div',
    COUNTRY: 'usethiscountry',
};

export const LENGTH_REQUIRED =
  (resource, options) => {
      const { min, max } = options;
      if (min && max) {
          return `${resource} must be at least ${min} and maximum ${max} characters!`;
      } else if (min) {
          return `${resource} must be at least ${min} characters!`;
      } else {
          return `${resource} must be maximum ${max} characters!`;
      }
  };

export const SSR_URLS = [
    '/',
    '/how-it-works/',
    '/merchants/',
    '/travel-directory/',
    '/faqs/',
    '/security/',
    '/privacy/',
    '/contact-us/',
    '/about-us/',
    '/terms-of-use/'
];
