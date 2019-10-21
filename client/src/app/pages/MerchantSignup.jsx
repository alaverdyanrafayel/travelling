import React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Row } from 'reactstrap';
import { clone, cloneDeep, isEqual } from 'lodash';
import { isAlphanumeric, isLength, matches, isEmail, isEmpty } from 'validator';
import { selector } from '../services';
import {
    attemptValidateMerchant,
    attemptAddMerchant } from '../modules/auth-merchant/AuthMerchantActions';
import converter from 'helpers/form/inputDetails';
import {
    MERCHANT_DASHBOARD_ROUTE,
    PASSWORD_MIN_LENGTH,
    LENGTH_REQUIRED,
    NUMBER_LETTER,
    INVALID_EMAIL,
    REQUIRED,
    IS_ALPHANUMERIC,
    PASSWORD_NOT_MATCHING } from 'configs/constants';
import { FormGroup, Form } from 'components/form-elements';
import { Loading } from 'components/common';

const merchantSignupState = {
    fieldsMain: {
        email: '',
        inviteCode: ''
    },
    errorsMain: {
        email: '',
        inviteCode: '',
        apiError: ''
    },
    fieldsDetails: {
        businessName: '',
        businessType: '',
        contantNo: '',
        abn: '',
        userId: 0,
        hasReadTerms: '',
        password: '',
        confirmPassword: '',
        agreementLink: '',
        isVerified: false
    },
    errorsDetails: {
        businessName: '',
        businessType: '',
        contactNo: '',
        abn: '',
        password: '',
        confirmPassword: '',
        hasReadTerms: ''
    },
    loading: false
};

export class MerchantSignup extends React.Component {

    constructor(props) {
        super(props);

        this.state = cloneDeep(merchantSignupState);
    }

    redirectToDashboard() {
        this.props.router.push(MERCHANT_DASHBOARD_ROUTE);
    }

    componentDidUpdate(prevProps) {
        const { merchantSignupData } = this.props;
        if (merchantSignupData && !merchantSignupData.equals(prevProps.merchantSignupData)) {
            let state = merchantSignupData.toJS();
            if (!state.errors.response) {
                let data = merchantSignupData.toJS().merchant;
                this.setState({
                    fieldsDetails: {
                        ...this.state.fieldsDetails,
                        businessName: data.business_name,
                        businessType: data.business_type,
                        contactNo: data.contact_no,
                        abn: data.ABN,
                        agreementLink: data.agreementLink,
                        userId: data.user_id,
                        isVerified: data.is_verified
                    },
                    errorsMain: {
                        ...this.state.errorsMain,
                        apiError: ''
                    }
                }, () => {
                    if (data.is_verified) {
                        this.redirectToDashboard();
                    }
                });
            }
            else {
                this.setState({ errorsMain: { ...this.state.errorsMain, apiError: state.errors.response } });
            }
        }
    }

    handleChange = (proxy) => {

        let { value, name, checked } = proxy.target;

        let val = value;

        if (name === 'hasReadTerms') {
            value = checked;
        }

        let newState = cloneDeep(this.state);

        newState.errorsMain[name] = this.validate(name, value);
        newState.fieldsMain[name] = val;

        newState.errorsDetails[name] = this.validate(name, value);
        newState.fieldsDetails[name] = val;

        if (!isEqual(this.state, newState)) {
            this.setState(newState);
        }
    };

