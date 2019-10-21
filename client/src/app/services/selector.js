import AuthUserSelector from '../modules/auth-user/AuthUserSelector';
import AuthMerchantSelector from '../modules/auth-merchant/AuthMerchantSelector';

export default (state, all = true, modules = []) => {
    if (all) {
        return {
            ...AuthUserSelector(state),
            ...AuthMerchantSelector(state),
            loadingData: state.get('loadingData'),
            card: state.get('card'),
            customerData: state.get('customerData'),
            subscriptionData: state.get('subscriptionData'),
            merchantData: state.get('merchantData'),
            bookingData: state.get('bookingData'),
            bankstatementsData: state.get('bankstatementsData')
        };
    }

    let stateInProps = {};

    if (modules.includes('auth-user')) {
        stateInProps = Object.assign({}, stateInProps, { ...AuthUserSelector(state) });
    }

    if (modules.includes('auth-merchant')) {
        stateInProps = Object.assign({}, stateInProps, { ...AuthMerchantSelector(state) });
    }

    if(modules.includes('payment')) {
        stateInProps = Object.assign({}, stateInProps, { card: state.get('card') });
    }

    if(modules.includes('customer')) {
        stateInProps = Object.assign({}, stateInProps, { customerData: state.get('customerData') });
    }

    if(modules.includes('subscription')) {
        stateInProps = Object.assign({}, stateInProps, { subscriptionData: state.get('subscriptionData') });
    }

    if(modules.includes('invoice')) {
        stateInProps = Object.assign({}, stateInProps, { invoiceData: state.get('invoiceData') });
    }

    if(modules.includes('booking')) {
        stateInProps = Object.assign({}, stateInProps, { bookingData: state.get('bookingData') });
    }

    if(modules.includes('bankstatements')) {
        stateInProps = Object.assign({}, stateInProps, { bankstatementsData: state.get('bankstatementsData') });
    }

    if (modules.includes('loading')) {
        stateInProps = Object.assign({}, stateInProps, { loadingData: state.get('loadingData') });
    }

    return stateInProps;
};
