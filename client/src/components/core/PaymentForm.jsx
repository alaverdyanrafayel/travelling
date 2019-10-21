import React from 'react';
import moment from 'moment';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    attemptAddPayment,
    attemptCardValidationFailed,
    attemptCardValidationSucceed,
    attemptGetPayment,
    attemptUpdatePayment,
    clear
} from '../../app/modules/payment/PaymentActions';
import { selector } from '../../app/services';
import { cloneDeep, clone, isEqual } from 'lodash';
import {
    PIN_PAYMENT_URL,
    EXPIRATION_DATE_ERROR,
    PAYMENT_METHODS,
    MAX_CARD_ERROR,
    REQUIRED,
    CC_VALID_COUNTRY_CODE
} from 'configs/constants';
import Script from 'react-load-script';
import CreditCardInput from 'react-credit-card-input';
import params from 'configs/params';
import converter from 'helpers/form/inputDetails';
import { Form } from 'components/form-elements';
import { isEmpty } from 'validator';
import { Notification } from 'components/core/Notification';

const defaultValues = {
    address_country: CC_VALID_COUNTRY_CODE,
    address_postcode: 48548,
};

const paymentFormState = {
    fields: {
        address_line1: '',
        address_city: '',
        number: '',
        name: '',
        expiry: '',
        cvc: ''
    },
    errors: {
        address_line1: '',
        address_city: '',
        number: ''
    },
    cardValidationError: '',
    pinScriptLoaded: false
};

export class PaymentForm extends React.Component {

    constructor(props) {
        super(props);
        const firstName = this.props.loggedInUser.toJS().customer.first_name;
        const lastName = this.props.loggedInUser.toJS().customer.last_name;
    
        paymentFormState.fields.name = `${firstName} ${lastName}`;
        this.state = cloneDeep(paymentFormState);
    }

    componentDidMount() {
        this.props.clear();
        this.props.attemptGetPayment();
        this.props.attemptCardValidationSucceed();
    }

    redirectToPaymentMethods() {
        this.props.router.push(PAYMENT_METHODS);
    }

    clearCardForm = () => {
        const { fields } = paymentFormState;
        this.setState({ fields, cardValidationError: "" });
    };

    handleSubmit = (ev) => {
        ev.preventDefault();

        if(this.props.card.toJS().cards.length === 5) {
            this.props.attemptCardValidationFailed({ cardValidationError: MAX_CARD_ERROR });

            return;
        }
        
        const data = clone(this.state.fields);
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

        const { number, cvc, expiry, address_line1, address_city, name } = this.state.fields;
        if(!number || !cvc || !expiry || !address_line1 || !address_city ) {
            return;
        }

        const values = {
            ...defaultValues,
            name,
            number,
            cvc,
            address_line1,
            address_city,
            expiry_month: Number(expiry.slice(0, 2)),
            expiry_year: 2000 + Number(expiry.slice(5, 7)), // to have 2025 as year instead of 25
        };
        
        // Retrieve token from pin api based on give card data
        this.pinApi.createCardToken(values).then((card) => {
            const { token } = card;
            if (token !== undefined) {
                // Set date 12 weeks later
             
                const comparedDate = moment()
                        .add(12, 'week')
                        .add(1, 'month')
                        .date(1),
                    expDate = moment()
                        .year(values.expiry_year)
                        .month(values.expiry_month - 1);
                if (expDate < comparedDate) {
                    this.setState({ cardValidationError: EXPIRATION_DATE_ERROR });
                } else if (this.props.params && this.props.params.cardId) {
                    this.props.attemptUpdatePayment({ tokenId: token, cardId: this.props.params.cardId });
                    this.clearCardForm();
                    this.redirectToPaymentMethods();
                } else {
                    this.props.attemptAddPayment({ tokenId: token });
                    this.clearCardForm();
                }
            }
        }, (error) => {
            const { messages } = error;
            this.setState({ cardValidationError: messages[0].message });
        });
    };

    pinScriptLoaded = () => {
        this.setState({ pinScriptLoaded: true });
            this.pinApi = new Pin.Api(params.pinPayment.publicKey, params.pinPayment.environment);
    };

    handleCardNumberChange = ({ target: { value } }) => {
        this.setState(({ fields }) => {

            return { fields: { ...fields, number: value } };
        });
    };

    handleCardExpiryChange = ({ target: { value } }) => {
        this.setState(({ fields }) => {
            return { fields: { ...fields, expiry: value } };
        });
    };

