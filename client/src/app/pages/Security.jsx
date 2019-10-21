import React from 'react';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import { Sticky, StickyContainer } from 'react-sticky';
import { selector } from '../services';
import { NavBar, Footer } from 'components/common';

const privacyState = {
    fields: {},
    errors: {},
};

export class Security extends React.Component {

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
                    <h2 className="container f-title f-color_purple center-align">Security</h2>
                </section>
                <section id="works" className="f-section">
                    <div className="container works">
                        <h3 className="f-color_purple">Your Data is Safe</h3>
                        <p>While using Holipay all data you send us is first encrypted on it's way to us, then all
                            sensitive information is stored using strong encryption techniques just like the other
                            services you trust like your online banking.</p>
                        <h3 className="f-color_purple">Great Defences</h3>
                        <p>Holipay uses secure servers and services and keep all communication between them protected
                            with encryption.</p>
                    </div>
                </section>
                <Footer/>
            </StickyContainer>
        );
    }
}

const mapStateToProps = state => selector(state);

export default connect(mapStateToProps)(Security);
