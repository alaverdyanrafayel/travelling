import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Col, Row } from 'reactstrap';
import { isEmail, isEmpty, isLength } from 'validator';
import { clone, cloneDeep, isEqual } from 'lodash';
import { attemptSignIn } from '../modules/auth-user/AuthUserActions';
import converter from 'helpers/form/inputDetails';
import {
    LENGTH_REQUIRED,
    REQUIRED,
    PASSWORD_MIN_LENGTH,
    CUSTOMER_DASHBOARD_ROUTE,
    PASSWORD_NO_NUMBER,
    HOW_IT_WORKS_ROUTE,
    TRAVEL_DIRECTORY_ROUTE,
    FAQS_ROUTE,
    INVALID_EMAIL_MSG
} from 'configs/constants';
import { selector } from '../services';
import { Form, FormGroup } from 'components/form-elements';

const logInState = {
    fields: {
        email: '',
        password: '',
    },
    errors: {
        email: '',
        password: ''
    },
    loading: false
};

export class LogIn extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = cloneDeep(logInState);
    }
    
    redirectToOrderReview() {
        this.props.router.push(this.props.location.query.continue);
    }
    
    redirectToDashboard() {
        this.props.router.push(CUSTOMER_DASHBOARD_ROUTE);
    }
    
    goToHowItWorks() {
        window.open(HOW_IT_WORKS_ROUTE, '_blank');
    }
    
    goToTravelDirectory() {
        window.open(TRAVEL_DIRECTORY_ROUTE, '_blank');
    }
    
    goToFaqs() {
        window.open(FAQS_ROUTE, '_blank');
    }
    
    componentDidUpdate(prevProps) {
        
        const {userFields, userErrors, loggedInUser, userMessages} = this.props;
        
        if (!userFields.equals(prevProps.userFields) || !userErrors.equals(prevProps.userErrors)) {
            this.setState({
                errors: userErrors.toJS(),
                fields: userFields.toJS()
            });
        } else if (loggedInUser && this.props.router.location.query.mode === 'transaction') {
            this.redirectToOrderReview()
        } else if (loggedInUser) {
            this.redirectToDashboard();
        }
    }

    handleChange = ({ currentTarget: { name, value } }) => {
        let newState = cloneDeep(this.state);

        newState.errors[name] = this.validate(name, value);
        newState.fields[name] = value;

        if (!isEqual(this.state, newState)) {
            this.setState(newState);
        }
    };

    validate(name, value) {
        switch (name) {
                case 'email':
                    if (isEmpty(value)) {
                        return REQUIRED('Email');
                    } else if (!isEmail(value)) {
                        return INVALID_EMAIL_MSG;
                    } else {
                        return '';
                    }
                case 'password':
                    if (isEmpty(value)) {
                        return REQUIRED('Password');
                    } else if (!isLength(value, PASSWORD_MIN_LENGTH)) {
                        return LENGTH_REQUIRED('Password', { min: PASSWORD_MIN_LENGTH });
                    } else if (!/\d/.test(value)) {
                        return PASSWORD_NO_NUMBER;
                    } else {
                        return '';
                    }
        }
    }

    handleSubmit = (ev) => {
        ev.preventDefault();

        const { attemptSignIn } = this.props,
            data = clone(this.state.fields);

        let validationErrors = {};
        Object.keys(data).map(name => {
            const error = this.validate(name, data[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            this.setState({ errors: validationErrors });

            return;
        }

        attemptSignIn(data);
    };

    render() {
        let inputs = [
            {
                name: 'email',
                label: 'Email',
                type: 'email',
                error: 'test@gmail.com',
                tooltip: 'Email message',
                autoFocus: true
            },
            {
                name: 'password',
                label: 'Password',
                type: 'password',
                error: '',
                tooltip: 'password message'
            }
        ];

        inputs.map(input => input.error = converter(cloneDeep(this.state.errors), input.name));

        const loading = this.props.loadingData.get('loading');

        return (
            <div className="login-page">
                    <div className="mainWrapperSignIn">
                        <Row className="createAccountContent">
                            <div className="aboutHolipay col-xs-12">
                                <ul className="right-list">
                                    <h2 className="color-holi-blue font-35"><b>Welcome back!</b></h2>
                                    <li>&nbsp;Holipay allows you to pay for your holiday in 12 equal weekly
                                        instalments
                                    </li>
                                    <li>&nbsp;Leave whenever</li>
                                    <li>&nbsp;Instant purchase approval</li>
                                    <li>&nbsp;No sign up or account maintenance fees</li>
                                    <li>&nbsp;No interest</li>
                                    <li>&nbsp;We remind you before your payments</li>
                                </ul>
                                <div className="right-list-btn">
                                    <Button className="mc-btn btn-style-1 btn-block btn-signin"
                                            type="button"
                                            onClick={this.goToHowItWorks.bind(this)}>
                                        <span>How to book</span>
                                    </Button>
                                    <Button className="mc-btn btn-style-1 btn-block btn-signin"
                                            type="button"
                                            onClick={this.goToTravelDirectory.bind(this)}>
                                        <span>Travel Directory</span>
                                    </Button>
                                    <Button className="mc-btn btn-style-1 btn-block btn-signin"
                                            type="button"
                                            onClick={this.goToFaqs.bind(this)}>
                                        <span>FAQs</span>
                                    </Button>
                                </div>
                                <div className="right-opacity"/>
                            </div>
                            <div className="createAccount text-center pull-left col-xs-12 sign-in-box">
                                <form onSubmit={(ev) => this.handleSubmit(ev)} method="post">
                                    <img src="/img/holipay_pin.png" className="pin-class"/>
                                    <h2><b>Sign in</b></h2>
                                    <p>Need a Holipay account?</p>
                                    <Link to="/sign-up/">
                                        <p>Create an account</p>
                                    </Link>
                                    <Form
                                        inputs={inputs}
                                        fields={clone(this.state.fields)}
                                        eventHandler={this.handleChange}
                                        noLabel
                                    />
                                    <span
                                        className="error-text">{this.props.userMessages.size > 0 ? this.props.userMessages.toJS()[0].message : ''}</span>
                                    <FormGroup groupClass="form-submit-1 col-xs-12 login-form">
                                        <div className="col-sm-12 mt-15">
                                            <Button className="mc-btn btn-style-1 btn-block btn-signin"
                                                    type="submit"
                                                    onClick={this.handleSubmit}>
                                                <span>Sign in</span>
                                            </Button>
                                        </div>
                                    </FormGroup>
                                </form>
                                <Link to="/password-reset/">
                                    <p>Forgot your password?</p>
                                </Link>
                                <Link to="/merchant-log-in/">
                                    <p>Looking for merchant sign in?</p>
                                </Link>
                            </div>
                        </Row>
                    </div>
            </div>
        );
    }
}

const mapStateToProps = state => selector(state, false, ['auth-user', 'loading']);

const mapDispatchToProps = dispatch => {
    return {
        attemptSignIn: data => dispatch(attemptSignIn(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogIn);
