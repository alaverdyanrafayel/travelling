import React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Row } from 'reactstrap';
import { isEmail, isEmpty, toDate } from 'validator';
import { clone, cloneDeep, isEqual } from 'lodash';
import converter from 'helpers/form/inputDetails';
import { attemptAddCustomer } from '../modules/auth-user/AuthUserActions';
import {
    ADD_MOBILE_VERIFICATION_ROUTE,
    INVALID_EMAIL,
    REQUIRED,
    INITIAL_DOB_VALUE } from 'configs/constants';
import { selector } from '../services';
import { Loading } from 'components/common';
import { FormGroup, Form } from 'components/form-elements';
import { SignupSteps, SignupAboutHolipay } from 'components/core';

const addCustomerState = {
    fields: {
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        dob: INITIAL_DOB_VALUE,
        userId: 0,
    },
    errors: {
        firstName: '',
        lastName: '',
        dob: '',
    },
    loading: false
};

export class AddCustomer extends React.Component {

    constructor(props) {
        super(props);

        this.state = cloneDeep(addCustomerState);
    }
    componentDidMount() {
        const { loggedInUser } = this.props;
        try {
            let newState = cloneDeep(this.state);
            newState.fields['email'] = loggedInUser.toJS().email;
            this.setState(newState);
        } catch (e) {
        }
    }
    redirectToMobileVerification() {
        this.props.router.push(ADD_MOBILE_VERIFICATION_ROUTE);
    }
    componentDidUpdate(prevProps) {
        const { userFields, userErrors, loggedInUser } = this.props;
        if (!userFields.equals(prevProps.userFields) || !userErrors.equals(prevProps.userErrors)) {
            this.setState({
                errors: userErrors.toJS(),
                fields: userFields.toJS()
            });
        } else if (this.state.fields.email !== loggedInUser.toJS().email) {
            let newState = cloneDeep(this.state);
            newState.fields['email'] = loggedInUser.toJS().email;
            newState.fields['userId'] = loggedInUser.toJS().id;
            this.setState(newState);
        } else if (loggedInUser.toJS().customer && loggedInUser.toJS().customer.id) {
            this.redirectToMobileVerification();
        }
    }
    handleChange = (proxy) => {
        let { value, name, checked } = proxy.target;
        let val = value;
        if (name === 'dob') {
            if (value && toDate(value.toString()) !== null) {
                val = value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();
            }
        }
        let newState = cloneDeep(this.state);
        newState.errors[name] = this.validate(name, value);
        newState.fields[name] = val;
        if (!isEqual(this.state, newState)) {
            this.setState(newState);
        }
    };
    validate(name, value) {
        switch (name) {
                case 'firstName':
                    if (isEmpty(value)) {
                        return REQUIRED('First Name');
                    } else {
                        return '';
                    }
                case 'lastName':
                    if (isEmpty(value)) {
                        return REQUIRED('Last Name');
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
                case 'dob':
                    if (isEmpty(value.toString())) {
                        return REQUIRED('Birthday');
                    } else {
                        return '';
                    }
        }
    }
    handleSubmit = (ev) => {
        ev.preventDefault();

        const { attemptAddCustomer, loggedInUser } = this.props,
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
            
            return;
        }
        
        fields['userId'] = loggedInUser.toJS().id;
        attemptAddCustomer({ fields, errors });
    };
    render() {
        let inputs = [
            {
                name: 'firstName',
                label: 'First name *',
                type: 'text',
                error: '',
                tooltip: 'First Name',
                colSize: 4,
                groupClass: 'mb-0'
            },
            {
                name: 'middleName',
                label: 'Middle name',
                type: 'text',
                error: '',
                tooltip: 'Middle Name',
                colSize: 4,
                groupClass: 'mb-0'
            },
            {
                name: 'lastName',
                label: 'Last name *',
                type: 'text',
                error: '',
                tooltip: 'Last Name',
                colSize: 4,
                groupClass: 'mb-0'
            },
            {
                name: 'email',
                label: 'Your email address *',
                type: 'email',
                error: '',
                tooltip: 'Email Address',
                disabled: true,
                colSize: 6
            },
            {
                name: 'dob',
                label: 'Birthday *',
                type: 'date',
                defaultValue: this.state.fields.dob,
                error: '',
                value: this.state.fields.dob,
                tooltip: 'Birthday',
                colSize: 6
            }
        ];
        inputs.map(input => input.error = converter(cloneDeep(this.state.errors), input.name));
        const loading = false;
        return (
            <div>
                {loading ? <Loading/> : (
                    <div className="mainWrapper">
                        <div className="createAccountContent">
                          <SignupAboutHolipay style={{top: '710px'}}/>
                          <div className="pull-right signup-form">
                            <SignupSteps step={2}/>
                            <div className="createAccount text-center">
                              <h4><b>Complete your profile:</b></h4>
                              <p>We use these details to verify your identity, so please make sure they're accurate.</p>
                                <form onSubmit={(ev) => this.handleSubmit(ev)} method="post">
                                    <Form
                                        inputs={inputs} fields={clone(this.state.fields)}
                                        noLabel eventHandler={this.handleChange}
                                    />
                                    <FormGroup groupClass="col-xs-12">
                                        <div className="col-sm-12">
                                          <Button className="btn-block btn-signup"
                                                  disabled={(this.state.fields.firstName !== undefined && this.state.fields.firstName.length === 0) || (this.state.fields.lastName !== undefined && this.state.fields.lastName.length === 0)}
                                                  type="submit" onClick={this.handleSubmit}>
                                                <span>CONTINUE</span>
                                            </Button>
                                        </div>
                                    </FormGroup>
                                  </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => selector(state, false, ['auth-user', 'loading']);

const mapDispatchToProps = dispatch => {
    return {
        attemptAddCustomer: data => dispatch(attemptAddCustomer(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomer);
