import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Row, Col, Button } from 'reactstrap';
import { cloneDeep, isEqual,clone } from 'lodash';
import { isEmpty, isLength, matches, equals } from 'validator';
import {
    REQUIRED,
    NUMBER_LETTER,
    PASSWORD_MIN_LENGTH,
    MERCHANT_DASHBOARD_ROUTE,
    LENGTH_REQUIRED,
    MATCHING_WITH_PASSWORD } from 'configs/constants';
import converter from 'helpers/form/inputDetails';
import {
    attemptMerchantResetPasswordConfirm,
    checkMerchantResetPasswordToken,
    clear } from '../modules/auth-merchant/AuthMerchantActions';
import { selector } from '../services';
import { Form, FormGroup } from 'components/form-elements';
import { Notifications } from 'components/core';
import { Loading } from 'components/common';

const merchantConfirmPasswordState = {
    fields: {
        password: '',
        confirmPassword: '',
        token: ''
    },
    errors: {
        password: '',
        confirmPassword: ''
    }
};

export class MerchantResetPasswordConfirm extends React.Component {
    constructor(props) {
        super(props);

        this.state = cloneDeep(merchantConfirmPasswordState);
    }

    componentDidMount() {
        this.props.clear();
        this.props.checkMerchantResetPasswordToken(this.props.router.params.token);
    }

    redirectToMerchantDashboard() {
        this.props.router.push(MERCHANT_DASHBOARD_ROUTE);
    }

    componentDidUpdate() {
        if (this.props.loggedInUser) {
            setTimeout(() => this.redirectToMerchantDashboard(), 3000);
        }
    }

    handleSubmit = () => {
        const { attemptMerchantResetPasswordConfirm } = this.props,
            fields = clone(this.state.fields),
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
        } else {
            fields.token = this.props.routeParams.token;
            delete fields.confirmPassword;
            attemptMerchantResetPasswordConfirm(fields);
        }
    };

    handleChange = ({ target: { name, value } }) => {
        let newState = cloneDeep(this.state);

        newState.errors[name] = this.validate(name, value);
        newState.fields[name] = value;

        if (!isEqual(this.state, newState)) {
            this.setState(newState);
        }
    };

    validate(name, value) {

        switch (name) {
                case 'password':
                    if (isEmpty(value)) {
                        return REQUIRED('Password');
                    } else if (!matches(value, /^(?=\D*\d)[^a-z]*[a-z].*$/)) {
                        return NUMBER_LETTER('Password');
                    } else if (!isLength(value, PASSWORD_MIN_LENGTH)) {
                        return LENGTH_REQUIRED('Password', { min: PASSWORD_MIN_LENGTH });
                    } else {
                        return '';
                    }

                case 'confirmPassword':
                    if (isEmpty(value)) {
                        return REQUIRED('Confirm Password');
                    } else if (!equals(value, this.state.fields.password)) {
                        return MATCHING_WITH_PASSWORD('Confirm Password');
                    } else {
                        return '';
                    }
        }
    }

    render() {
        let inputs = [
            {
                name: 'password',
                label: 'New password *',
                type: 'password',
                error: '',
                tooltip: 'Password message',
            },
            {
                name: 'confirmPassword',
                label: 'Confirm your new password *',
                type: 'password',
                error: '',
                tooltip: 'Password confirmation message',
            }
        ];
        inputs.map(input => input.error = converter(cloneDeep(this.state.errors), input.name));

        return(
            <div>
                <div className="col-xs-12 logoWrapper">
                    <img className="img-responsive box-center" src="/img/logo-big.png" alt="logo"/>
                </div>
                { this.props.resetPasswordTokenStatus === null ? (
                    <div className='mainWrapper'>
                        <div>
                            <Row>
                                <Col sm="12" md="4" className="col-md-offset-4">
                                    <div className="confirmPassword bordered-box height-400">
                                        <ReactTooltip place="right" effect="solid"/>
                                        <Row>
                                            <Col sm="12" md="12">
                                                <h5><b>Reset your password</b></h5>
                                            </Col>

                                            <Col sm="12" md="12">
                                                <Row>
                                                    <Form
                                                        inputs={inputs} fields={clone(this.state.fields)}
                                                        noLabel eventHandler={this.handleChange}
                                                    />
                                                </Row>
                                                <FormGroup groupClass="row mt-15">
                                                    <div className="col-xs-12">
                                                        <div className="col-sm-12">
                                                            <div className="notification_message">
                                                                <Notifications
                                                                    messages={this.props.merchantSignupData.get('messages')}/>
                                                            </div>
                                                            <Button className="btn-block btnViolet"
                                                                    onClick={this.handleSubmit}>
                                                                <span>Reset my Password</span>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                ) : this.props.resetPasswordTokenStatus !== null ? (

                <h1>{this.props.resetPasswordTokenStatus}</h1>
                ) : <Loading/>
                }
            </div>
        );
    }
}

const mapStateToProps = state => selector(state, false, ['merchant-signup', 'auth-user']);

const mapDispatchToProps = dispatch => {

    return {
        clear: () => dispatch(clear()),
        attemptMerchantResetPasswordConfirm: data => dispatch(attemptMerchantResetPasswordConfirm(data)),
        checkMerchantResetPasswordToken: data => dispatch(checkMerchantResetPasswordToken(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MerchantResetPasswordConfirm);
