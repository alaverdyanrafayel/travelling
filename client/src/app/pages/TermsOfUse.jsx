import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { cloneDeep } from 'lodash';
import { Sticky, StickyContainer } from 'react-sticky';
import { selector } from '../services';
import { NavBar, Footer } from 'components/common';

const privacyState = {
    fields: {},
    errors: {},
};

export class TermsOfUse extends React.Component {

    constructor(props) {
        super(props);
        this.state = cloneDeep(privacyState);
    }

    render() {
        return (
            <StickyContainer>
                <section id="header" style={{ height: '180px' }}>
                    <Sticky>
                      {
                        ({ style, distanceFromTop }) => {
                            if(distanceFromTop === undefined) {
                                distanceFromTop = 0;
                            }

                            style.position = 'fixed';
                            style.top = '0px';
                            style.width = '100%';
                            style.transform = 'translateZ(0px)';
                            style.left = '0px';

                            return NavBar(style,distanceFromTop,'merchants');
                        }
                      }
                      </Sticky>
                    <h2 className="container f-title f-color_purple center-align">Holipay Terms and Conditions</h2>
                </section>
                <section id="works" className="f-section">
                    <div className="container works">
                        <p>Thanks for using Holipay.</p>
                        <p>These terms and conditions constitute an agreement between you and Holipay Pty Ltd ABN 30 619
                            238 005 (“Holipay”, “we”, “us” and “our”) and contains the terms that govern your access to
                            and use of our deferred payment services, which enables you to book your holiday, have us
                            advance the cost of the holiday to the Merchant, and then spread your repayments for the
                            holiday over a period of time by repaying us in equal instalments, and includes the use of
                            our website (“the Services”). By opening an Account and using our Services, you agree to be
                            bound by the terms and conditions contained in this agreement.</p>
                        <h3 className="f-color_purple">1. Opening your Account</h3>
                        <p>To be eligible to open an Account and use our Services, you must: (a) be an individual who is
                            at least 18 years old; (b) be capable of entering into a legally binding contract; (c) have
                            a valid email address and mobile phone number; (d) have a valid delivery address; and (e)
                            have a valid debit or credit card and an Australian bank account.</p>
                        <p>In opening an Account, you agree to: (a) provide true, accurate, current and complete
                            information about yourself as prompted by the website’s registration form; and (b) maintain
                            and promptly update such information to keep it true, accurate, current and complete. If you
                            provide any information that is untrue, inaccurate, not current or incomplete, or we have
                            reasonable grounds to suspect that such information is untrue, inaccurate, not current or
                            incomplete, we have the right to suspend or terminate your Account and refuse any and all
                            current or future use of the Services.</p>
                        <p>We may decline to open your Account if: (a) you do not pass our identity check; (b) or we
                            reasonably consider it necessary to limit the risk of money laundering or terrorism
                            financing, fraud or any other breach of law.</p>
                        <p>You are responsible for maintaining and protecting the confidentiality of your login details,
                            which consists of your e-mail address and password. We are not responsible for any
                            unauthorised access and use of your Account unless we have failed to take reasonable steps
                            to prevent such access or use.</p>
                        <h3 className="f-color_purple">2. Bookings and payments</h3>
                        <h4 className="f-color_black">(a) Booking confirmation</h4>
                        <p>We will not advance any funds in respect of a Booking you make until that Booking has been
                            approved by us. We may choose not to approve your Booking or provide Services to you if:</p>
                        <ul style={{ listStyle: 'none' }}>
                            <li>(i) you do not pass our identity check and repayment assessment;</li>
                            <li>(ii) we reasonably suspect, or are aware, that you have breached this agreement;</li>
                            <li>(iii) we reasonably consider it necessary to limit the risk of money laundering or
                                terrorism financing, fraud or any other breach of law.
                            </li>
                        </ul>
                        <p>Once we approve your Booking, we will advance you the funds by paying the cost of the Booking
                            to the Merchant and you will receive an email from us confirming approval of the
                            Booking.</p>
                        <h3 className="f-color_purple">(b) Repayments</h3>
                        <p>You must repay to us the amount we advance in respect of a Booking. The amount must be repaid
                            in 12 equal weekly instalments (“Repayments”).</p>
                        <p>You must make your first Repayment to us on the same day you make a Booking. If you have an
                            existing Account with us, and we have previously approved one of your Bookings, we may allow
                            you to make your first Repayment to us 7 days after the date of your new Booking.</p>
                        <h3 className="f-color_purple">(c) Automatic Repayments</h3>
                        <p>You authorise us to process Repayments using the payment method details provided by you. You
                            will have the option to select your payment method when you create your Account. You must
                            provide us with details of your nominated debit or credit card when selecting your payment
                            method.</p>
                        <p>You are responsible for ensuring that you have sufficient funds in your nominated payment
                            method. If we are unable to process a Repayment for any reason, including but not limited
                            to, your nominated card being expired or cancelled or there being insufficient funds in the
                            account associated with your nominated card, you are liable for the late payment fee(s)
                            specified in clause 4(d) and any fees and charges imposed by your nominated card issuer.</p>
                        <p>Where we are unable to process a Repayment because of an error or failure in our systems, you
                            will not be liable for the late payment fee(s) specified in clause 4(d).</p>
                        <h3 className="f-color_purple">(d) Late payments</h3>
                        <p>If you fail to make any Repayment in relation to a Booking, we will charge you a $30 late
                            payment fee on your first and second late payments in relation to the same
                            Booking. If you fail to make a Repayment for a
                            third time, we may at our discretion terminate your Account and ban you from using our
                            Services. We will deduct any late payment fees payable from your nominated payment
                            method.</p>
                        <p>We do not charge you any interest, establishment fees, monthly account keeping fees or any
                            other fees for using our Services.</p>
                        <h3 className="f-color_purple">3. Identity checks and Repayment assessments</h3>
                        <p>You agree to provide us with any information or documentation we reasonably request to verify
                            your identity and assess your ability to make Repayments. You authorise us to make any
                            enquiries, either directly or through third parties, to verify your identity and assess your
                            ability to make payments in relation to all Bookings.</p>
                        <p>All information we collect about you, including information to verify your identity and
                            assess your ability to make payments will be collected, used and securely stored in
                            accordance with our <Link to="/privacy/">privacy policy</Link>.</p>
                        <h3 className="f-color_purple">4. Cancellations and refunds</h3>
                        <p>Any Booking cancellations are subject to the refund policy of the specific Merchant. We
                            accept no liability for any loss you suffer as a result of making a Booking which you
                            subsequently cancel where the Merchant refuses to refund you all or part of the fees for the
                            Booking. You remain liable to make your Repayments in respect of any Booking you have
                            cancelled, whether a refund is payable or not.</p>
                        <p>If you cancel a Booking and you are entitled to a refund but have not made all your
                            Repayments, the Merchant will pay the refund to us, and we will reduce the amount you owe us
                            by the amount of the refund. If the amount of the refund exceeds the amount you currently
                            owe us in respect of the cancelled Booking, we will refund the excess amount of the refund
                            to you. If you have made all your Repayments in relation to the cancelled Booking, the
                            Merchant will refund to you the full amount of the refund payable in accordance with the
                            Merchant’s refund policy.</p>
                        <h3 className="f-color_purple">5. Indemnity</h3>
                        <p>You agree to indemnify us in respect of any liability incurred by us for any loss, cost,
                            damage, or expense, arising under any theory of liability (including but not limited to
                            tort, statute, equity or contract), we suffer as a result of your negligent or wrongful acts
                            or omissions, or your breach of these terms or any other terms and conditions you agree to
                            prior to using our Services but only in the proportion that represents the extent to which
                            the loss, cost, damage or expense was caused by your negligent or wrongful acts or
                            omissions.</p>
                        <h3 className="f-color_purple">6. Limitation of liability</h3>
                        <p>To the maximum extent permitted by law, our liability to you for all claims arising out of or
                            in connection with this agreement shall not exceed the total value of your Booking,
                            regardless of whether the liability arises under any breach of contract, tort (including
                            negligence), or any other cause of action.</p>
                        <p>Neither party is liable to the other for any consequential or indirect loss including, but
                            not limited to, loss of profit, loss of accrued employment rights, lost opportunity cost,
                            loss of enjoyment.</p>
                        <h3 className="f-color_purple">7. No resale of Service</h3>
                        <p>You agree not to reproduce, duplicate, copy, sell, trade, resell or exploit for any
                            commercial purposes, any portion of the Service (including your Account), use of the
                            Service, or access to the Service.</p>
                        <h3 className="f-color_purple">8. Termination</h3>
                        <p>You agree that we may, under certain circumstances and without prior notice, immediately
                            terminate your Account and access to the Services. Cause for such termination shall include,
                            but not be limited to, (a) breaches or violations of this agreement or other incorporated
                            agreements or guidelines, (b) requests by law enforcement or other government agencies, (c)
                            a request by you (self-initiated account deletions), (d) discontinuance or material
                            modification to the Service (or any part thereof), (e) unexpected technical or security
                            issues or problems, and (f) extended periods of inactivity. Termination of your Account
                            includes (a) removal of access to all offerings within the Service, (b) removal of access to
                            the Account (or any part thereof), and (c) barring further use of the Service. Further, you
                            agree that all terminations for cause shall be made in our sole discretion and that we shall
                            not be liable to you or any third-party for any termination of your Account, any associated
                            email address, or access to the Service. </p>
                        <h3 className="f-color_purple">9. Our proprietary rights</h3>
                        <p>You acknowledge and agree that the Service and any necessary software used in connection with
                            the Service (“Software”) contain proprietary and confidential information that is protected
                            by applicable intellectual property and other laws. You further acknowledge and agree that
                            Content contained in sponsor advertisements or information presented to you through the
                            Service or advertisers is protected by copyrights, trademarks, service marks, patents or
                            other proprietary rights and laws. Except as expressly authorised by us or advertisers, you
                            agree not to modify, rent, lease, loan, sell, distribute or create derivative works based on
                            the Service or the Software, in whole or in part.</p>
                        <p>We grant you a personal, non-transferable and non-exclusive right and license to use our
                            Software provided that you do not (and do not allow any third party to) copy, modify, create
                            a derivative work of, reverse engineer, reverse assemble or otherwise attempt to discover
                            any source code, sell, assign, sublicense, grant a security interest in or otherwise
                            transfer any right in the Software. You agree not to modify the Software in any manner or
                            form, or to use modified versions of the Software, including (without limitation) for the
                            purpose of obtaining unauthorised access to the Service. You agree not to access the Service
                            by any means other than through the interface that is provided by us for use in accessing
                            the Service.</p>
                        <h3 className="f-color_purple">10. Disclaimer of Warranties</h3>
                        <p>You expressly understand and agree that:</p>
                        <ul style={{ listStyle: 'none' }}>
                            <li>(i) Your use of the Service is at your sole risk. The Service is provided on an “as is”
                                and “as available” basis. To the maximum extent permitted by law, we expressly disclaims
                                all warranties of any kind, whether express or implied, including, but not limited to
                                the implied warranties of merchantability and non-infringement.
                            </li>
                            <li>(ii) We makes no warranty that (i) the Service will meet your requirements, (ii) the
                                Service will be uninterrupted, timely, secure, or error-free, (iii) the quality of any
                                products, services, information, or other material purchased or obtained by you through
                                the Service will meet your expectations, and (iv) any errors in the Software will be
                                corrected.
                            </li>
                            <li>(iii) No advice or information, whether oral or written, obtained by you from us or
                                through or from the Service shall create any warranty not expressly stated in this
                                agreement.
                            </li>
                        </ul>
                        <h3 className="f-color_purple">11. Notices</h3>
                        <p>We may provide you with notices, including those regarding changes to this agreement, by
                            email or postings on the Service.</p>
                        <h3 className="f-color_purple">12. Trademarks</h3>
                        <p>The Holipay logo, trademarks and service marks and other Holipay logos and product and
                            service names (the “Holipay Marks”) are trademarks of Holipay Pty Ltd. You must not display
                            or use in any manner the Holipay Marks without our prior written consent.</p>
                        <h3 className="f-color_purple">13. Changes to terms and conditions</h3>
                        <p>We reserve the right to modify, update or otherwise alter the terms of this agreement. We
                            will notify you of any changes to the terms, including any changes to fees and charges, by
                            displaying the updated terms the first time you log into your Account after the change. Any
                            changes will apply to your next Booking, but will not apply to any Booking that has been
                            approved and which you are currently making payments for in accordance with a payment
                            schedule. If you are unhappy with any of the changes, you may terminate your agreement with
                            us immediately by closing your Account.</p>
                        <h3 className="f-color_purple">14. General Information</h3>
                        <p><b>Entire agreement</b> – This agreement constitutes the entire agreement between you and
                            Holipay and governs your use of the Service, superseding any prior agreements between you
                            and Holipay.</p>
                        <p><b>Choice of law and Forum</b> – This agreement and the relationship between you and Holipay
                            shall be governed by the laws of the State of New South Wales without regard to its conflict
                            of law provisions. You and Holipay agree to submit to the personal and exclusive
                            jurisdiction of the courts of New South Wales.</p>
                        <p><b>Waiver and severability of terms</b> – The failure of Holipay to exercise or enforce any
                            right or provision of this agreement shall not constitute a waiver of such right or
                            provision. If any provision of this agreement is found by a court of competent jurisdiction
                            to be invalid, the parties nevertheless agree that the court should endeavour to give effect
                            to the parties’ intentions as reflected in the provision, and the other provisions of this
                            agreement remain in full force and effect.</p>
                        <p><b>No right of survivorship and non-transferability</b> – You agree that your Account is
                            non-transferable and any rights to your Account or contents within your Account terminate
                            upon your death. Upon receipt of a copy of a death certificate, your Account may be
                            terminated and all funds transferred in accordance with the direction of your execution.</p>
                        <p><b>Statute of limitations</b> – You agree that regardless of any statute or law to the
                            contrary, any claim or cause of action arising out of or related to use of the Service or
                            this agreement must be filed within one (1) year after such claim or cause of action arose
                            or be forever barred.</p>
                        <p>The section titles in this agreement are for convenience only and have no legal or
                            contractual effect.</p>
                        <h3 className="f-color_purple">15. Definitions</h3>
                        <p>In this agreement, “Account” means the account you have opened with us to access and use the
                            Services. “Booking” means a request you submit to us to use our Services to pay for an
                            amount of a Holiday offered by a Merchant. “Holiday” means any flight, hotel room,
                            accommodation, cruise, tour or any other ticket, reservation or booking you make as part of
                            your holiday. “Merchant” means any travel agency, hotel provider, airline company or any
                            other holiday provider with whom we have a merchant agreement and through whom Holidays may
                            be purchased by you using our Services. </p>
                    </div>
                </section>
                <Footer/>
            </StickyContainer>
        );
    }
}

const mapStateToProps = state => selector(state);

export default connect(mapStateToProps)(TermsOfUse);
