import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { clone, cloneDeep, isEqual } from 'lodash';
import { Parallax } from 'react-parallax';
import { Sticky, StickyContainer } from 'react-sticky';
import { isEmail, isEmpty } from 'validator';
import {
    INVALID_EMAIL,
    REQUIRED } from 'configs/constants';
import { selector } from '../services';
import converter from 'helpers/form/inputDetails';
import { Footer, NavBar } from 'components/common';
import { Form, FormGroup } from 'components/form-elements';
import params from 'configs/params';

const businessState = {
    fields: {
        FNAME: '',
        LNAME: '',
        EMAIL: '',
        PHONE: ''
    },
    errors: {
        FNAME: '',
        LNAME: '',
        EMAIL: '',
        PHONE: ''
    },
    loading: false,
    mailSuccess: false,
    leftIcon: <i className="fa fa-arrow-left" style={{ position: 'relative', top: '50%' }} aria-hidden="true"/>,
    rightIcon: <i className="fa fa-arrow-right" style={{ position: 'relative', top: '50%' }} aria-hidden="true"/>
};

export class Business extends React.Component {

    constructor(props) {
        super(props);
        this.state = cloneDeep(businessState);
    }

    changeValue() {
        // Implement Logic to change slider value.
    }

    componentDidMount = () => {
        if (this.props.location.query && this.props.location.query.mail === 'success') {
            this.setState({ mailSuccess: true });
        }
    };

    handleChange = (proxy) => {

        let { value, name } = proxy.target;

        let val = value;

        let newState = cloneDeep(this.state);

        newState.errors[name] = this.validate(name, value);
        newState.fields[name] = val;

        if (!isEqual(this.state, newState)) {
            this.setState(newState);
        }
    };

