import React from 'react';
import { connect } from 'react-redux';
import { Parallax } from 'react-parallax';
import { Sticky, StickyContainer } from 'react-sticky';
import { selector } from '../services';
import { NavBar, Footer } from 'components/common';

class ContactUs extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StickyContainer>
                <Parallax bgImage="/img/how-it-works/how-it-works-bg-header.jpg" strength={500}
                          bgWidth="100%"
                          bgHeight={(typeof window !== 'undefined' && window.innerWidth < 700) ? '100%' : 'auto'}>
                    <section id="hiw-header h-330 pt-72">
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
                        <h1 className="header__logotype header__hiw center-align hiw-container">Contact us</h1>
                    </section>
                </Parallax>
                <section id="edge" className="f-section ptb-0">
                    <div className="container">
                        <div className="row" style={{ paddingTop: '50px' }}>
                            <div className="col-sm-12 edge-block">
                                <p className="center-align hiw-container f-color_purple" style={{ fontSize: '18px' }}>We're here to help</p>
                                <p className="center-align hiw-container">If you have any queries or need some assistance please feel free to use our chat box to get the fastest response from one of team members.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="blog" className="f-section">
                    <div className="container blog">
                        <div className="row">
                            <div className="col-sm-6 col-xs-12">
                                <div className="row">
                                    <div className="col-sm-6 col-xs-12">
                                        <span className="m-feature_icon pull-right color-cyan fz-85">
                                            <i className="hp-icon-send-mail" />
                                        </span>
                                    </div>
                                    <div className="col-sm-6 col-xs-12">
                                        <div className="f-title text-left fz-20">Send us an email:</div>
                                        <div>info@holipay.com.au</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-xs-12">
                                <div className="row">
                                    <div className="col-sm-6 col-xs-12">
                                        <span className="m-feature_icon pull-right fz-115 color-cyan">
                                            <i className="hp-icon-phone-call" />
                                        </span>
                                    </div>
                                    <div className="col-sm-6 col-xs-12">
                                        <div className="f-title text-left fz-20">Give us a call:</div>
                                        <div className="pull-left">+61 497 889 671</div>
                                    </div>
                                </div>
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

export default connect(mapStateToProps)(ContactUs);
