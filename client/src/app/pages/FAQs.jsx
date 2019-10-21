import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Accordion from 'react-responsive-accordion';
import { Sticky, StickyContainer } from 'react-sticky';
import { selector } from '../services';
import { NavBar, Footer } from 'components/common';

class FAQs extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StickyContainer>
                <section id="travel-header">
                    <Sticky>
                        {
                            ({ style, distanceFromTop }) => {
                                if (distanceFromTop === undefined) {
                                    distanceFromTop = 0;
                                }

                                style.position = 'fixed';
                                style.top = '0px';
                                style.width = '100%';
                                style.transform = 'translateZ(0px)';
                                style.left = '0px';

                                return NavBar(style, distanceFromTop, 'merchants');
                            }
                        }
                    </Sticky>
                    <div className="header__icon-scrolldown" />
                </section>
                <div className="banner-sec">
                    <h1 className="header__logotype header__hiw center-align hiw-container f-color_purple">Frequently asked questions</h1>
                    <br/>
                    <div className="container">
                        <div className="row">
                            <h3 className="header__sublogotype f-color_purple" style={{ textAlign: 'left' }}>About Holipay</h3>
                            <Accordion startPosition={-1}>
                                <div data-trigger="What is Holipay?">
                                    <p>Holipay is a payment method for your travel purchases. Just choose to book with Holipay at one
                                        of our travel partners and you can pay off the purchase over 12 equal weekly instalments from
                                        the time of booking.</p>
                                </div>
                                <div data-trigger="How do I sign up for Holipay?">
                                    <p>Create a Holipay account at our <Link to="/sign-up/">signup</Link> page in just a few easy steps. When you have created
                                        your account, you’re able to use Holipay at one of our <Link to="/travel-directory/">travel partners</Link>.</p>
                                </div>
                                <div data-trigger="Who is eligible to use Holipay?">
                                    <p>Any Australian citizen or permanent resident who is 18 years or older is eligible to use Holipay. We verify your age
                                        with an Australian government-issued ID when you sign up.</p>
                                </div>
                                <div data-trigger="Are there any interest charges or fees associated with Holipay payment plans?">
                                    <p>
                                        <span>Holipay doesn’t charge any interest on purchases, establishment fees, account maintenance
