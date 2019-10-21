import params from '../configs/params';
import MailChimpApi from 'mailchimp-api-v3';
import { RollbarService } from '../services/rollbar.service';
import { MAILCHIMP_SEARCH_EMAIL_REGEX } from '../configs/messages';

const apiKey = params.mailchimp.apiKey;
const mailChimp = new MailChimpApi(apiKey);

const listId = params.mailchimp.listId;
const verifiedInterestId = params.mailchimp.verifiedInterestId;
const unverifiedInterestId = params.mailchimp.unverifiedInterestId;

export class MailChimp {

    constructor () {}

    /**
     * Search member in mailchimp by given email
     *
     * @param email
     */
    static searchMemberByEmail(email) {
        return mailChimp.get(`/search-members?query=${email.split(MAILCHIMP_SEARCH_EMAIL_REGEX)[0]}`)
                .then((result) => {
                    let member = '';

                    if (result) {
                        member = result.full_search.members[0];
                    }

                    (async () => {
                        await RollbarService.info({
                            member
                        });
                    })();

                    return member;
                })
                .catch((err) => {
                    (async () => {
                        await RollbarService.error(err.errors, err.message, null);
                    })();

                    return err;
                });
    }

    /**
     * Add a new member in mailchimp Master List under Non-verified Users group
     *
     * @param user
     */
    static addMember(user) {
        return mailChimp.post(`/lists/${listId}/members`, {
            email_address: `${user.email}`,
            status: 'subscribed',
            email_type: 'html',
            interests: {
                [unverifiedInterestId]: true
            }
        }).then((result) => {
            (async () => {
                await RollbarService.info({
                    email: user.email,
                    memberId: result.id,
                    interests: result.interests
                });
            })();

            return result;
        })
                .catch((err) => {
                    (async () => {
                        await RollbarService.error(err.errors, err.message, null);
                    })();

                    return err;
                });
    }

    /**
     * Update the member in mailchimp Master List and move from Non-verified Users group to Verified User group
     *
     * @param user
     * @param memberId
     */
    static updateMember(user, memberId) {
        let interests = {
            [verifiedInterestId]: true,
            [unverifiedInterestId]: false,
        };

        return mailChimp.patch(`/lists/${listId}/members/${memberId}`, {
            interests,
            merge_fields: {
                FNAME: `${user.firstName}`,
                LNAME: `${user.lastName}`,
            }
        }).then((result) => {
            (async () => {
                await RollbarService.info({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    memberId,
                    interests: result.interests
                });
            })();

            return result;
        })
                .catch((err) => {
                    (async () => {
                        await RollbarService.error(err.errors, err.message, null);
                    })();

                    return err;
                });
    }
}