    handleCardCVCChange = ({ target: { value } }) => {
        this.setState(({ fields }) => {
            return { fields: { ...fields, cvc: value } };
        });
    };

    handleChange = (change) => {
        if (change.error !== undefined) {
            this.props.attemptCardValidationFailed({ cardValidationError: change.error.message });
        } else {
            this.props.attemptCardValidationSucceed();
        }
    };

    onChange = ({ currentTarget: { name, value } }) => {
        let newState = cloneDeep(this.state);

        newState.errors[name] = this.validate(name, value);
        newState.fields[name] = value;

        if (!isEqual(this.state, newState)) {
            this.setState(newState);
        }
    };

    validate(name, value) {
        switch (name) {
                case 'address_line1':
                    if (isEmpty(value)) {
                        return REQUIRED('Address line1');
                    } else {
                        return '';
                    }
                case 'address_city':
                    if (isEmpty(value)) {
                        return REQUIRED('Address City');
                    } else {
                        return '';
                    }
                case 'number':
                    if(isEmpty(this.state.fields.number) 
                    && isEmpty(this.state.fields.expiry) 
                    && isEmpty(this.state.fields.cvc)) {
                        return REQUIRED('Credit card');
                    }  else {
                        return ''
                    }
        }
    }

    render() {
        const { fields, cardValidationError } = this.state;
        const { number, cvc, expiry, address_line1, address_city } = fields;
        const { card } = this.props;
        const cards = card && card.get('cards').toJS();
        const limit = this.props.card.toJS().cards.length;

        const message = this.props.card.toJS().message.message;
        const type = this.props.card.toJS().message.type;

        let inputs = [
            {
                name: 'address_line1',
                label: 'Address line *',
                type: 'text',
                error: '',
                tooltip: 'Address Line',
            },
            {
                name: 'address_city',
                label: 'Address City *',
                type: 'text',
                error: '',
                tooltip: 'Address City'
            }
        ];

        inputs.map(input => input.error = converter(cloneDeep(this.state.errors), input.name));

        return (
            <div>
                <Script
                    url={PIN_PAYMENT_URL}
                    onLoad={this.pinScriptLoaded}
                />
                <div className="payment-form-wrapper">
                    <form onSubmit={this.handleSubmit} noValidate>
                        {
                            limit !== 5 ? (
                        <Row>                        
                            <Col xs="12" sm="4" className="credit-card-wrapper">
                                <CreditCardInput
                                    cardNumberInputProps={{ value: number, onChange: this.handleCardNumberChange }}
                                    cardExpiryInputProps={{ value: expiry, onChange: this.handleCardExpiryChange }}
                                    cardCVCInputProps={{ value: cvc, onChange: this.handleCardCVCChange }}
                                    fieldClassName="input"
                                />  
                                <p className='credit-card-error'>{this.state.errors.number}</p>                            
                            </Col>
                                <Form
                                    inputs={inputs}
                                    fields={clone(this.state.fields)}
                                    eventHandler={this.onChange}
                                    noLabel
                                />                            
                            <Col xs="12" sm="2" className="text-center btnCreate-wrapper">
                                <button className='col-xs-10 col-sm-12 col-xs-push-1 col-sm-push-0 btn btnViolet'
                                        type="submit">{this.props.params && this.props.params.cardId ? 'UPDATE CARD' : 'ADD CARD'}</button>
                            </Col>
                        </Row>                                    
                            ) : ''
                        }
                        <p className='errorMessage'>{cardValidationError}</p>
                        <p className='errorMessage'>{card && card.get('cardValidationError')}</p>
                        <div className="notification_message">
                            <div>
                                <Notification
                                    type={type}
                                    message={message}/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => selector(state, false, ['payment', 'auth-user']);

const mapDispatchToProps = dispatch => {
    return {
        clear: () => dispatch(clear()),
        attemptCardValidationFailed: data => dispatch(attemptCardValidationFailed(data)),
        attemptCardValidationSucceed: () => dispatch(attemptCardValidationSucceed()),
        attemptAddPayment: data => dispatch(attemptAddPayment(data)),
        attemptGetPayment: () => dispatch(attemptGetPayment()),
        attemptUpdatePayment: (data) => dispatch(attemptUpdatePayment(data)),
        attemptDeletePayment: data => dispatch(attemptDeletePayment(data)),
        attemptDefaultPayment: data => dispatch(attemptDefaultPayment(data)),
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PaymentForm));