    handleSubmit = () => {
        const fields = clone(this.state.fields),
            errors = clone(this.state.errors);
        let validationErrors = {};
        Object.keys(fields).map(name => {
            const error = this.validate(name, fields[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            this.setState({ errors: validationErrors });

            return;
        }

        this.refs.submitbob.click();
    };

    validate(name, value) {
        switch (name) {
                case 'FNAME':
                    if (isEmpty(value)) {
                        return REQUIRED('First Name');
                    } else {
                        return '';
                    }
                case 'LNAME':
                    if (isEmpty(value)) {
                        return REQUIRED('Last Name');
                    } else {
                        return '';
                    }
                case 'EMAIL':
                    if (isEmpty(value)) {
                        return REQUIRED('Email');
                    } else if (!isEmail(value)) {
                        return INVALID_EMAIL('Email');
                    } else {
                        return '';
                    }
                case 'PHONE':
                    if (isEmpty(value)) {
                        return REQUIRED('Phone');
                    } else {
                        return '';
                    }
        }
    }

    render() {
        let inputs = [
            {
                name: 'FNAME',
                label: 'First name *',
                type: 'text',
                error: '',
                tooltip: 'First Name',
                colSize: 6,
                groupClass: 'mb-0'
            },
            {
                name: 'LNAME',
                label: 'Last name *',
                type: 'text',
                error: '',
                tooltip: 'Last Name',
                colSize: 6,
                groupClass: 'mb-0'
            },
            {
                name: 'EMAIL',
                label: 'Your email address *',
                type: 'email',
                error: '',
                colSize: 6,
                tooltip: 'Email Address',
                groupClass: 'mb-0'
            },
            {
                name: 'PHONE',
                label: 'Phone Number *',
                type: 'phone',
                error: '',
                tooltip: 'Phone Number',
                colSize: 6,
                groupClass: 'mb-0 phone-no'
            }
        ];

        inputs.map(input => input.error = converter(cloneDeep(this.state.errors), input.name));

        const loading = this.props.loadingData.get('loading');

        return (
            <StickyContainer>
                <Parallax bgImage="/img/business/background-header.jpg" strength={500}
                          bgWidth="100%" bgHeight="800">
                    <section id="header" style={{ height: '530px', paddingTop: '132px' }}>
                        <Sticky disableCompensation={true}>
                            {
                                ({ style, distanceFromTop }) => {
                                    if (distanceFromTop === undefined) {
                                        distanceFromTop = 0;
                                    }

                                    style.position = 'fixed';
                                    style.top = 0;
                                    style.width = '100%';
                                    style.transform = 'translateZ(0px)';
                                    style.left = 0;

                                    return NavBar(style, distanceFromTop, 'merchants');
                                }
                            }
                        </Sticky>
                        <h2 className="container f-title f-color_purple center-align pb-0">Offer your customers an instalment
                            plan while you get paid same business day. Holipay takes on all repayment risk.</h2>
                        <div className="container center-align">
                            <p className="header__sublogotype_business f-color_black">Holipay makes travel more
                                affordable which helps you sell bigger and better travel experiences</p>
                        </div>
                        <div className="header__icon-scrolldown center-align">
                            <Link to="/merchants/#contact" className="f-btn f-btn_default f-color_white menu__btn lets-go-btn"
                               style={{ marginTop: '145px' }}>CONTACT US</Link>
                        </div>
                    </section>
                </Parallax>
                <Parallax bgImage="/img/background-footer.jpg" strength={500}
                          bgWidth="100%" bgHeight="400">
                    <section id="works" className="f-section">
                        <div className="container works">
                            <div className="row" style={{ marginBottom: '40px' }}>
                                <div className="col-xs-12">
                                    <h2 className="f-title-no-line f-color_white">
                                        <b className="f-title-profits">Great for you and your customers</b>
                                    </h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4" style={{ textAlign: 'center' }}>
                                    <h2 className="f-title_mini f-color_white">Increase conversion</h2>
                                    <img src="/img/business/great-for-you-1.png" className="block-center" />
                                    <p className="f-color_white p-normal-text" style={{ padding: '20px' }}>Holipay reduces
                                        the barrier to sales by allowing customers to lock in their trip without having
                                        to pay up front.</p>
                                </div>
                                <div className="col-sm-4" style={{ textAlign: 'center' }}>
                                    <h2 className="f-title_mini f-color_white">Larger bookings</h2>
                                    <img src="/img/business/great-for-you-2.png" className="block-center" />
                                    <p className="f-color_white p-normal-text" style={{ padding: '20px' }}>Holipay allows
                                        your customers to pay later in manageable instalments, giving them significantly
                                        more spending power. This makes larger packages, upgrades or longer trips more
                                        justifiable.</p>
                                </div>
                                <div className="col-sm-4" style={{ textAlign: 'center' }}>
                                    <h2 className="f-title_mini f-color_white">Zero risk</h2>
                                    <img src="/img/business/great-for-you-3.png" className="block-center" />
                                    <p className="f-color_white p-normal-text" style={{ padding: '20px' }}>Holipay assumes
                                        the fraud and repayment risk for every transaction. Once the booking is
                                        approved by us, we pay you on the same business day.
                                        </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </Parallax>
                <section id="blog" className="f-section pb-0">
                    <div className="container blog">
                        <div className="row">
                            <div className="col-xs-12">
                                <h2 className="f-title container center-align">Big tech, small details</h2>
                                <p className="header__sublogotype_business f-color_black container center-align">Holipay
                                    is travel obsessed, so we designed our merchant dashboard to seamlessly integrate
                                    with your in-store, email and phone booking systems.</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <ul className="big-tech-block">
                                    <li>Enter the purchase information into the business dashboard.</li>
                                    <li>The customer will receive a purchase request that they'll verify and accept.</li>
                                    <li>Our proprietary transaction risk assessment processor will make an instant
                                        approval/decline decision.
                                    </li>
                                    <li>Holipay settles the amount with you. Your customer pays over time and they can
                                        leave whenever they like!
                                    </li>
                                </ul>
                            </div>
                            <div className="col-sm-6">
                                <img src="/img/business/mac-book.png" />
                            </div>
                        </div>
                    </div>
                </section>
                <section id="works" className="f-section">
                    <div className="container works">
                        <div className="row" style={{ marginBottom: '40px' }}>
                            <div className="col-xs-12"><h2 className="f-title-no-line f-color_purple">Features</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4 text-center">
                                <span className="m-feature_icon">
                                    <i className="hp-icon-help" />
                                </span>
                                <h2 className="f-title_mini f-color_black">Merchant support</h2>
                                <p className="f-color_black p-normal-text" style={{ padding: '20px' }}>Our
                                    Australian-based support team is always available to answer queries and help you
                                    integrate Holipay with your business.</p>
                            </div>
                            <div className="col-sm-4 text-center">
                                <span className="m-feature_icon">
                                    <i className="hp-icon-round-done-button" />
                                </span>
                                <h2 className="f-title_mini f-color_black">On-the-spot approvals</h2>
                                <p className="f-color_black p-normal-text" style={{ padding: '20px' }}>Finalise sales
                                    in-store with our industry-leading turnaround times.</p>
                            </div>
                            <div className="col-sm-4 text-center">
                                <span className="m-feature_icon">
                                    <i className="hp-icon-hand" />
                                </span>
                                <h2 className="f-title_mini f-color_black">Fraud protection</h2>
                                <p className="f-color_black p-normal-text" style={{ padding: '20px' }}>Holipay assumes
                                    chargeback and fraud risk, so you can focus on designing memorable travel
                                    experiences.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="blog" className="f-section" style={{ backgroundColor: '#0adfff' }}>
                    <div className="container blog">
                        <div className="row">
                            <div className="col-xs-12">
                                <h2 className="f-title f-color_purple" style={{ marginBottom: '30px' }}>Testimonials</h2>
                            </div>
                            <h3 className="f-color_purple text-center" style={{ fontSize: '20px' }}>What do the people have to say?</h3>
                        </div>
                        <div className="row" style={{ paddingTop: '30px' }}>
                            <div className="col-sm-3 col-sm-offset-2 first-testimonial">
                                <img src="/img/testimonial-1.jpg" className="img-circular reset-top center"
                                     style={{ marginBottom: '20px' }}/>
                                <p className="f-color_purple" style={{ fontSize: '18px', textAlign: 'center' }}>
                                    <span>&ldquo;Holipay was so easy to use for our last-minute trip! I barely noticed the money</span>
                                    <span>coming out of my account and the payment reminders were fantastic!&rdquo;</span>
                                </p>
                                <small>
                                    <strong className="f-color_purple center-align" style={{ fontSize: '18px' }}>Monique</strong>
                                </small>
                            </div>
                            <div className="col-sm-3 col-sm-offset-2">
                                <img src="/img/testimonial-2.jpg" className="img-circular reset-top center"
                                     style={{ marginBottom: '20px' }}/>
                                <p className="f-color_purple" style={{ fontSize: '18px', textAlign: 'center' }}>&ldquo;I
                                    always have enough money to fund my golf trips, but Holipay helps me manage my money
                                    better. I only have to pay a little each week, instead of it all up
                                    front.&rdquo;</p>
                                <small>
                                    <strong className="f-color_purple center-align" style={{ fontSize: '18px' }}>Trav</strong>
                                </small>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="contact" className="f-section">
                    <div className="container blog">
                        <div className="row">
                            <div className="col-xs-12">
                                <h2 className="f-title" style={{ marginBottom: '20px' }}>Find out more</h2>
                                <p className="header__sublogotype_business f-color_black">To add Holipay to your
                                    checkout, complete the form below and we'll be in touch within 24 hours.</p>
                            </div>
                        </div>
                        {!this.state.mailSuccess ? <div className="row">
                            <form ref="theform" action={params.mailchimp.postUrl} method="post" id="theform"
                                  name="theform" target="_self">
                                <Form
                                    inputs={inputs} fields={clone(this.state.fields)}
                                    noLabel eventHandler={this.handleChange}
                                />
                                <FormGroup groupClass="col-xs-12">
                                    <div className="col-sm-10 col-sm-offset-1 center-align">
                                        <button type="button" onClick={this.handleSubmit} name="submit"
                                                className="f-btn f-btn_default f-btn_large f-color_white">SUBMIT
                                        </button>
                                        <button id="submitbob" type="submit" name="submitbob" ref="submitbob"
                                                style={{ display: 'none' }}>submit details
                                        </button>
                                    </div>
                                </FormGroup>
                            </form>
                        </div> : <div className="row">
                            <h2>You have successfully subscribed. Please confirm your email by
                            clicking on the link sent to your email address.</h2>
                        </div>}
                    </div>
                </section>
                <Footer/>
            </StickyContainer>
        );
    }
}

const mapStateToProps = state => selector(state);

export default connect(mapStateToProps)(Business);
