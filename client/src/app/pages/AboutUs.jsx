import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button } from 'reactstrap';
import { Parallax } from 'react-parallax';
import { Sticky, StickyContainer } from 'react-sticky';
import { selector } from '../services';
import { NavBar, Footer } from 'components/common';
import {
    APP_MERCHANT_ENQUIRE_ROUTE,
    HOW_IT_WORKS_ROUTE
} from 'configs/constants';

class AboutUs extends React.Component {

    constructor(props) {
        super(props);
    }

    onLearnMore = () => {
        this.props.router.push(HOW_IT_WORKS_ROUTE);
    };

    onEnquireHere = () => {
        this.props.router.push(APP_MERCHANT_ENQUIRE_ROUTE);
    };

    render() {
        return (
            <StickyContainer>
                <Parallax bgImage="/img/how-it-works/how-it-works-bg-header.jpg" strength={500}
                          bgWidth="100%"
                          bgHeight={(typeof window !== 'undefined' && window.innerWidth < 700) ? '100%' : 'auto'}>
                    <section id="hiw-header" style={{ height: '330px', paddingTop: '72px' }}>
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
                        <h1 className="header__logotype header__hiw center-align hiw-container header-about">Get to know us</h1>
                    </section>
                </Parallax>
                <section id="edge" className="f-section ptb-0">
                    <div className="container">
                        <div className="row pt-50">
                            <div className="col-sm-12 edge-block text-left">
                                <h3 className="f-color_purple text-center mb-50">What we're about</h3>
                                <p>Holipay is an easy way to book a holiday and spread the payment over 12 equal weekly instalments. An account is easy to open and is available through a variety of travel providers serving travellers online and in-store.</p>
                                <p>Holipay’s fees are clear and we don’t charge interest. And unlike traditional layby, you can take your holiday despite outstanding instalment payments.</p>
                                <p>Travel providers choose Holipay as we introduce new customers, increase conversion rates and increase the average ticket size. That boosts your bottom line without any additional effort, and you never have to worry about fraud and repayment risk, as we pay you on the same business day.</p>
                                <p>Traditional deferred payment providers do not means test their users. At Holipay, not analysing your customer’s ability to pay is considered irresponsible and reckless.Responsible spending is ingrained in our culture, and we make reasonable enquiries into an individual's ability to pay before every booking.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="blog" className="f-section">
                    <div className="container blog">
                        <div className="row">
                            <div className="col-sm-6 col-xs-12">
                                <div className="row text-center">
                                    <div className="col-xs-12">
                                        <span className="m-feature_icon fz-220">
                                            <i className="hp-icon-suitcase-slim" />
                                        </span>
                                    </div>
                                    <div className="col-xs-12">
                                        <div className="f-title" style={{ fontSize: '20px', marginTop: '20px' }}>Are you a traveller?</div>
                                        <Button className="btn-block about-us-btn mb-20" onClick={this.onLearnMore}>
                                            <span>LEARN MORE</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-xs-12">
                                <div className="row text-center">
                                    <div className="col-xs-12">
                                        <span className="m-feature_icon fz-220">
                                            <i className="hp-icon-growth" />
                                        </span>
                                    </div>
                                    <div className="col-xs-12">
                                        <div className="f-title" style={{ fontSize: '20px', marginTop: '20px' }}>Are you a merchant?</div>
                                        <Button className="btn-block about-us-btn"
                                                onClick={this.onEnquireHere}>
                                            <span>ENQUIRE HERE</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="f-section">
                    <div className="container">
                        <footer className="row">
                            <div className="col-md-4">
                                <h3 className="f-title font-23 mb-30">Important links</h3>
                                <p className="footer__info" style={{ paddingLeft: '100px' }}>
                                    <Link to="/terms-of-use/" className="footer-link">Terms of use</Link>
                                    <Link to="/privacy/" className="footer-link">Privacy Policy</Link>
                                    <Link to="/security/" className="footer-link">Security Policy</Link>
                                </p>
                            </div>
                            <div className="col-md-4">
                                <h3 className="f-title font-23">For Merchants</h3>
                                <p className="footer__info" style={{ paddingLeft: '109px' }}>
                                    Email: info@holipay.com.au<br/>
                                    Phone: +61 497 889 671
                                </p>
                            </div>
                            <div className="col-md-4">
                                <h3 className="f-title font-23">More</h3>
                                <p className="footer__info info-last" style={{ paddingLeft: '150px' }}>
                                  Registered address:<br/>
                                  24 Walenore Avenue<br/>
                                  Kingsford NSW 2032 Australia<br/>
                                  ABN: 30619238005
                                </p>
                            </div>
                        </footer>
                    </div>
                </section>
                <Footer/>
            </StickyContainer>
        );
    }
}

const mapStateToProps = state => selector(state);

export default connect(mapStateToProps)(AboutUs);
