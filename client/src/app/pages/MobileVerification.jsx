import React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Row } from 'reactstrap';
import { clone, cloneDeep, isEqual } from 'lodash';
import { isAlphanumeric, isEmpty, isNumeric } from 'validator';
import { selector } from '../services';
import {
    ADD_IDENTITY_VERIFICATION,
    INVALID_MOBILE_NUMBER,
    IS_ALPHANUMERIC,
    REQUIRED } from 'configs/constants';
import converter from 'helpers/form/inputDetails';
import {
    attemptSendCode,
    attemptSignUp,
    attemptSmsVerification } from '../modules/auth-user/AuthUserActions';
import { Loading } from 'components/common';
import { Form, FormGroup } from 'components/form-elements';
import { SignupSteps, SignupAboutHolipay } from 'components/core';

const MobileVerificationState = {
    fields: {
        mobileNumber: '',
        verificationCode: '',
        verificationSend: false,
        verificationSucceed: false
    },
    errors: {
        mobileNumber: '',
        verificationCode: ''
    },
    loading: false
};

export class MobileVerification extends React.Component {
    constructor(props) {
        super(props);

        this.state = cloneDeep(MobileVerificationState);
    }

    redirectToIdentityVerification() {
        this.props.router.push(ADD_IDENTITY_VERIFICATION);
    }

    componentDidMount() {
        const { userFields, userErrors, loggedInUser } = this.props;
        if (loggedInUser.toJS().customer && loggedInUser.toJS().customer.is_mobile_verified) {
            this.redirectToIdentityVerification();
        } else if (!userFields.equals(this.state.fields) || !userErrors.equals(this.state.errors)) {
            this.setState({
                errors: userErrors.toJS(),
                fields: userFields.toJS()
            });
        }
    }

    componentDidUpdate(prevProps) {
        const { userFields, userErrors, loggedInUser } = this.props;
        if (!userFields.equals(prevProps.userFields) || !userErrors.equals(prevProps.userErrors)) {
            this.setState({
                errors: userErrors.toJS(),
                fields: userFields.toJS()
            });
        } else if (this.state.fields.verificationSucceed && loggedInUser.toJS().customer && loggedInUser.toJS().customer.is_mobile_verified) {
            this.redirectToIdentityVerification();
        }
    }

    sendCode = () => {
        const error = this.validate('mobileNumber', this.state.fields.mobileNumber);
        let newState = cloneDeep(this.state);
        if (error) {
            newState.errors.mobileNumber = error;
            this.setState(newState);

            return;
        }

        this.props.attemptSendCode({ fields: newState.fields, errors: newState.errors });
    };

    handleChange = ({ target: { value, name } }) => {
        let newState = cloneDeep(this.state);

        newState.errors[name] = this.validate(name, value);
        newState.fields[name] = value;

        if (!isEqual(this.state, newState)) {
            this.setState(newState);
        }
    };

    handleSubmit = (ev) => {
        ev.preventDefault();

        const error = this.validate('verificationCode', this.state.fields.verificationCode);
        let newState = cloneDeep(this.state);
        if (error) {
            newState.errors.verificationCode = error;
            this.setState(newState);

            return;
        }
        this.props.attemptSmsVerification({ fields: newState.fields, errors: newState.errors });
    };

    validate(name, value) {
        switch (name) {
                case 'mobileNumber':
                    if (isEmpty(value)) {
                        return REQUIRED('Mobile Number');
                    } else if (!isNumeric(value[14])) {
                        return INVALID_MOBILE_NUMBER('Mobile Number');
                    } else {
                        return '';
                    }

                case 'verificationCode':
                    if (isEmpty(value)) {
                        return REQUIRED('verificationCode');
                    } else if (!isAlphanumeric(value)) {
                        return IS_ALPHANUMERIC('Verification Code');
                    } else {
                        return '';
                    }
        }
    }

    render() {

        let inputs = [
            {
                name: 'mobileNumber',
                label: 'Mobile number *',
                type: 'phone',
                error: '',
            },
            {
                name: 'verificationCode',
                label: 'Verification Code *',
                type: 'password',
                error: '',
            },
        ];

        inputs.map(input => input.error = converter(cloneDeep(this.state.errors), input.name));

        const loading = this.props.loadingData.get('loading');

        return (
            <div>
                {loading
                    ? <Loading/>
                    : (
                        <div className="mainWrapper">
                            <div className="createAccountContent">
                                    <SignupAboutHolipay style={{top: '520px'}}/>
                                      <div className="pull-right signup-form">
                                        <SignupSteps step={3}/>
                                        <div className="createAccount bordered-box text-center">
                                          <h5><b>Verify your mobile number</b></h5>
                                          <p>Insert your mobile number and click 'send code'. Then enter the
                                              six-digit verification code we send to your phone</p>
                                            <form onSubmit={(ev) => this.handleSubmit(ev)} method="post">
                                                 <Row>
                                                    <Col className='col-xs-8'>
                                                        <Row>
                                                            <Form
                                                                inputs={inputs}
                                                                fields={clone(this.state.fields)}
                                                                noLabel
                                                                eventHandler={this.handleChange}
                                                            />
                                                        </Row>
                                                    </Col>
                                                    <Col className='col-xs-4'>
                                                        <FormGroup>
                                                            <Button className='btn-send-code'
                                                                    type="submit"
                                                                    onClick={this.sendCode}>
                                                                {this.state.fields.verificationSend ? 'SEND AGAIN' : 'SEND CODE'}
                                                            </Button>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <FormGroup groupClass='form-submit-1 mt-15'>
                                                    <Button className='btn-verify'
                                                            type="submit"
                                                            onClick={this.handleSubmit}
                                                            disabled={!this.state.fields.verificationSend}>
                                                            CONTINUE
                                                    </Button>
                                                </FormGroup>
                                            </form>
                                            <p>We use your mobile number to remind you about upcoming payments and for
                                                security purposes.</p>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = state => selector(state, false, ['auth-user', 'loading']);

const mapDispatchToProps = dispatch => {
    return {
        attemptSignUp: data => dispatch(attemptSignUp(data)),
        attemptSendCode: data => dispatch(attemptSendCode(data)),
        attemptSmsVerification: data => dispatch(attemptSmsVerification(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileVerification);
