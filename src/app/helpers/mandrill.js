import params from '../configs/params';
import mandrill from 'mandrill-api/mandrill';
import { MERCHANT_ENUM } from '../configs/messages';
import { each } from 'lodash';
import { RollbarService } from '../services';
import moment from 'moment';

const apiKey = params.mandrill.apiKey;
const fromEmail = params.appEmail;
const fromName = 'The Holipay team';
const mandrillClient = new mandrill.Mandrill(apiKey);

class Mandrill {
    signUp = {
        name: 'signup-email',
        subject: 'Sign Up',
        path: 'sign-up/'
    };
    customerWelcome = {
        name: 'welcome-email',
        subject: 'Welcome',
        path: 'welcome-email/'
    };
    resetPassword = {
        name: 'password-reset-email',
        role: 'Customer',
        subject: 'Reset your Holipay password',
        path: 'password-reset/confirm'
    };
    verification = {
        name: 'verification-mail',
        subject: 'Your Holipay account is verified',
        path: 'customer-dashboard/'
    };
    verificationFailed = {
        name: 'verification-failed-mail',
        subject: 'Your Holipay account wasn\'t verified',
        path: 'identity-verification/'
    };
    treeDaysReminder = {
        name: '3-day-payment-reminder',
        subject: 'Three days payment reminder'
    };
    merchantResetPassword = {
        name: 'password-reset-email',
        role: 'Merchant',
        subject: 'Reset your Holipay password',
        path: 'merchant-password-reset/confirm'
    };
    merchantCreateBooking = {
        name: 'create-booking',
        role: 'Merchant',
        subject: 'New Booking was created',
        path: 'order/review-booking'
    };
    referral = {
        name: 'referral-email',
        role: 'Customer',
        subject: 'Holipay Invite',
        path: 'referral-email'
    };

    merchantBookingApproval = {
        name: 'booking-approved',
        role: 'Merchant',
        subject: 'Booking Approved',
        path: 'merchant-log-in'
    };

    constructor() {}

    getMessage(user, url, template, obj, token = null) {
        if (!user.name) {
            user.name = user.email;
        }
        let attachments = [];
        if(obj && obj.uploaded && obj.uploaded.length) {
            each(obj.uploaded, doc => {
                attachments.push({
                    type: doc.type,
                    name: doc.name,
                    content: doc.file.split(',')[1]
                });
            });
        }
        let businessName,
            merchantReference,
            customerEmail,
            planName,
            totalPaidToDate,
            totalBookingCost,
            finalPaymentDate,
            merchantName,
            totalCharged,
            baseValue,
            surcharge,
            weeklyPrice,
            bookingId,
            totalAmount,
            paymentMethod,
            currentPaymentDate,
            nextPaymentDate,
            subscriptionId,
            amountDue;
        if (obj) {
            businessName = obj.businessName || '';
            merchantReference = obj.merchantReference || '';
            customerEmail = obj.customerEmail || '';
            merchantName = obj.merchantName || '';
            planName = obj.plan_name || '';
            subscriptionId = obj.subscription_id || '';

            finalPaymentDate = moment(obj.lastPaymentDate, 'MMM Do YYYY').format('DD/MM/YYYY') || '';
            currentPaymentDate = moment(obj.currentPaymentDate).format('DD/MM/YYYY') || '';
            nextPaymentDate = moment(obj.next_billing_date).format('DD/MM/YYYY') || '';
            surcharge = `${obj.surcharge}%` || '';
            totalPaidToDate = `${obj.total_paid_to_date}` || '';
            totalBookingCost = `${obj.total_booking_cost}` || '';
            amountDue = `${obj.amount_due}` || '';
            totalCharged = `${obj.totalCharged}` || '';
            baseValue = `${obj.baseValue}` || '';
            weeklyPrice = `${obj.weeklyPrice}` || '';
            bookingId = `${obj.bookingId}` || '';
            totalAmount = `${obj.totalAmount}` || '';
            paymentMethod = `${obj.paymentMethod}` || '';
        }

        let toList = [{ email: user.email, type: 'to' }];

        // Send a copy to Holipay for welcome email
        if(template.name === this.customerWelcome.name || template.name === this.referral.name) {
            toList.push({ email: 'info@holipay.com.au', type: 'bcc' });
        }

        let message = {
            subject: template.subject,
            from_email: fromEmail,
            from_name: fromName,
            to: toList,
            return_path_domain: null,
            merge: true,
            merge_language: 'mailchimp',
            merge_vars: [{
                rcpt: user.email,
                vars: [
                    { name: 'NAME', content: user.name },
                    { name: 'BTN_URL', content: !token ? `${url}/${template.path}` : `${url}/${template.path}/${token}` },
                    { name: 'ROLE', content: template.role },

                    // Create booking template
                    { name: 'BUSINESS_NAME', content: businessName },
                    { name: 'MERCHANT_REFERENCE', content: merchantReference },
                    { name: 'MERCHANT_NAME', content: merchantName },
                    { name: 'BASE_VALUE', content: baseValue },
                    { name: 'SURCHARGE', content: surcharge },
                    { name: 'TOTAL_CHARGED', content: totalCharged },
                    { name: 'FINAL_PAYMENT_DATE', content: finalPaymentDate },
                    { name: 'CUSTOMER_EMAIL', content: customerEmail },

                    // Booking approved
                    { name: 'BOOKING_ID', content: bookingId },
                    { name: 'TOTAL_AMOUNT', content: totalAmount },
                    { name: 'PAYMENT_METHOD', content: paymentMethod },
                    { name: 'WEEKLY_PRICE', content: weeklyPrice },
                    { name: 'CURRENT_PAYMENT_DATE', content: currentPaymentDate },
                    
                    // 3 days Mail Reminder template
                    { name: 'NEXT_PAYMENT_DATE', content: nextPaymentDate },
                    { name: 'TRANSACTION_ID', content: subscriptionId },
                    { name: 'TOTAL_BOOKING_COST', content: totalBookingCost },
                    { name: 'TOTAL_PAID_TO_DATE', content: totalPaidToDate },
                    { name: 'AMOUNT_DUE', content: amountDue },
                    { name: 'PLAN_NAME', content: planName }
                ]
            }],
            tags: [template.name],
            attachments,
        };

        // Duplicating the vars for the holipay email as well.
        if(toList.length > 1 && toList[1].email === 'info@holipay.com.au') {
            message.merge_vars.push({ rcpt: toList[1].email, vars: message.merge_vars[0].vars });
        }

        return message;
    }

