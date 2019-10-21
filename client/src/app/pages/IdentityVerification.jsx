import React from 'react';
import { connect } from 'react-redux';
import { Col, Button } from 'reactstrap';
import { Link } from 'react-router';
import { clone, cloneDeep } from 'lodash';
import moment from 'moment';
import Script from 'react-load-script';
import { Form } from 'components/form-elements';
import { onSessionComplete } from '../modules/auth-user/AuthUserActions';
import { selector } from '../services';
import {
    CUSTOMER_DASHBOARD_ROUTE,
    PENDING,
    PENDING_MESSAGE,
    IDENTITY_PAGE_DESCRIPTION,
    IDENTITY_PAGE_HEADER,
    GREEN_ID_UI,
    GREEN_ID_CONFIG,
    GREEN_UI_ID } from 'configs/constants';
import params from 'configs/params';
import { Notifications, Notification, SignupSteps } from 'components/core';
import 'sass/partials/identityVerification.scss';

const fields = {
    givenNames: '',
    middleNames: '',
    surname: '',
    state: params.greenId.countryState,
    dob: '',
    email: '',
    accountId: params.greenId.accountId,
    apiCode: params.greenId.apiCode,
    usethiscountry: params.greenId.countryCode,
    message: {},
    confirmedToContinue: false,
    greenidConfigLoaded: false,
    greeniduiLoaded: false,
};

export class IdentityVerification extends React.Component {
    verificationToken;

    constructor(props) {
        super(props);
        this.state = cloneDeep(fields);
    }

    redirectToCustomerDashboard() {
        this.props.router.push(CUSTOMER_DASHBOARD_ROUTE);
    }

    componentDidUpdate(prevProps) {
        const { customer } = this.props.loggedInUser.toJS();

        if (customer.hasOwnProperty('is_session_complete')) {
            this.redirectToCustomerDashboard();
        }
    }

    handleSubmit = (verificationToken, currentState) => {
        this.verificationToken = verificationToken;
        this.onSessionComplete(verificationToken);
    };

    setupGreenID() {
        greenidUI.setup({
            environment: params.greenId.environment,
            formId: GREEN_ID_UI.FORM_ID,
            frameId: GREEN_ID_UI.FRAME_ID,
            country: GREEN_ID_UI.COUNTRY,
            debug: false,
            submitCallback: this.handleSubmit
        });
        greenidConfig.setOverrides({
            'intro_title': '<h1>Verify your identity:</h1>',
            'intro_introText0': '<p>Select a document from the dropdown menu so we can verify your identity. Please ensure you enter details exactly as they appear on the document.</p>',
            'submit_button_text': 'COMPLETE MY ACCOUNT'
        });

        const customer =  this.props.loggedInUser.toJS().customer;

        if(customer.id_status === PENDING) {
            this.setState({ message: {
                type: 'info',
                message: PENDING_MESSAGE
            } });
        } else {
            setTimeout(() => {
                this.refs.theform.dispatchEvent(new Event('submit'));
            });
}
    }

    componentDidMount = () => {
        const { customer } = this.props.loggedInUser.toJS();
        if (customer.hasOwnProperty('is_session_complete')) {
            this.redirectToCustomerDashboard();
        }
        const { first_name, last_name, middle_name, dob } = customer;
        let newState = cloneDeep(this.state);
        newState.givenNames = first_name;
        newState.middleNames = middle_name;
        newState.surname = last_name;
        newState.dob = moment(dob).format('DD/MM/YYYY');
        this.setState(newState);

    };

    onSessionComplete = (verificationToken) => {
        this.props.onSessionComplete({ verificationToken });
    };
    handleContinue = () => {
        this.setState({
            confirmedToContinue: true
        }, () => {
            this.setupGreenID();
        });
    };

    handleTryAgain = () => {
        setTimeout(() => {
            window.location.reload();
        }, 200);
    };

