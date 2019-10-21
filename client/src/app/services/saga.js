import authUserSaga from '../modules/auth-user/AuthUserSaga';
import PaymentSaga from '../modules/payment/PaymentSaga';
import SubscriptionSaga from '../modules/subscription/SubscriptionSaga';
import authMerchantSaga from '../modules/auth-merchant/AuthMerchantSaga';
import InvoiceSaga from '../modules/invoice/InvoiceSaga';
import BookingSaga from '../modules/booking/BookingSaga';
import BankstatementsSaga from '../modules/bankstatements/BankstatementsSaga';

export default function*() {
    yield [
        authUserSaga(),
        PaymentSaga(),
        SubscriptionSaga(),
        authMerchantSaga(),
        InvoiceSaga(),
        BookingSaga(),
        BankstatementsSaga()
    ];
}
