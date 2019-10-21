import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Row, Col, Button } from 'reactstrap';
import { clone, cloneDeep, isEqual } from 'lodash';
import { Form, FormGroup } from 'components/form-elements';
import { isEmpty, isLength, matches, equals } from 'validator';
import converter from 'helpers/form/inputDetails';
import {
    REQUIRED,
    NUMBER_LETTER,
    PASSWORD_MIN_LENGTH,
    LENGTH_REQUIRED,
    MATCHING_WITH_PASSWORD,
    CUSTOMER_DASHBOARD_ROUTE } from 'configs/constants';
import { connect } from 'react-redux';
import { selector } from '../services';
import {
    attemptResetPasswordConfirm,
    attemptResetPasswordConfirmSucceed,
    checkResetPasswordToken,
    clear } from '../modules/auth-user/AuthUserActions';
import { Notifications } from 'components/core';
import { Loading } from 'components/common';

const confirmPasswordState = {
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

export class ResetPasswordConfirm extends React.Component {
    constructor(props) {
        super(props);

        this.state = cloneDeep(confirmPasswordState);
    }
    
    componentDidMount() {
        this.props.clear();
        this.props.checkResetPasswordToken(this.props.router.params.token);
    }

    redirectToDashboard() {
        this.props.router.push(CUSTOMER_DASHBOARD_ROUTE);
    }

    componentDidUpdate() {
        if (this.props.loggedInUser) {
            setTimeout(() => this.redirectToDashboard(), 3000);
        }
    }

    handleSubmit = (ev) => {
        ev.preventDefault();

        const { attemptResetPasswordConfirm } = this.props,
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
            attemptResetPasswordConfirm(fields);
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

        return (
             <div>
                 <div className="col-xs-12 logoWrapper">
                    <img className="img-responsive box-center" src="/img/logo-big.png" alt="logo"/>
                </div>
                 { this.props.resetPasswordTokenStatus === true ? (
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
                                                 <form onSubmit={(ev) => this.handleSubmit(ev)} method="post">
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
                                                                     <Notifications messages={this.props.userMessages} />
                                                                 </div>
                                                                 <Button className="btn-block btnViolet"
                                                                         type="submit"
                                                                         onClick={this.handleSubmit}>
                                                                     <span>RESET PASSWORD</span>
                                                                 </Button>
                                                             </div>
                                                         </div>
                                                     </FormGroup>
                                                 </form>
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

const mapStateToProps = state => selector(state, false, ['auth-user']);

const mapDispatchToProps = dispatch => {

    return {
        clear: () => dispatch(clear()),
        attemptResetPasswordConfirm: data => dispatch(attemptResetPasswordConfirm(data)),
        attemptResetPasswordConfirmSucceed: data => dispatch(attemptResetPasswordConfirmSucceed(data)),
        checkResetPasswordToken: data => dispatch(checkResetPasswordToken(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordConfirm);
