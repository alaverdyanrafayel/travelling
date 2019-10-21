import Mandrill from '../helpers/mandrill';

export class MailService {

    static async sendEmailNotFoundMail(email, url) {
        return await Mandrill.sendEmailNotFoundMail(email, url);
    }

    static async sendResetPasswordMail(user, url, token, role) {
        return await Mandrill.sendResetPasswordMail(user, url, token, role);
    }

    static async sendCreateBookingMail(user, url, booking, token) {
        return await Mandrill.sendCreateBookingMail(user, url, booking, token);
    }

    static async sendThreeDaysReminderMail(user, payment) {
        return await Mandrill.sendThreeDaysReminderMail(user, payment);
    }

    static async sendVerificationMail(user, url) {
        return await Mandrill.sendVerificationMail(user, url);
    }

    static async sendWelcomeEmailToCustomer(user, url) {
        return await Mandrill.sendWelcomeEmailToCustomer(user, url);
    }

    static async sendReferralEmailToFriend(user, url) {
        return await Mandrill.sendReferralEmailToFriend(user, url);
    }

    static async sendVerificationFailedMail(user, url) {
        return await Mandrill.sendVerificationFailedMail(user, url);
    }

    static async sendMerchantApprovalMail(user, url, booking) {
        return await Mandrill.sendMerchantApprovalMail(user, url, booking);
    }
}