fees, service fees or prepayment fees.&nbsp;</span>
                                        <span>However, Holipay charges a late fee of $30 for missed payments. If you miss three payments in a row, Holipay will suspend your account for new bookings and pause the direct debits.</span>
                                    </p>
                                </div>
                                <div data-trigger="What are my payment options?">
                                    <p>Holipay currently offers one payment option, where you can pay off your holiday in 12 equal
                                        weekly payments from the date of booking. You do not have to pay off your holiday in full before
                                        you leave.</p>
                                </div>
                                <div data-trigger="Do I have a limit with Holipay?">
                                    <p>Holipay has a $3,000 limit for each booking. This may be lower for some customers depending
                                        on your circumstances. Our automated system considers a number of different factors. Each
                                        time you use Holipay, we are making a new, up-to-date decision and over time you will be able
                                        to spend more as long as you continue to repay your instalments on time.</p>
                                </div>
                                <div data-trigger="Does Holipay perform a credit check?">
                                    <p>Yes, Holipay currently performs a credit check on certain transactions.</p>
                                </div>
                                <div data-trigger="Does Holipay report to credit bureaus?">
                                    <p>Holipay may choose to report missed payments, defaults or chargebacks to Equifax, but we will
                                        always give you the opportunity to correct a missed payment before we report your activity.</p>
                                </div>
                                <div data-trigger="Is there a cost to using Holipay?">
                                    <p>Holipay charges a fee to our travel partners when you use the product, who may surcharge a
                                        portion of the fee on certain products. You’ll have to check with each merchant partner.</p>
                                </div>
                                <div data-trigger="Is my personal information secure with Holipay?">
                                    <p>Yes, protecting your personal information is very important to us. We encrypt sensitive data and
                                        maintain physical, electronic, and procedural safeguards to protect your information. We will
                                        never sell or rent your information to anyone. You can read more about our Privacy Policy <Link to="/privacy/">here </Link>
                                         and our Security Policy <Link to="/security/">here</Link>.</p>
                                </div>
                            </Accordion>
                            <h3 className="header__sublogotype f-color_purple" style={{ textAlign: 'left' }}>Booking with Holipay</h3>
                            <Accordion startPosition={-1}>
                                <div data-trigger="How do I book with Holipay?">
                                    <p>
                                        <span>Holipay offers simple, transparent payment plans for your holiday in just a few clicks:<br/></span>
                                        <span>&nbsp;1. Create a Holipay account.<br/></span>
                                        <span>&nbsp;2. Book your holiday with one of our travel partners.<br/></span>
                                        <span>&nbsp;3. Select the Holipay payment option at the checkout.<br/></span>
                                        <span>&nbsp;4. If you have a Holipay account with a payment method attached, a decision is made instantly.<br/></span>
                                        <span>&nbsp;5. Pay for your holiday over 12 equal weekly instalments.<br/></span>
                                    </p>
                                </div>
                                <div data-trigger="Where can I book with Holipay?">
                                    <p>Visit, call or email one of our <Link to="/travel-directory/">travel partners</Link> and ask to book with Holipay at the checkout.</p>
                                </div>
                                <div data-trigger="Which cards does Holipay accept?">
                                    <p>Holipay currently accepts MasterCard and Visa credit and debit cards issued in Australia, and
                                        American Express credit and charge cards issued in Australia. Unfortunately, we do not accept
                                        any prepaid cards or foreign debit/credit cards.</p>
                                </div>
                                <div data-trigger="Can I still earn reward points with Holipay?">
                                    <p>Yes, you will earn rewards points as you would on any of your other card transactions.</p>
                                </div>
                                <div data-trigger="Why was my booking using Holipay not approved?">
                                    <p>To maintain Holipay's commitment to responsible spending, transaction decisions are made by taking into account multiple factors about your booking including, but not limited to:</p>
                                        <span>&nbsp;&#149;If you have sufficient funds available to pay the first instalment on the day of booking.<br/></span>
                                        <span>&nbsp;&#149;The amount of the booking.<br/></span>
                                        <span>&nbsp;&#149;Length of time you have been using Holipay.<br/></span>
                                        <span>&nbsp;&#149;The number of bookings you currently have 'open' with Holipay.<br/></span>
                                        <span>&nbsp;&#149;Whether your income will cease while overseas.<br/></span>
                                        <span>&nbsp;&#149;How far into your payment plan you leave for your trip.<br/></span>
                                        <span>&nbsp;&#149;The number of loans and/or other financial commitments you may have.<br/></span>
                                    <p>Unfortunately, Holipay can’t comment on why your particular booking was not approved, and all
                                        decisions are final.</p>
                                </div>
                                <div data-trigger="How do I check my transaction history?">
                                    <p>Sign in to your Holipay account dashboard and see your history of booking approvals, payments
                                        made on time, payments made late, payments overdue, and any late fees you may have
                                        incurred.</p>
                                </div>
                                <div data-trigger="How do I cancel my booking?">
                                    <p>Contact the travel company that you booked with to cancel your booking.</p>
                                </div>
                                <div data-trigger="How do I get a refund if I cancel my booking?">
                                    <p>
                                       <span>If you want to cancel your booking, contact your travel product provider. They will refund Holipay
the money, and we will return the payments that you have made to us, minus any cancellation
fees.&nbsp;</span>
                                        <span>Holipay does not charge any additional cancellation fees - any refunds or cancellations are
