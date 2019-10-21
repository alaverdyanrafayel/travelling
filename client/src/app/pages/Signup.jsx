import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button } from 'reactstrap';
import { clone, cloneDeep, isEqual } from 'lodash';
import { isEmail, isEmpty, isLength, matches } from 'validator';
import { selector } from '../services';
import {
    attemptCheckEmail,
    attemptSignUp } from '../modules/auth-user/AuthUserActions';
import {
    ADD_CUSTOMER_ROUTE,
    INVALID_EMAIL,
    LENGTH_REQUIRED,
    NUMBER_LETTER,
    PASSWORD_MIN_LENGTH,
    REQUIRED } from 'configs/constants';
import converter from 'helpers/form/inputDetails';
import { Form, FormGroup } from 'components/form-elements';
import { SignupSteps, SignupAboutHolipay } from 'components/core';

const signUpState = {
    fields: {
        email: '',
        password: '',
        hasReadTerms: false
    },
    errors: {
        email: '',
        password: '',
        hasReadTerms: ''
    },
    loading: false
};

export class Signup extends React.Component {

    constructor(props) {
        super(props);

        this.state = cloneDeep(signUpState);
    }

    redirectToAddCustomer() {
        this.props.router.push(ADD_CUSTOMER_ROUTE);
    }

    componentDidUpdate(prevProps) {
        const { userFields, userErrors, loggedInUser } = this.props;
        if (!userFields.equals(prevProps.userFields) || !userErrors.equals(prevProps.userErrors)) {
            this.setState({
                errors: userErrors.toJS(),
                fields: userFields.toJS()
            });
        } else if (loggedInUser) {
            this.redirectToAddCustomer();
        }
    }

    handleChange = ({ target: { value, name, checked } }) => {

        if (name === 'hasReadTerms') {
            value = checked;
        }

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

        const { attemptSignUp } = this.props,
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
        attemptSignUp({ fields, errors });

    };

    handleBlur = () => {
        const { attemptCheckEmail } = this.props;
        if (!this.state.errors.email && this.state.fields.email) {
            const { fields, errors } = this.state;
            attemptCheckEmail({ fields, errors });
        }
    };

    render() {
        let inputs = [
            {
                name: 'email',
                label: 'Email *',
                type: 'email',
                error: 'test@gmail.com',
                handleBlur: this.handleBlur,
                tooltip: 'Email message',
            },
            {
                name: 'password',
                label: 'Password *',
                type: 'password',
                error: '',
                tooltip: 'password message',
            },
            {
                name: 'hasReadTerms',
                type: 'checkbox',
                label: "Checking this box indicates you have read and accept <a target='_blank' href='/terms-of-use/'>Holipay's Terms and Conditions</a> and <a href='/privacy/' target='_blank'>Privacy Policy</a>",
                error: '',
                tooltip: 'textbox message'
            }
        ];
        inputs.map(input => input.error = converter(cloneDeep(this.state.errors), input.name));

        const loading = this.props.loadingData.get('loading');

        return (
            <div>
                    <div className="mainWrapper">
                      <div className="createAccountContent">
                            <SignupAboutHolipay style={{top: '650px'}}/>
                            <div className="pull-right signup-form">
                              <SignupSteps step={1}/>
                              <div className="createAccount text-center">
                                <h4>Create a free account with your email</h4>
                                <p>Create a free Holipay account to pay for your next holiday over 12 weekly instalments, with no interest. Already have a Holipay account? <Link to="/log-in/">Sign in here</Link></p>
                                  <form onSubmit={(ev) => this.handleSubmit(ev)} method="post">
                                      <Form
                                          inputs={inputs} fields={clone(this.state.fields)}
                                          noLabel eventHandler={this.handleChange}
                                      />
                                      <FormGroup groupClass="col-xs-12">
                                          <div className="col-sm-12">
                                              <Button className="btn-block btn-signup"
                                                      type="submit"
                                                      disabled={(this.state.fields.email !== undefined && this.state.fields.email.length === 0) || (this.state.fields.password !== undefined && this.state.fields.password.length === 0) || (this.state.fields.hasReadTerms !== undefined && this.state.fields.hasReadTerms === false)}
                                                      onClick={this.handleSubmit}>
                                                  <span>CREATE ACCOUNT</span>
                                              </Button>
                                          </div>
                                      </FormGroup>
                                  </form>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        );
    }
}

const mapStateToProps = state => selector(state, false, ['auth-user', 'loading']);

const mapDispatchToProps = dispatch => {
    return {
        attemptSignUp: data => dispatch(attemptSignUp(data)),
        attemptCheckEmail: data => dispatch(attemptCheckEmail(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
