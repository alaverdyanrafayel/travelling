import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { clear } from '../modules/auth-user/AuthUserActions';
import { NotFound } from 'components/core';
import reset from 'helpers/store/cleanReducers';
import * as Pages from '../pages/index';
import { ACCESS_TOKEN } from 'configs/constants';
import {
    userIsSet,
    checkLoggedIn,
    checkMerchantLoggedIn,
    getUser,
    mobileIsSet,
    customerIsSet,
    merchantIsSet,
    userIsActive,
    userIsInActive,
    signupIsPassed,
    merchantSignupIsPassed,
    hasPendingBooking,
    getBooking,
    bookingIsCharged,
    bankstatementIsPassed } from '../middlewares';
import { asyncComponent } from 'components/form-elements';


const IdentityVerification = asyncComponent(() =>
    import('../pages/IdentityVerification').then(module => module.default)
);
const scroll = (x, y) => (typeof window !== 'undefined') ? window.scroll(x, y) : '';
export const router = (store) => {

  const resetMiddleware = () => {

        scroll(0, 0);

        const reducers = ['userData', 'merchantData'];
        const cleaners = {
            'userData': {
                clear: clear
            },
            'merchantData': {
                clear: clear
            }
        };

        reset(reducers, cleaners, store);
    };

    const onEnterMiddleware = async (nextState, replace, cb) => {
      const path = nextState.location.pathname;
      //analytics.page('HOME', '');
        if (path.slice(-1) !== '/') {
            replace({
                ...nextState.location,
                pathname: path + '/'
            });
        }
        if (typeof(localStorage) !== 'undefined' && localStorage.getItem(ACCESS_TOKEN)) {
            await getUser(store);
        }
    
        scroll(0, 0);
        cb();
    };

    const checkLoggedInMiddleware = async (mextState, replace, cb) => {
        await checkLoggedIn(store);
        cb();
    };

    const checkMerchantLoggedInMiddleware = async (mextState, replace, cb) => {
        await checkMerchantLoggedIn(store);
        cb();
    };

    const userIsSetMiddleware = async (nextState, replace, cb) => {
        await userIsSet(store);
        await userIsActive(store);
        cb();
    };

    const customerIsSetMiddleware = async (nextState, replace, cb) => {
        await userIsSet(store);
        await userIsActive(store);
        await customerIsSet(store);
        cb();
    };

    const mobileIsSetMiddleware = async (nextState, replace, cb) => {
        await userIsSet(store);
        await userIsActive(store);
        await customerIsSet(store);
        await mobileIsSet(store);
        cb();
    };

    const signupIsPassedMiddleware = async (nextState, replace, cb) => {
        await signupIsPassed(store);
        cb();
    };

    const userIsInActiveMiddleware = async (nextState, replace, cb) => {
        const pattern = /^\/order\/review-booking/i;
        const { pathname } = nextState.location;
        const reviewBookingPage = pattern.test(pathname);
        const { id } = nextState.params;
        await userIsSet(store, reviewBookingPage, pathname, id);
        if(!reviewBookingPage) {
            await userIsInActive(store);
        }
        cb();
    };

    const customerHasPendingBooking = async (nextState, replace, cb) => {
        await userIsInActiveMiddleware(nextState, replace, cb);
        await hasPendingBooking();
        cb();
    };

    const merchantIsInActiveMiddleware = async (nextState, replace, cb) => {
        await merchantIsSet(store);
        cb();
    };

    const merchantSignupIsPassedMiddleware = async (nextState, replace, cb) => {
        await merchantSignupIsPassed(store);
        cb();
    };

    const trackAnalytics = async (nextState, replace, cb) => {
        cb();
    }

    const checkBookingIsChargedMiddleware = async (nextState, replace, cb) => {
        const { bookingId } = nextState.params;
        await getBooking(store, bookingId);
        await bookingIsCharged(store, bookingId);
        cb();
    };

    const checkBankstatementIsPassedMiddleware = async (nextState, replace, cb) => {
        const { bookingId } = nextState.params;
        await getBooking(store, bookingId);
        await bankstatementIsPassed(store, bookingId);
        cb();
    };
    
    return (
        <Route path="/" component={Pages.Layout} onEnter={onEnterMiddleware} onChange={resetMiddleware}>
            <IndexRoute component={Pages.Home} onEnter={trackAnalytics}/>
            <Route path="merchant-sign-up/" component={Pages.MerchantSignup} onEnter={merchantSignupIsPassedMiddleware}/>
            <Route path="sign-up/" component={Pages.Signup} onEnter={signupIsPassedMiddleware} />
            <Route path="merchants/" component={Pages.Business} onEnter={trackAnalytics}/>
            <Route path="how-it-works/" component={Pages.HowItWorks} onEnter={trackAnalytics}/>
            <Route path="faqs/" component={Pages.FAQs} onEnter={trackAnalytics}/>
            <Route path="security/" component={Pages.Security} onEnter={trackAnalytics}/>
            <Route path="privacy/" component={Pages.Privacy} onEnter={trackAnalytics}/>
            <Route path="contact-us/" component={Pages.ContactUs} onEnter={trackAnalytics}/>
            <Route path="about-us/" component={Pages.AboutUs} onEnter={trackAnalytics}/>
            <Route path="terms-of-use/" component={Pages.TermsOfUse} onEnter={trackAnalytics}/>
            <Route path="travel-directory/" component={Pages.TravelDirectory} onEnter={trackAnalytics}/>
            <Route path="log-in" component={Pages.LogIn} onEnter={checkLoggedInMiddleware} />
            <Route path="merchant-log-in/" component={Pages.MerchantLogIn} onEnter={checkMerchantLoggedInMiddleware} />
            <Route path="password-reset/" component={Pages.ResetPassword} />
            <Route path="password-reset/confirm/:token/" component={Pages.ResetPasswordConfirm} />
            <Route path="merchant-password-reset/"  component={Pages.MerchantResetPassword} />
            <Route path="merchant-password-reset/confirm/:token/" component={Pages.MerchantResetPasswordConfirm} />
            <Route component={Pages.CustomerLoggedInLayout}>
                <Route path="/customer-dashboard" onEnter={customerHasPendingBooking}>
                    <IndexRoute component={Pages.CustomerDashboard} />
                    <Route path="/payment-methods(/:cardId)/" component={Pages.PaymentMethods} />
                </Route>
                <Route path="order/" onEnter={userIsInActiveMiddleware} >
                    <Route path="review-booking(/:id)/" component={Pages.Review} onEnter={customerHasPendingBooking} />
                    <Route path="bankstatements-check/:bookingId/" component={Pages.BankStatementsCheck} onEnter={checkBankstatementIsPassedMiddleware} />
                    <Route path="confirm-order/:bookingId/" component={Pages.ConfirmOrder} onEnter={checkBookingIsChargedMiddleware} />                
                </Route>
                <Route path="add-customer/" component={Pages.AddCustomer} onEnter={userIsSetMiddleware}/>
                <Route path="mobile-verification/" component={Pages.MobileVerification} onEnter={customerIsSetMiddleware}/>
                <Route path="identity-verification/" component={IdentityVerification} onEnter={mobileIsSetMiddleware}/>
            </Route>
            <Route component={Pages.MerchantLoggedInLayout}>
                <Route path="/merchant-dashboard/" onEnter={merchantIsInActiveMiddleware}>
                    <IndexRoute component={Pages.MerchantDashboard} />
                    <Route path="/transaction-history/" component={Pages.TransactionHistory} />
                </Route>
            </Route>
            <Route path="*" component={NotFound} />
        </Route>
    );
};

export default router;
