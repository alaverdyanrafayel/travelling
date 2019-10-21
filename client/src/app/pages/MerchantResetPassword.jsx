import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Row, Button, Col } from 'reactstrap';
import { isEmail, isEmpty } from 'validator';
import { cloneDeep, clone, isEqual } from 'lodash';
import converter from 'helpers/form/inputDetails';
import {
    attemptMerchantResetPassword,
    clear } from '../modules/auth-merchant/AuthMerchantActions';
import { selector } from '../services';
import { Notifications } from 'components/core';
import { Form, FormGroup } from 'components/form-elements';
import { INVALID_EMAIL, REQUIRED } from 'configs/constants';

const merchantResetPasswordState = {
    fields: {
        email: ''
    },
    errors: {
        email: ''
    }
};

export class MerchantResetPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = cloneDeep(merchantResetPasswordState);
    }

    componentDidMount() {
        this.props.clear();
    }

    handleSubmit = () => {
        const { attemptMerchantResetPassword } = this.props,
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
        attemptMerchantResetPassword(fields);
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

        if (isEmpty(value)) {
            return REQUIRED('Email');
        } else if (!isEmail(value)) {
            return INVALID_EMAIL('Email');
        } else {
            return '';
        }
    }

    render() {

        let inputs = [
            {
                name: 'email',
                label: 'Your email address',
                type: 'email',
                error: 'test@gmail.com',
                tooltip: 'Email message'
            }
        ];

        inputs.map(input => input.error = converter(cloneDeep(this.state.errors), input.name));
        let type = this.props.userMessages.toJS().length ? this.props.userMessages.toJS()[0].type : '';

        return(
        <div>
            <div className="col-xs-12 logoWrapper">
                <img className="img-responsive box-center" src="/img/logo-big.png" alt="logo"/>
            </div>

            <div className='mainWrapper'>
                <div>
                    <Row>
                        <Col sm="12" md="4" className="col-md-offset-4">
                            {
                                this.props.userMessages.size > 0 && type !== 'danger' ? (
                                    <div className="bordered-box height-300">
                                        <ReactTooltip place="right" effect="solid"/>
                                        <Row>
                                            <Col sm="12" md="12">
                                                <h5><b>Forgot your password?</b></h5>
                                            </Col>

                                            <Col sm="12" md="12">
                                                <Row>
                                                    <Form
                                                        inputs={inputs} fields={clone(this.state.fields)}
                                                        noLabel
                                                    />
                                                </Row>
                                            </Col>
                                        </Row>
                                        <FormGroup>
                                            <div className="col-sm-12">
                                                <div className="notification_message">
                                                    <Notifications messages = {this.props.userMessages} />
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </div>
                                ) : (
                                    <div className="bordered-box height-300">
                                        <ReactTooltip place="right" effect="solid"/>
                                        <Row>
                                            <Col sm="12" md="12">
                                                <h5><b>Forgot your password?</b></h5>
                                            </Col>

                                            <Col sm="12" md="12">
                                                <Row>
                                                    <Form
                                                        inputs={inputs} fields={clone(this.state.fields)}
                                                        noLabel eventHandler={this.handleChange}
                                                    />
                                                </Row>
                                            </Col>
                                        </Row>
                                        <FormGroup groupClass="form-submit-1 row mt-15">
                                            <div className="col-xs-12">
                                                <div className="col-sm-12">
                                                    <div className="notification_message">
                                                        <Notifications messages = {this.props.userMessages} />
                                                    </div>
                                                    <Button className="btn-block btnViolet" onClick = {this.handleSubmit}>
                                                        <span>Reset my Password</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </div>
                                )
                            }
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
        );
    }
}

const mapStateToProps = state => selector(state, false, ['auth-user']);

const mapDispatchToProps = dispatch => {

    return {
        clear: () => dispatch(clear()),
        attemptMerchantResetPassword: data => dispatch(attemptMerchantResetPassword(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MerchantResetPassword);