solely determined by the refunds and cancellation policy of your travel product provider.</span>
                                    </p>
                                </div>
                                <div data-trigger="What if I want to change part of my trip?">
                                    <p>Changes to you booking are subject to the policy of your travel product provider. Any additions
                                        to your booking will be treated as an independent transaction and assessed on an individual
                                        basis.</p>
                                </div>
                                <div data-trigger="How do I dispute a purchase on my Holipay account?">
                                    <p>Send an email to info@holipay.com.au or give us a call between 9am and 5pm and we will work
                                        with you to figure it out.</p>
                                </div>
                            </Accordion>
                            <h3 className="header__sublogotype f-color_purple" style={{ textAlign: 'left' }}>Making your payments</h3>
                            <Accordion startPosition={-1}>
                                <div data-trigger="When are my payments due?">
                                    <p>Your first payment is due on the day of booking, with each of the remaining payments due one
                                        week from the last payment.</p>
                                </div>
                                <div data-trigger="Are payments deducted automatically?">
                                    <p>
                                        <span>Yes, Holipay will automatically charge your nominated debit or credit card on the due date.&nbsp;<br/></span>
                                        <span>The scheduled payment dates can be seen in the confirmation email sent to you after your order
was approved, or by logging into your Holipay account.&nbsp;<br/></span>
                                        <span>To avoid late fees, simply ensure that you have sufficient funds available on the credit or debit
card used to ensure the scheduled payment is made successfully.</span>
                                    </p>
                                </div>
                                <div data-trigger="Will you send me payment reminders?">
                                    <p>Yes, we send you an email reminder three days before your next payment is due, and a text
                                        message reminder the day before your next payment is due.</p>
                                </div>
                                <div data-trigger="What happens if I don't pay one of my instalments?">
                                    <p>We’ll contact you if you miss a payment. If you don’t sort it out within 24 hours, Holipay
                                        will charge a $30 late fee.</p>
                                </div>
                                <div data-trigger="Can I pay off the rest of my instalments now?">
                                    <p>If you would like to pay off the rest of your instalments now, contact us and we’ll make your next
                                        instalment cover the rest of the amount owed.</p>
                                </div>
                                <div data-trigger="What if I need more time to pay my bill?">
                                    <p>You can contact us if you are having trouble meeting your weekly payments.</p>
                                </div>
                                <div data-trigger="I do not agree with an instalment amount. What should I do?">
                                    <p><Link to="/contact-us/">Contact us</Link> and we can help you figure out why the payment is different from what you
                                        expected.</p>
                                </div>
                                <div data-trigger="Are there any penalties for paying off my instalment plan early?">
                                    <p>Absolutely not - we are committed to supporting responsible spending habits. Paying off your balance early
                                        is a win-win.</p>
                                </div>
                            </Accordion>
                            <h3 className="header__sublogotype f-color_purple" style={{ textAlign: 'left' }}>Your Account</h3>
                            <Accordion startPosition={-1}>
                                <div data-trigger="Where can I review my Holipay account and purchases?">
                                    <p>You can review your Holipay account including recent bookings, upcoming payments and your
                                        total repayment history by signing in to your account dashboard.</p>
                                </div>
                                <div data-trigger="What are Holipay's Terms of Service?">
                                    <p>You can find our Terms of Service <Link to="/terms-of-use/">here</Link>.</p>
                                </div>
                                <div data-trigger="What is Holipay's privacy policy?">
                                    <p>You can find our Privacy Policy <Link to="/privacy/">here</Link>.</p>
                                </div>
                                <div data-trigger="How do I close my account?">
                                    <p>We’re working on allowing our users close their own accounts. At the moment, you’ll have to <Link to="/contact-us/">contact us</Link> and we can close it for you.</p>
                                </div>
                            </Accordion>
                        </div>
                        <hr/>
                    </div>
                    <br/>
                </div>
                <Footer/>
            </StickyContainer>
        );
    }
}

const mapStateToProps = state => selector(state);

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(FAQs);
