import userData from '../modules/auth-user/AuthUserReducer';
import merchantData from '../modules/auth-merchant/AuthMerchantReducer';
import loadingData from '../modules/loading/LoadingReducer';
import card from '../modules/payment/PaymentReducer';
import subscriptionData from '../modules/subscription/SubscriptionReducer';
import invoiceData from '../modules/invoice/InvoiceReducer';
import bookingData from '../modules/booking/BookingReducer';
import bankstatementsData from '../modules/bankstatements/BankstatementsReducer';

import { combineReducers } from 'redux-immutable';

export default combineReducers({
    userData,
    merchantData,
    loadingData,
    card,
    subscriptionData,
    invoiceData,
    bookingData,
    bankstatementsData
});