    sendWelcomeEmailToCustomer(user, url) {
        const message = this.getMessage(user, url, this.customerWelcome);

        return new Promise((resolve, reject) => {
            mandrillClient.messages.sendTemplate({
                template_name: this.customerWelcome.name,
                template_content: [],
                message
            }, (result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
        });

    }

    sendReferralEmailToFriend(user, url) {
        const message = this.getMessage(user, url, this.referral);

        return new Promise((resolve, reject) => {
            mandrillClient.messages.sendTemplate({
                template_name: this.referral.name,
                template_content: [],
                message
            }, (result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
        });
    }

    sendEmailNotFoundMail(email, url) {
        const message = this.getMessage({ email }, url, this.signUp);

        return new Promise((resolve, reject) => {
            mandrillClient.messages.sendTemplate({
                template_name: this.signUp.name,
                template_content: [],
                message
            }, (result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
        });

    }

    sendResetPasswordMail(user, url, token, role) {
        let message;

        if (role === MERCHANT_ENUM) {
            message = this.getMessage(user, url, this.merchantResetPassword, null, token);
        } else {
            message = this.getMessage(user, url, this.resetPassword, null, token);
        }

        return new Promise((resolve, reject) => {
            mandrillClient.messages.sendTemplate({
                template_name: this.resetPassword.name,
                template_content: [],
                message
            }, (result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
        });
    }

    sendCreateBookingMail(user, url, booking, token) {
        const message = this.getMessage(user, url, this.merchantCreateBooking, booking, token);

        return new Promise((resolve, reject) => {
            mandrillClient.messages.sendTemplate({
                template_name: this.merchantCreateBooking.name,
                template_content: [],
                message
            }, (result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
        });
    }

    sendThreeDaysReminderMail(user, payment) {
        const message = this.getMessage(user, null, this.treeDaysReminder, payment);

        (async () => {
            await RollbarService.info({
                template_name: this.treeDaysReminder.name,
                fromEmail: fromEmail,
                fromName: fromName,
                toEmail: user.email,
                name: user.name,
                
                planName: payment.plan_name,
                nextPaymentDate: payment.next_billing_date,
                amountDue: payment.amount_due,
                totalBookingCost: payment.total_booking_cost,
                subscriptionId: payment.subscription_id
            });
        })();

        return new Promise((resolve, reject) => {
            mandrillClient.messages.sendTemplate({
                template_name: this.treeDaysReminder.name,
                template_content: [],
                message
            }, (result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
        });
    }

    sendVerificationMail(user, url) {

        const message = this.getMessage(user, url, this.verification);

        (async () => {
            await RollbarService.info({
                templateName: this.verification.name,
            });
        })();

        return new Promise((resolve, reject) => {
            mandrillClient.messages.sendTemplate({
                template_name: this.verification.name,
                template_content: [],
                message
            }, (result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
        });
    }

    sendVerificationFailedMail(user, url) {

        const message = this.getMessage(user, url, this.verificationFailed);

        (async () => {
            await RollbarService.info({
                templateName: this.verificationFailed.name
            });
        })();

        return new Promise((resolve, reject) => {
            mandrillClient.messages.sendTemplate({
                template_name: this.verificationFailed.name,
                template_content: [],
                message: message
            }, (result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
        });
    }

    sendMerchantApprovalMail(user, url, booking) {
        
        const message = this.getMessage(user, url, this.merchantBookingApproval, booking);
    
        (async () => {
            await RollbarService.info({
                templateName: this.merchantBookingApproval.name
            });
        })();
    
        return new Promise((resolve, reject) => {
            mandrillClient.messages.sendTemplate({
                template_name: this.merchantBookingApproval.name,
                template_content: [],
                message: message
            }, (result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
        });
    }
}

export default new Mandrill();