    render() {
        let inputs = [
            {
                name: 'accountId',
                label: 'accountId',
                type: 'hidden',
                error: '',
                colSize: 4,
                id: 'accountId'
            },
            {
                name: 'apiCode',
                label: 'apiCode',
                type: 'hidden',
                error: '',
                colSize: 4,
                id: 'apiCode'
            },
            {
                name: 'usethiscountry',
                label: 'country',
                type: 'hidden',
                error: '',
                colSize: 4,
                id: 'usethiscountry'
            },
            {
                name: 'givenNames',
                label: 'First name',
                type: 'hidden',
                error: '',
                colSize: 4,
                id: 'givenNames'
            },
            {
                name: 'middleNames',
                label: 'Middle name',
                type: 'hidden',
                error: '',
                colSize: 4,
                id: 'middleNames'
            },
            {
                name: 'surname',
                label: 'Surname',
                type: 'hidden',
                error: '',
                colSize: 4,
                id: 'surname'
            },
            {
                name: 'state',
                label: 'State',
                type: 'hidden',
                error: '',
                colSize: 3,
                id: 'state'
            },
            {
                name: 'dob',
                label: 'Your birthday *',
                type: 'hidden',
                colSize: 3,
                id: 'dob'
            },
            {
                name: 'email',
                label: 'Your email address *',
                type: 'hidden',
                error: '',
                colSize: 7,
                id: 'email'
            },
        ];

        return (
            <div>
                <Script
                    url= { GREEN_ID_CONFIG }
                    onLoad={() => {this.setState({ greenidConfigLoaded: true }); }}
                />
                {
                    this.state.greenidConfigLoaded &&  (<Script
                        url= { GREEN_UI_ID }
                        onLoad={() => {this.setState({ greeniduiLoaded: true }); }}
                    />)
                }
                <div className="col-xs-12 mb-0 logoWrapper">
                  <Link to="/"><img className="img-responsive box-center" src="/img/logo-big.png" alt="logo"/></Link>
                </div>
                <div className="col-sm-12">
                  <div className="identity-steps-container"><SignupSteps step={4}/></div>
                  {!this.state.confirmedToContinue ? (
                        <div className="notification_message_container text-center">
                            <h5><b>{IDENTITY_PAGE_HEADER}</b></h5>
                            <div className="notification_message">
                                <p>{IDENTITY_PAGE_DESCRIPTION}</p>
                            </div>
                            <div className="notification_message_button_container ">
                                <Button
                                        onClick={this.handleContinue}
                                        disabled={!(this.state.greeniduiLoaded && this.state.greenidConfigLoaded)}>
                                    <span>CONTINUE</span>
                                </Button>
                            </div>
                          </div>
                    ) : (this.props.userMessages.size > 0) ? (
                        <div className="notification_message_container text-center">
                            <div className="notification_message">
                                <Notifications messages = {this.props.userMessages} />
                            </div>
                            {(this.props.loggedInUser.get('customer').get('id_status') !== PENDING) && (
                                <div className="notification_message_button_container">
                                    <button onClick={this.handleTryAgain} className="btn">TRY AGAIN NOW</button>
                                </div>)
                            }
                        </div>
                    ) : ( this.state.message.type) ? (
                        <div className="notification_message_container text-center">
                            <div className="notification_message">
                                <div>
                                    <Notification
                                        type={this.state.message.type}
                                        message={this.state.message.message}/>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            <div id="greenid-div"/>
                            <form className="hidden" ref="theform" id="theform" action="javascript:void(0)">
                                <Form inputs={inputs} noLabel fields={clone(this.state)} role="form"/>
                                <input id="submitbob" value="Submit details" type="submit" name="submitbob"/>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => selector(state, false, ['auth-user', 'loading']);

const mapDispatchToProps = dispatch => {
    return {
        onSessionComplete: data => dispatch(onSessionComplete(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(IdentityVerification);
