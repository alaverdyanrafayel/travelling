import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { cloneDeep } from 'lodash';
import { Parallax } from 'react-parallax';
import { Sticky, StickyContainer } from 'react-sticky';
import Slider from 'react-rangeslider';
import { selector } from '../services';
import { NavBar, Footer } from 'components/common';

const homeState = {
    sliderValue: 800,
    sliderMin: 0,
    sliderMax: 3000,
    sliderStep: 1,
    leftIcon: <i className="fa fa-arrow-left home-icon" aria-hidden="true" />,
    rightIcon: <i className="fa fa-arrow-right home-icon" aria-hidden="true" />
};

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = cloneDeep(homeState);
    }

    render() {

        return (
            <StickyContainer>
                <Parallax bgImage="/img/background-header.jpg" strength={500}
                          bgWidth="100%" bgHeight="800">
                    <section id="header">
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

                                    return NavBar(style, distanceFromTop, 'home');
                                }
                            }
                        </Sticky>
                        <h1 className="header__logotype center-align">
                            <span>Holiday now. Pay later.</span>
                        </h1>
                        <h3 className="header__sublogotype center-align">
                            <span>You can book your trip and pay for it over 12 equal weekly instalments.</span>
                        </h3>
                        <h3 className="header__sublogotype center-align">
                            <span>We never charge any interest.</span>
                        </h3>
                        <div className="header__icon-scrolldown center-align">
                            <a href="#edge" className="f-btn f-btn_default f-color_white menu__btn bg_transparent">LEARN MORE</a>
                        </div>
                    </section>
                </Parallax>
                <section id="edge" className="f-section slider-section">
                    <div className="row">
                        <div className="col-xs-12">
                            <h2 className="f-title f-color_purple mb-0">
                                <span>Plan your holiday</span>
                            </h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <h3 className="f-color_purple center-align" style={{ marginBottom: '40px' }}>
                                <span>What's your budget?</span>
                            </h3>
                        </div>
                    </div>
                    <div className="row slider-title-container">
                        <span className="slider-title col-xs-3 slider-left-label">$0</span>
                        <Slider
                            min={this.state.sliderMin}
                            max={this.state.sliderMax}
                            value={this.state.sliderValue}
                            format={() => this.state.sliderValue}
                            onChange={(value) => { this.setState({ sliderValue: value }); }}
                        />
                        <span className="slider-title col-xs-3 slider-right-label">$3,000</span>
                    </div>
                    <div className="row" style={{ textAlign: 'center' }}>
                        <div className="form_field col-xs-6">
                            <label>Weekly instalment</label>
                            <input
                                style={{ width: '140px' }}
                                className="square-text-box-white whenever-text"
                                type="text"
                                name="installments"
                                placeholder="$"
                                value={'$' + Math.ceil(this.state.sliderValue / 12)}
                                onChange={() => {}}
                            />
                        </div>
                        <div className="form_field col-xs-6">
                            <label>When can I leave?</label>
                            <input
                                disabled style={{ width: '140px' }}
                                className="square-text-box-white whenever-text"
                                type="text"
                                name="installments"
                                value="Whenever!"
                                onChange={() => {}}
                            />
                        </div>
                    </div>
                    <div className="row text-center">
                        <div className="col-xs-12">
                            <span className="f-color_purple">Who can I book with?</span>
                            <Link to="/sign-up/" className="f-btn f-btn_default f-btn_large f-color_white lets-go-btn">
                                <span>Let's go!</span>
                            </Link>
                        </div>
                    </div>
                </section>
                <section id="edge" className="f-section hiw-edge-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <h2 className="f-title f-color_purple" style={{ marginBottom: '10px' }}>
                                    <span>How it works</span>
                                </h2>
                                <h3 className="f-color_black header-subtitle">
                                    <span>Book your trip and pay for it over 12 equal weekly instalments.</span>
                                </h3>
                                <h3 className="f-color_black header-subtitle">
                                    <span>Just choose Holipay as your payment method at&nbsp;</span>
                                    <Link to="/travel-directory/">one of our partners</Link>
                                    <span>&nbsp;when you're ready to book.</span>
                                </h3>
                            </div>
                        </div>
                        <div className="container">
                        <div className="row" style={{ paddingTop: '50px' }}>
                            <div className="col-sm-3 edge-block">
                                <img className="min-h-135" src="/img/holipay-sign-up.png" />
                                <h4 className="edge-block__title mt-30">1. Sign up</h4>
                                <p className="edge-block__description">
                                    <Link to="/sign-up/">Create your account</Link>
                                </p>
                                <img src="/img/holipay-right-arrows.png" className="edge-block-right-arrows" />
                            </div>
                            <div className="col-sm-3 edge-block">
                                <span className="m-feature_icon lh-115">
                                    <i className="hp-icon-placeholder" />
                                </span>
                                <h4 className="edge-block__title mt-30">2. Book</h4>
                                <p className="edge-block__description">
                                    <span>Holipay up to $3,000 of your holiday's value.</span>
                                </p>
                                <img src="/img/holipay-right-arrows.png" className="edge-block-right-arrows" />
                            </div>
                            <div className="col-sm-3 edge-block">
                                <span className="m-feature_icon lh-115">
                                    <i className="hp-icon-hand" />
                                </span>
                                <h4 className="edge-block__title mt-30">3. Travel</h4>
                                <p className="edge-block__description">
                                    <span>Once approved, we'll start your payment plan and you're ready to go!</span>
                                </p>
                                <img src="/img/holipay-right-arrows.png" className="edge-block-right-arrows" />
                            </div>
                            <div className="col-sm-3 edge-block">
                                <span className="m-feature_icon lh-115">
                                    <i className="hp-icon-bank-card" />
                                </span>
                                <h4 className="edge-block__title mt-30">4. Pay</h4>
                                <p className="edge-block__description f-color_black">
                                    <span>We'll schedule automatic payments for you, and remind you when they are due!</span>
                                </p>
                            </div>
                        </div>
                        </div>
                    </div>
                </section>
                <section id="blog" className="f-section benifits-blog-section">
                    <div className="container blog">
                        <div className="row">
                            <div className="col-xs-12">
                                <h2 className="f-title">Benefits of using Holipay</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <span className="blog-post">
                                    <div className="blog-post__image">
                                        <img src="/img/how-it-works-1.jpg" data-rjs="2" alt="Blog Post" />
                                    </div>
                                    <p className="blog-post__description f-color_black">Unlike layby, we don't make you pay off all your instalments before you depart.</p>
                                    <p className="blog-post__description f-color_black">Snap up that last minute deal, or even book a trip a year in advance!</p>
                                </span>
                            </div>
                            <div className="col-sm-4">
                                <span className="blog-post">
                                    <div className="blog-post__image">
                                        <img src="/img/how-it-works-2.jpg" data-rjs="2" alt="Blog Post"/>
                                    </div>
                                    <p className="blog-post__description f-color_black">Why pay now, when you can pay later?</p>
                                    <p className="blog-post__description f-color_black">For example, a $1,200 trip becomes $100 a week for 12 weeks.</p>
                                    <p className="blog-post__description f-color_black">Easy choice!</p>
                                </span>
                            </div>
                            <div className="col-sm-4">
                                <span className="blog-post">
                                    <div className="blog-post__image">
                                        <img src="/img/how-it-works-3.jpg" data-rjs="2" alt="Blog Post"/>
                                    </div>
                                    <p className="blog-post__description f-color_black">
                                        <span>Holipay makes paying for those large holiday expenses as easy as possible.</span>
                                    </p>
                                    <p className="blog-post__description f-color_black">
                                        <span>Just sign up and book with Holipay at the checkout.</span>
                                    </p>
                                    <p className="blog-post__description f-color_black">
                                        <span>If you ever need help we're&nbsp;</span>
                                        <Link to="/contact-us/">here</Link>.</p>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="works" className="f-section">
                    <div className="container works">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="col-xs-12" style={{ padding: '0' }}>
                                    <h2 className="f-title f-color_purple book-with-holipay-text">
                                        <span>Book with Holipay in-store</span>
                                    </h2>
                                </div>
                                <h3 className="f-color_black book-with-holipay-sub-text text-normal">
                                    <span>If you want to pay with Holipay and we aren't partnered with your travel product provider,&nbsp;</span>
                                    let us know and we'll get in touch with them.</h3>
                                <div className="col-xs-12 our-partners-panel">
                                    <Link
                                        to="/travel-directory/"
                                        className="f-btn f-btn_default f-btn_large f-color_white our-partners-btn">
                                        <span>OUR PARTNERS</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <img src="/img/in-store-app.png" data-rjs="2" alt="Work 1" className="grayscale"/>
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
                            <h3 className="f-color_purple people-text text-normal">
                                <span>What do the people have to say?</span>
                            </h3>
                        </div>
                        <div className="row" style={{ paddingTop: '30px' }}>
                            <div className="col-sm-3 col-sm-offset-2 first-testimonial">
                                <img
                                    src="/img/testimonial-1.jpg"
                                    className="img-circular reset-top center"
                                    style={{ marginBottom: '20px' }}
                                />
                                <p className="f-color_purple testimonial-text">
                                    <span>&ldquo;Holipay was so easy to use for our&nbsp;</span>
                                    <span>last-minute trip! I barely noticed the money coming out of my account and the&nbsp;</span>
                                    <span>payment reminders were fantastic!&rdquo;</span>
                                </p>
                                <small>
                                    <strong
                                        className="f-color_purple center-align"
                                        style={{ fontSize: '18px' }}>Monique</strong>
                                </small>
                            </div>
                            <div className="col-sm-3 col-sm-offset-2 second-testimonial">
                                <img src="/img/testimonial-2.jpg"
                                     className="img-circular reset-top center"
                                     style={{ marginBottom: '20px' }}
                                />
                                <p className="f-color_purple testimonial-text">
                                    <span>&ldquo;I always have enough money to fund&nbsp;</span>
                                    <span>my golf trips, but Holipay helps me manage my money better. I only have to pay a&nbsp;</span>
                                    <span>little each week instead of it all up front.&rdquo;</span>
                                </p>
                                <small>
                                    <strong
                                        className="f-color_purple center-align"
                                        style={{ fontSize: '18px' }}>Trav</strong>
                                </small>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="blog" className="f-section">
                    <div className="container blog">
                        <div className="row">
                            <div className="col-xs-12">
                                <h2 className="f-title">Our vision</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <img src="/img/our-vision.png" data-rjs="2" alt="Work 1" className="grayscale" />
                            </div>
                            <div className="col-sm-6">
                                <p className="blog-post__description f-color_black">
                                  <b>No hidden costs in the fine print</b>
                                </p>
                                <p className="blog-post__description f-color_black">
                                  <span>We'll tell you from the get-go how everything works.</span>
                                </p>
                                <p className="blog-post__description f-color_black">
                                  <span>We'll also notify you when payments are due.</span>
                                </p>
                                <p className="blog-post__description f-color_black">
                                  <b>First-class security</b>
                                </p>
                                <p className="blog-post__description f-color_black">
                                  <span>We care about safety. We prevent unauthorised&nbsp;</span>
                                  <span>use of your account and secure your personal information.</span>
                                </p>
                                <p className="blog-post__description f-color_black">
                                  <b>We're on the same team</b>
                                </p>
                                <p className="blog-post__description f-color_black">
                                  <span>Travel is supposed to be fun.&nbsp;</span>
                                  <span>We'll help you make your awesome experience a reality.</span>
                                </p>
                                <p className="blog-post__description f-color_black">
                                  <span>If you need help with anything, we're&nbsp;</span>
                                  <Link to="/contact-us/">here</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </StickyContainer>
        );
    }
}

const mapStateToProps = state => selector(state);

export default connect(mapStateToProps)(Home);