    validate(name, value) {
        switch (name) {
                case 'inviteCode':
                    if (isEmpty(value)) {
                        return REQUIRED('inviteCode');
                    } else if (!isAlphanumeric(value)) {
                        return IS_ALPHANUMERIC('Invite Code');
                    } else {
                        return '';
                    }
                case 'contactNo':
                    if (isEmpty(value)) {
                        return REQUIRED('Contact Number');
                    } else {
                        return '';
                    }
                case 'email':
                    if (isEmpty(value)) {
                        return REQUIRED('Email');
                    } else if (!isEmail(value)) {
                        return INVALID_EMAIL('Email');
                    } else {
                        return '';
                    }
                case 'businessName':
                    if (isEmpty(value)) {
                        return REQUIRED('Business Name');
                    } else {
                        return '';
                    }
                case 'businessType':
                    if (isEmpty(value)) {
                        return REQUIRED('Business Type');
                    } else {
                        return '';
                    }
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
                    } else if (!matches(value, /^(?=\D*\d)[^a-z]*[a-z].*$/)) {
                        return NUMBER_LETTER('Confirm Password');
                    } else if (!isLength(value, PASSWORD_MIN_LENGTH)) {
                        return LENGTH_REQUIRED('Confirm Password', { min: PASSWORD_MIN_LENGTH });
                    } else if (!isEqual(value, this.state.fieldsDetails.password)) {
                        return PASSWORD_NOT_MATCHING('Confirm Password');
                    } else {
                        return '';
                    }
                case 'hasReadTerms':
                    if (!value) {
                        return REQUIRED('Read Terms');
                    } else {
                        return '';
                    }
        }
    }

    handleSubmit = (ev) => {
        ev.preventDefault();

        if (this.state.fieldsDetails.businessName.length === 0) {
            const { attemptValidateMerchant } = this.props,
                fieldsMain = clone(this.state.fieldsMain),
                errorsMain = clone(this.state.errorsMain);
            let validationErrors = {};
            Object.keys(fieldsMain).map(name => {
                const error = this.validate(name, fieldsMain[name]);
                if (error && error.length > 0) {
                    validationErrors[name] = error;
                }
            });
            if (Object.keys(validationErrors).length > 0) {
                this.setState({ errorsMain: validationErrors });

                return;
            }
            attemptValidateMerchant({ fieldsMain, errorsMain });
        }
        else {
            const { attemptAddMerchant } = this.props,
                fieldsDetails = clone(this.state.fieldsDetails),
                errorsDetails = clone(this.state.errorsDetails);
            let validationErrors = {};
            Object.keys(fieldsDetails).map(name => {
                const error = this.validate(name, fieldsDetails[name]);
                if (error && error.length > 0) {
                    validationErrors[name] = error;
                }
            });
            if (Object.keys(validationErrors).length > 0) {
                this.setState({ errorsDetails: validationErrors });

                return;
            }
            attemptAddMerchant(fieldsDetails);
        }
    };

    render() {
        let inputsMain = [
            {
                name: 'email',
                label: 'Email address *',
                type: 'email',
                error: 'test@gmail.com',
                tooltip: 'Email message',
                colSize: 6,
                groupClass: 'mb-0'
            },
            {
                name: 'inviteCode',
                label: 'Invite Code *',
                type: 'text',
                error: '',
                tooltip: 'Invite Code',
                colSize: 6,
                groupClass: 'mb-0'
            },
        ];
        let inputsDetails = [
            {
                name: 'businessName',
                label: 'Business name *',
                type: 'text',
                error: '',
                tooltip: 'Business Name',
                colSize: 6,
                groupClass: 'mb-0',
                disabled: true
            },
            {
                name: 'abn',
                label: 'ABN *',
                type: 'text',
                error: '',
                tooltip: 'ABN',
                colSize: 6,
                groupClass: 'mb-0',
                disabled: true
            },
            {
                name: 'contactNo',
                label: 'Best contact number *',
                type: 'text',
                error: '',
                tooltip: 'Contact Number',
                colSize: 6,
                groupClass: 'mb-0',
                disabled: true
            },
            {
                name: 'businessType',
                label: 'Type of business *',
                type: 'text',
                error: '',
                tooltip: 'Business Type',
                colSize: 6,
                groupClass: 'mb-0',
                disabled: true
            },
            {
                name: 'password',
                label: 'Password *',
                type: 'password',
                error: '',
                tooltip: 'password message',
                colSize: 6,
                groupClass: 'mb-0'
            },
            {
                name: 'confirmPassword',
                label: 'Confirm Password *',
                type: 'password',
                error: '',
                tooltip: 'password message',
                colSize: 6,
                groupClass: 'mb-0'
            },
            {
                name: 'hasReadTerms',
                type: 'checkbox',
                label: (<span>I have read &nbsp;
                    <a
                        href={this.state.fieldsDetails.agreementLink}
                        target="blank">Merchant Service Agreement</a>
                </span>),
                error: '',
                tooltip: 'textbox message'
            }
        ];
        inputsMain.map(input => input.error = converter(cloneDeep(this.state.errorsMain), input.name));
        inputsDetails.map(input => input.error = converter(cloneDeep(this.state.errorsDetails), input.name));

        const loading = this.props.loadingData.get('loading');

        return (
            <div>
                <Col xs={12} className="logoWrapper col-xs-12">
                    <img className="img-responsive box-center" src="/img/logo-big.png" alt="logo"/>
                </Col>
                {loading
                    ? <Loading/>
                    : (
                        <div className="mainWrapper">
                            <h4 className="center-align">
                                <b>Fill out the form below to complete your business account signup.</b>
                            </h4>
                            <Row className="createAccountContent">
                                <Col sm={10} className="createAccount add-merchant text-center col-xs-10">
                                    <form onSubmit={(ev) => this.handleSubmit(ev)} method="post">
                                        <h4><b>Complete your signup:</b></h4>
                                        <Form
                                            inputs={inputsMain} fields={clone(this.state.fieldsMain)}
                                            noLabel eventHandler={this.handleChange}
                                        />
                                        {this.state.fieldsDetails.businessName.length > 0 ? <Form
                                            inputs={inputsDetails} fields={clone(this.state.fieldsDetails)}
                                            noLabel eventHandler={this.handleChange}
                                        /> : ''}
                                        <FormGroup groupClass="col-xs-12">
                                            <div className="col-sm-10 col-sm-offset-1">
                                                <Button className="btn-block btn-signup"
                                                        type="submit"
                                                        onClick={this.handleSubmit}>
                                                    <span>Continue</span>
                                                </Button>
                                            </div>
                                        </FormGroup>
                                    </form>
                                    <span style={{ color: 'red' }}>{this.state.errorsMain.apiError}</span>
                                </Col>
                            </Row>
                        </div>
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = state => {

    return selector(state);
};

const mapDispatchToProps = dispatch => {
    return {
        attemptAddMerchant: data => dispatch(attemptAddMerchant(data)),
        attemptValidateMerchant: data => dispatch(attemptValidateMerchant(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MerchantSignup);
