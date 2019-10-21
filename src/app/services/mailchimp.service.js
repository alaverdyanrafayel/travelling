import { MailChimp } from '../helpers/mailchimp';

export class MailchimpService {
    
    static async addMember(user) {
        return await MailChimp.addMember(user);
    }
    
    static async updateMember(user) {
        let member = await MailChimp.searchMemberByEmail(user.email);
        
        return await MailChimp.updateMember(user, member.id);
    }
}
