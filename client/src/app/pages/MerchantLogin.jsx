import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Button, Col, Row } from 'reactstrap';
import { Link } from 'react-router';
import { isEmail, isEmpty, isLength, matches } from 'validator';
import { clone, cloneDeep, isEqual } from 'lodash';
import { attemptSignIn } from '../modules/auth-merchant/AuthMerchantActions';
import {
    INVALID_EMAIL,
    LENGTH_REQUIRED,
    NUMBER_LETTER,
    REQUIRED,
    PASSWORD_MIN_LENGTH,
    MERCHANT_DASHBOARD_ROUTE } from 'configs/constants';
import converter from 'helpers/form/inputDetails';
import { selector } from '../services';
import { Form, FormGroup } from 'components/form-elements';
import { Loading } from 'components/common';

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

export class MerchantLogIn extends React.Component {

    handleChange = ({ currentTarget: { value, name } }) => {
        let newState = cloneDeep(this.state);

        newState.errors[name] = this.validate(name, value);
        newState.fields[name] = value;

        if (!isEqual(this.state, newState)) {
            this.setState(newState);
        }
    };
    handleSubmit = (ev) => {
        ev.preventDefault();

        const { attemptSignIn } = this.props,
            data = clone(this.state.fields);

        let validationErrors = {};
        Object.keys(data)
                .map(name => {
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

    constructor(props) {
        super(props);

        this.state = cloneDeep(logInState);
    }

    redirectToDashboard() {
        this.props.router.push(MERCHANT_DASHBOARD_ROUTE);
    }

    componentDidUpdate(prevProps) {
        const { merchantData, loggedInUser } = this.props;

            if (merchantData && !merchantData.equals(prevProps.merchantData)) {
                this.setState({
                    errors: merchantData.toJS().messages,
                    fields: merchantData.toJS().fields
                });
            } else if (loggedInUser) {
                this.redirectToDashboard();
            }

    }

    validate(name, value) {
        switch (name) {
                case 'email':
                    if (isEmpty(value)) {
                        return REQUIRED('Email');
                    } else if (!isEmail(value)) {
                        return INVALID_EMAIL('Email');
                    } else {
                        return '';
                    }
                case 'password':
                    if (isEmpty(value)) {
                        return REQUIRED('Password');
                    } else if (!matches(value, /^(?=.*?[a-zA-Z])(?=.*?[0-9])[\w@#$%^?~-]{0,128}$/)) {
                        return NUMBER_LETTER('Password');
                    } else if (!isLength(value, PASSWORD_MIN_LENGTH)) {
                        return LENGTH_REQUIRED('Password', { min: PASSWORD_MIN_LENGTH });
                    } else {
                        return '';
                    }
        }
    }

    render() {

        let inputs = [
            {
                name: 'email',
                label: 'Email',
                type: 'email',
                error: 'test@gmail.com',
                tooltip: 'Enter Email Address'
            },
            {
                name: 'password',
                label: 'Password',
                type: 'password',
                error: '',
                tooltip: 'Enter Account Password'
            }
        ];

        inputs.map(input => input.error = converter(cloneDeep(this.state.errors), input.name));

        const loading = this.props.loadingData.get('loading');

        return (
            <div>
                <div className="col-xs-12 logoWrapper">
                    <img className="img-responsive box-center" src="/img/logo-big.png" alt="logo"/>
                </div>
                {loading
                    ? <Loading/>
                    : (
                        <div className="mainWrapper" style={{ width: '454px' }}>
                            <Row className="createAccountContent">
                                <Col sm={12} className="createAccount text-center col-xs-12 col-sm-12 merchant-login-box">
                                    <form onSubmit={(ev) => this.handleSubmit(ev)} method="post">
                                        <ReactTooltip place="right" effect="solid"/>
                                        <h4><b>Sign in to your Holipay merchant account</b></h4>
                                        <Form
                                            inputs={inputs}
                                            fields={clone(this.state.fields)}
                                            eventHandler={this.handleChange}
                                            noLabel/>
                                        <FormGroup groupClass="col-xs-12">
                                            <div className="col-sm-10 col-sm-push-1 mt-15">
                                                <Button className="btn-block btn-signup sign-in"
                                                        type="submit"
                                                        onClick={this.handleSubmit}>
                                                    <span>Sign in</span>
                                                </Button>
                                            </div>
                                        </FormGroup>
                                    </form>
                                    <span style={{ color: 'red' }}>{this.state.errors.length > 0 ? this.state.errors[0].message : ''}</span>
                                    <Link to="/merchant-password-reset/">
                                        <p>Forgot your password?</p>
                                    </Link>
                                    <Link to="/merchants/#contact">
                                    <p>Don't have a merchant account? Enquire here</p>
                                    </Link>
                                    <Link to="log-in/"><p>Are you a traveller? Sign in here</p></Link>
                                </Col>
                            </Row>
                        </div>
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = state => selector(state);

const mapDispatchToProps = dispatch => {
    return {
        attemptSignIn: data => dispatch(attemptSignIn(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MerchantLogIn);
