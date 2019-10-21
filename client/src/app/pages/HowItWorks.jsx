import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { cloneDeep } from 'lodash';
import { Parallax } from 'react-parallax';
import { Sticky, StickyContainer } from 'react-sticky';
import Accordion from 'react-responsive-accordion';
import { selector } from '../services';
import { NavBar, Footer } from 'components/common';

const howItWorksState = {};

class HowItWorks extends React.Component {

    constructor(props) {
        super(props);

        this.state = cloneDeep(howItWorksState);
    }

    render() {
        return (
            <StickyContainer>
                <Parallax bgImage="/img/how-it-works/how-it-works-bg-header.jpg" strength={500}
                          bgWidth="100%"
                          bgHeight={(typeof window !== 'undefined' && window.innerWidth < 700) ? '100%' : 'auto'}>
                    <section id="hiw-header" className="hiw-header-section">
                        <Sticky disableCompensation={true}>
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

                                    return NavBar(style, distanceFromTop, 'howitworks');
                                }
                            }
                        </Sticky>
                        <h1 className="header__logotype header__hiw center-align hiw-container">Book
                            with our merchant partners and pay for it over 12 equal weekly
                            instalments</h1>
                        <h3 className="header__sublogotype center-align hiw-container">Booking with Holipay
                            is simple and easy.</h3>
                        <h3 className="header__sublogotype center-align hiw-container">There are no hidden
                            fees or interest, so the total you see at checkout is always what you'll actually pay.</h3>
                        <div className="header__icon-scrolldown"/>
                    </section>
                </Parallax>
                <section id="edge" className="f-section ptb-0">
                    <div className="container">
                        <div className="row" style={{ paddingTop: '50px' }}>
                            <div className="col-sm-3 edge-block">
                                <img className="min-h-135" src="/img/holipay-sign-up.png"/>
                                <h4 className="edge-block__title mt-30">1. Sign up</h4>
                                <p className="edge-block__description">
                                    <Link to="/sign-up/">Create your account</Link>
                                </p>
                                <img src="/img/holipay-right-arrows.png" className="edge-block-right-arrows"/>
                            </div>
                            <div className="col-sm-3 edge-block">
                                <span className="m-feature_icon">
                                    <i className="hp-icon-placeholder" />
                                </span>
                                <h4 className="edge-block__title">2. Book</h4>
                                <p className="edge-block__description">
                                    <span>Holipay up to $3,000 of your holiday's value.</span>
                                </p>
                                <img src="/img/holipay-right-arrows.png" className="edge-block-right-arrows"/>
                            </div>
                            <div className="col-sm-3 edge-block">
                                <span className="m-feature_icon">
                                    <i className="hp-icon-hand" />
                                </span>
                                <h4 className="edge-block__title">3. Travel</h4>
                                <p className="edge-block__description">
                                    <span>Once approved, we'll start your payment plan and you're ready to go!</span>
                                </p>
                                <img src="/img/holipay-right-arrows.png" className="edge-block-right-arrows" />
                            </div>
                            <div className="col-sm-3 edge-block">
                                <span className="m-feature_icon">
                                    <i className="hp-icon-bank-card" />
                                </span>
                                <h4 className="edge-block__title">4. Pay later</h4>
                                <p className="edge-block__description">
                                    <span>We'll schedule automatic payments for you, and remind you when they are due!</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="blog" className="f-section" style={{ padding: '40px 0' }}>
                    <div className="container blog">
                        <div className="row">
                            <div className="col-xs-12">
                                <h2 className="f-title" style={{ marginBottom: '30px' }}>How to book</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 margin-10">
                                <div className="col-sm-6">
                                    <h2 className="mt-0">1. Quickly create an account</h2>
                                    <p>Sign up with your email and add a debit or credit card as your payment method.</p>
                                </div>
                                <div className="col-sm-6">
                                    <img
                                        src="/img/how-it-works/how-to-book-1.jpg"
                                        data-rjs="2"
                                        alt="Work 1"
                                        className="grayscale width-400"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 margin-10">
                                <div className="col-sm-6 hidden-xs">
                                    <img
                                        src="/img/how-it-works/how-to-book-2.jpg"
                                        data-rjs="2"
                                        alt="Work 1"
                                        className="grayscale width-400"
                                    />
                                </div>
                                <div className="col-sm-6">
                                    <h2 className="mt-0">2. Visit one of our merchant partners</h2>
                                    <p>Choose Holipay at checkout as your payment option when you are ready to book.</p>
                                    <p>You can holipay up to $3,000 of your trip's value.</p>
                                    <p>
                                        <span>Check out our&nbsp;</span>
                                        <Link to="/travel-directory/">travel directory</Link>
                                        <span>&nbsp;to explore our merchant partners.</span>
                                    </p>
                                </div>
                                <div className="col-sm-6 visible-xs">
                                    <img
                                        src="/img/how-it-works/how-to-book-2.jpg"
                                        data-rjs="2"
                                        alt="Work 1"
                                        className="grayscale width-400"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 margin-10">
                                <div className="col-sm-6">
                                    <h2 className="mt-0">3. Instant approval and you're ready to go</h2>
                                    <p>Simply verify your purchase on your phone while you are in store.</p>
                                    <p>No more waiting around for approval!</p>
                                    <p>Nobody can make a purchase on your account without you knowing.</p>
                                </div>
                                <div className="col-sm-6">
                                    <img
                                        src="/img/how-it-works/how-to-book-3.jpg"
                                        data-rjs="2" alt="Work 1"
                                        className="grayscale width-400"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 margin-10">
                                <div className="col-sm-6 hidden-xs">
                                    <img
                                        src="/img/how-it-works/how-to-book-4.jpg"
                                        data-rjs="2"
                                        alt="Work 1"
                                        className="grayscale width-40"
                                    />
                                </div>
                                <div className="col-sm-6">
                                    <h2 className="mt-0">4. Pay later</h2>
                                    <p>We'll schedule automatic payments over 12 equal weekly instalments.</p>
                                    <p>We always remind you before your payments are due.</p>
                                    <p>We never charge you any interest or hidden fees.</p>
                                    <p>
                                        <span>There is a late fee of $30 when you miss a payment.&nbsp;</span>
                                        <span>However, we will contact you if a payment has been missed.</span>
                                    </p>
                                </div>
                                <div className="col-sm-6 visible-xs">
                                    <img
                                        src="/img/how-it-works/how-to-book-4.jpg"
                                        data-rjs="2"
                                        alt="Work 1"
                                        className="grayscale width-40"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 center-align">
                                <Link to="/sign-up/"
                                    className="f-btn f-btn_default f-btn_large f-color_white mt-0 hiw-ready-btn">I'M READY TO SIGNUP</Link>
                            </div>
                        </div>
                    </div>
                </section>
                <Parallax
                    bgImage="/img/how-it-works/how-it-works-bg-header.jpg"
                    strength={500}
                    bgWidth="100%"
                    bgHeight={(typeof window !== 'undefined' && window.innerWidth < 700) ? '100%' : 'auto'}>
                    <section id="works" className="f-section center-align" style={{ height: '400px' }}>
                        <div className="container works">
                            <div className="row">
                                <div className="col-xs-12 center-align">
                                    <span className="m-feature_icon" style={{ color: '#FFF' }}>
                                        <i className="hp-icon-shopping-card" />
                                    </span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <h3 className="f-color_white center-align" style={{ fontSize: '16px' }}>
                                        <span>Booking with Holipay is easy.&nbsp;</span>
                                    </h3>
                                    <h3 className="f-color_white center-align hiw-booking-text">
                                        <span>There are no hidden fees or interest charges, so the total you see at checkout is always what you'll actually pay.</span>
                                    </h3>
                                    <h3 className="f-color_white center-align hiw-booking-text">
                                        <span>After you book, we'll keep in touch and remind you of upcoming payments.</span>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </section>
                </Parallax>
                <section id="edge" className="f-section hiw-first-class-section">
                    <div className="container">
                        <div className="row" style={{ paddingTop: '50px' }}>
                            <div className="col-sm-4 edge-block">
                                <span className="m-feature_icon">
                                    <i className="hp-icon-check-lock" />
                                </span>
                                <h4 className="edge-block__title">First-class security</h4>
                                <p className="edge-block__description">
                                    <span>We care about safety. We prevent unauthorised use&nbsp;</span>
                                    <span>of your account and secure your personal information.</span>
                                </p>
                                <p>Read our <Link to="/security/">security policy</Link></p>
                            </div>
                            <div className="col-sm-4 edge-block">
                                <span className="m-feature_icon">
                                    <i className="hp-icon-shield" />
                                </span>
                                <h4 className="edge-block__title">Privacy</h4>
                                <p className="edge-block__description">
                                    <span>Your privacy is our concern. We securely&nbsp;</span>
                                    <span>store any details we need to maintain your account.</span>
                                </p>
                                <p>Read our <Link to="/privacy/">privacy policy</Link></p>
                            </div>
                            <div className="col-sm-4 edge-block">
                                <span className="m-feature_icon">
                                    <i className="hp-icon-hand" />
                                </span>
                                <h4 className="edge-block__title">Terms</h4>
                                <p className="edge-block__description">
                                    <span>We're on your side. Holipay was created with your interests at heart.</span>
                                </p>
                                <p>Read our <Link to="/terms-of-use/">terms of use</Link></p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 center-align">
                                <Link to="/about-us/"
                                    className="f-btn f-btn_default f-btn_large f-color_white hiw-learn-more-btn">LEARN MORE ABOUT THE COMPANY</Link>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="blog" className="f-section" style={{ backgroundColor: '#0adfff' }}>
                    <div className="container blog">
                        <div className="row">
                            <div className="col-xs-12">
                                <h2
                                    className="f-title f-color_purple"
                                    style={{ marginBottom: '30px' }}>Testimonials</h2>
                            </div>
                            <h3 className="f-color_purple hiw-what-people-text text-normal">
                                <span>What do the people have to say?</span>
                            </h3>
                        </div>
                        <div className="row" style={{ paddingTop: '30px' }}>
                            <div className="col-sm-3 col-sm-offset-2 first-testimonial">
                                <img
                                    src="/img/testimonial-1.jpg"
                                    className="img-circular reset-top center margin-bottom-20"
                                />
                                <p className="f-color_purple testimonial-text">
                                    <span>&ldquo;Holipay was so easy to use for our&nbsp;</span>
                                    <span>last-minute trip! I barely noticed the money coming out of my account and the&nbsp;</span>
                                    <span>payment reminders were fantastic!&rdquo;</span>
                                </p>
                                <small>
                                    <strong
                                        className="f-color_purple center-align font-18">Monique</strong>
                                </small>
                            </div>
                            <div className="col-sm-3 col-sm-offset-2">
                                <img src="/img/testimonial-2.jpg"
                                     className="img-circular reset-top center margin-bottom-20"
                                />
                                <p className="f-color_purple testimonial-text">
                                    <span>&ldquo;I always have enough money to fund&nbsp;</span>
                                    <span>my golf trips, but Holipay helps me manage my money better. I only have to pay a&nbsp;</span>
                                    <span>little each week instead of it all up front.&rdquo;</span>
                                </p>
                                <small>
                                    <strong
                                        className="f-color_purple center-align font-18">Trav</strong>
                                </small>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="blog" className="f-section">
                    <div className="container blog">
                        <div className="row">
                            <div className="col-xs-12">
                                <h2 className="f-title" style={{ marginBottom: '45px' }}>Speak to real people</h2>
                            </div>
                            <h3 className="f-color_purple hiw-speak-text">
                                <span>Our support team is based at Holipay HQ in Sydney,&nbsp;</span>
                                <span>ready to answer your questions and help out however we can.</span>
                            </h3>
                        </div>
                        <div className="row">
                            <Accordion>
                                <div data-trigger="Who can use Holipay?">
                                    <p>Any Australian citizen who is 18 years or older is eligible to use Holipay.</p>
                                </div>
                                <div data-trigger="What are my payment options?">
                                    <p>
                                        <span>Holipay currently offers one payment option, where you can pay off&nbsp;</span>
                                        <span>your holiday in 12 equal weekly payments from the date of booking.&nbsp;</span>
                                        <span>You do not have to pay off your holiday in full before you leave.</span>
                                    </p>
                                </div>
                                <div data-trigger="Do I have a limit with Holipay?">
                                    <p>
                                        <span>Holipay has a $3,000 limit for each booking. This may be lower for some customers&nbsp;</span>
                                        <span>depending on your circumstances. Our automated system considers a number of different factors.&nbsp;</span>
                                        <span>Each time you use Holipay, we are making a new, up-to-date decision and over time you&nbsp;</span>
                                        <span>will be able to spend more as long as you continue to repay your instalments on time.</span>
                                    </p>
                                </div>
                                <div data-trigger="Is there a cost to using Holipay?">
                                    <p>
                                        <span>Holipay charges a fee to our travel partners when you use the product,&nbsp;</span>
                                        <span>who may surcharge a portion of the fee on certain products.&nbsp;</span>
                                        <span>You’ll have to check with each merchant partner.</span>
                                    </p>
                                </div>
                                <div data-trigger="Which cards does Holipay accept?">
                                    <p>
                                        <span>Holipay currently accepts MasterCard and Visa credit and debit cards issued in&nbsp;</span>
                                        <span>Australia, and American Express credit and charge cards issued in Australia.&nbsp;</span>
                                        <span>Unfortunately, we do not accept any prepaid cards or foreign debit/credit cards.</span>
                                    </p>
                                </div>
                            </Accordion>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 center-align">
                                <Link to="/faqs/" className="f-btn f-btn_default f-btn_large f-color_white"
                                      style={{ width: '400px' }}>SEE MORE ANSWERS</Link>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer/>
            </StickyContainer>
        );
    }
}

const mapStateToProps = state => selector(state);

export default connect(mapStateToProps)(HowItWorks);
