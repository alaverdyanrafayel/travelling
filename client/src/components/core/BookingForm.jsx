import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button } from 'reactstrap';
import moment from 'moment';
import { each } from 'lodash';
import mime from 'mime-types';
import { ToastContainer, toast } from 'react-toastify';
import Dropzone from 'react-dropzone';
import { clone, cloneDeep, isEqual } from 'lodash';
import { isEmail, isEmpty } from 'validator';
import { selector } from '../../app/services';
import {
    INVALID_EMAIL,
    REQUIRED,
    INVALID_SURCHARGE,
    INVALID_BASE_VALUE,
    BOOKING_ADDED,
    BOOKING_ADDED_FAILED,
    NEGATIVE_SURCHARGE } from 'configs/constants';
import converter from 'helpers/form/inputDetails';
import { Form, FormGroup } from 'components/form-elements';
import { attemptCreateBooking } from '../../app/modules/booking/BookingActions';

const newBookingState = {
    bookingFields: {
        merchantReference: '',
        merchantName: ''
    },
    bookingErrors: {
        merchantReference: '',
        merchantName: ''
    },
    pricingFields: {
        baseValue: '',
        surcharge: '0'
    },
    pricingErrors: {
        baseValue: '',
        surcharge: ''
    },
    uploadedDocs: [],
    emailFields: {
        email: ''
    },
    emailErrors: {
        email: ''
    },
    totalCharged: '',
    weeklyPrice: '',
    lastPaymentDate: '',
    loading: false,
    showUploadError: false
};

export class BookingForm extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = cloneDeep(newBookingState);
    }

    static contextTypes = {
        loggedInUser: React.PropTypes.object
    };

  componentDidUpdate(prevProps) {
        const { bookingData } = this.props;
        if (bookingData &&  !bookingData.equals(prevProps.bookingData)) {
           if(!bookingData.toJS().errors.data){
             toast.success(BOOKING_ADDED, {
                 position: toast.POSITION.TOP_CENTER
             });
           }
          else{
            console.log(this.props.bookingData.toJS().errors.data);
            toast.error(BOOKING_ADDED_FAILED, {
                position: toast.POSITION.TOP_CENTER
            });
          }
            this.setState({ loading: false });
        }
    }

    handleSubmit = () => {
        const { attemptCreateBooking } = this.props,
            bookingFields = clone(this.state.bookingFields),
            pricingFields = clone(this.state.pricingFields),
            emailFields = clone(this.state.emailFields);

        let bookingValidationErrors = {};
        let pricingValidationErrors = {};
        let emailValidationErrors = {};

        Object.keys(bookingFields).map(name => {
            const error = this.validate(name, bookingFields[name]);
            if (error && error.length > 0) {
                bookingValidationErrors[name] = error;
            }
        });

        Object.keys(pricingFields).map(name => {
            const error = this.validate(name, pricingFields[name]);
            if (error && error.length > 0) {
                pricingValidationErrors[name] = error;
            }
        });

        Object.keys(emailFields).map(name => {
            const error = this.validate(name, emailFields[name]);
            if (error && error.length > 0) {
                emailValidationErrors[name] = error;
            }
        });

        if (Object.keys(bookingValidationErrors).length > 0) {
            this.setState({ bookingErrors: bookingValidationErrors });
        }

        if (Object.keys(pricingValidationErrors).length > 0) {
            this.setState({ pricingErrors: pricingValidationErrors });
        }

        if (Object.keys(emailValidationErrors).length > 0) {
            this.setState({ emailErrors: emailValidationErrors });
        }

        if(this.state.uploadedDocs.length === 0) {
            this.setState({ showUploadError: true });

            return;
        }

        this.setState({ loading: true });
        attemptCreateBooking({ ...bookingFields,
            ...pricingFields,
            ...emailFields,
            totalCharged: this.state.totalCharged,
            weeklyPrice: this.state.weeklyPrice,
            lastPaymentDate: this.state.lastPaymentDate,
            uploadedDocs: this.state.uploadedDocs });

    };

    handleChange = (proxy) => {
        let { value, name } = proxy.target;

        let val = value;

        let newState = cloneDeep(this.state);

        if(name === 'baseValue' || name === 'surcharge') {
            if(this.context.loggedInUser) {
                let user = this.context.loggedInUser.toJS();

                let surcharge = user.merchant.surcharge;

                newState.pricingErrors[name] = this.validate(name, value, surcharge);
                newState.pricingFields[name] = val;
            }
        }
        else if(name === 'merchantReference' || name === 'merchantName') {
            newState.bookingErrors[name] = this.validate(name, value);
            newState.bookingFields[name] = val;
        }
        else{
            newState.emailErrors[name] = this.validate(name, value);
            newState.emailFields[name] = val;
        }

        if (!isEqual(this.state, newState)) {
            this.setState(newState);
        }
    };

    handleBlur = () => {
        if(this.context.loggedInUser) {

            let newState = cloneDeep(this.state);

            newState.totalCharged = parseFloat(this.state.pricingFields.baseValue) +
                (parseFloat(this.state.pricingFields.baseValue) * parseFloat(this.state.pricingFields.surcharge) / 100);

            newState.weeklyPrice =  Number(Math.round((newState.totalCharged / 12) + 'e' + 2) + 'e-' + 2);

            newState.lastPaymentDate = moment(new Date(), 'DD-MM-YYYY').add(77, 'days')
                    .format('MMM Do YYYY');

            if (!isEqual(this.state, newState)) {
                this.setState(newState);
            }
        }
    };

    validate(name, value, surcharge) {
        switch (name) {
                case 'merchantName':
                    if (isEmpty(value)) {
                        return REQUIRED('Name');
                    } else {
                        return '';
                    }
                case 'baseValue':
                    if (isEmpty(value)) {
                        return REQUIRED('Base Value');
                    }
                    else if(parseFloat(value) > 3000) {
                        return INVALID_BASE_VALUE('Base Value');
                    }
                    else {
                        return '';
                    }
                case 'surcharge':
                    if (isEmpty(value.toString())) {
                        return REQUIRED('Surcharge');
                    }
                    else if(parseFloat(value) > surcharge) {
                        return INVALID_SURCHARGE(surcharge);
                    }
                    else if(parseFloat(value) < 0) {
                        return NEGATIVE_SURCHARGE(surcharge);
                    }
                    else {
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
        }
    }

    uploadDocs(accepted)  {

        let newState = cloneDeep(this.state);

        each(accepted, doc => {

            let file = doc;
            const reader = new FileReader();
            reader.onload = (event) => {

                newState.uploadedDocs = [...this.state.uploadedDocs, { name: doc.name, file: event.target.result, size: doc.size, type: mime.lookup(doc.name) }];

                newState.showUploadError = false;

                if (!isEqual(this.state, newState)) {
                    this.setState(newState);
                }
            };
            reader.readAsDataURL(file);
        });

    }

    removeDoc(event) {

        let newState = cloneDeep(this.state);

        newState.uploadedDocs = _.filter(newState.uploadedDocs, doc => {
            if(doc.name !== event.target.id) {
                return doc;
            }
        });

        if (!isEqual(this.state, newState)) {
            this.setState(newState);
        }

        event.preventDefault();
    }

    render = () => {

        let inputsBooking = [
            {
                name: 'merchantReference',
                label: 'Order Reference',
                type: 'text',
                error: '',
                tooltip: 'Enter Order reference',
                colSize: 6,
                groupClass: 'mb-0'
            },
            {
                name: 'merchantName',
                label: 'Consultant Name *',
                type: 'text',
                error: '',
                tooltip: 'Enter your name',
                colSize: 6,
                groupClass: 'mb-0'
            },
        ];

        let inputsPricing = [
            {
                name: 'baseValue',
                handleBlur: this.handleBlur,
                label: 'Base Value *',
                type: 'number',
                error: '',
                tooltip: 'Enter Base Value',
                colSize: 6,
                groupClass: 'mb-0'
            },
            {
                name: 'surcharge',
                handleBlur: this.handleBlur,
                label: 'Surcharge *',
                type: 'percent',
                error: '',
                tooltip: 'Enter Surcharge',
                colSize: 6,
                groupClass: 'mb-0'
            },
        ];

        let inputsEmail = [
            {
                name: 'email',
                label: `Enter the client's email address *`,
                type: 'email',
                error: 'test@gmail.com',
                tooltip: 'Email message',
                colSize: 6,
                groupClass: 'mb-0'
            },
        ];

        let dropzoneRef;
        inputsBooking.map(input => input.error = converter(cloneDeep(this.state.bookingErrors), input.name));
        inputsPricing.map(input => input.error = converter(cloneDeep(this.state.pricingErrors), input.name));
        inputsEmail.map(input => input.error = converter(cloneDeep(this.state.emailErrors), input.name));

        return (
            <div>
                <ToastContainer autoClose={10000} style={{ top: '80px', zIndex: '10001' }}/>
                <div className="login-panel panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Booking details</h3>
                    </div>
                    <div className="panel-body">
                        <Form
                            inputs={inputsBooking} fields={clone(this.state.bookingFields)}
                            noLabel eventHandler={this.handleChange}
                        />
                    </div>
                </div>
                <div className="login-panel panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Pricing and Surcharge</h3>
                    </div>
                    <div className="panel-body">
                        <Form
                            inputs={inputsPricing} fields={clone(this.state.pricingFields)}
                            noLabel eventHandler={this.handleChange}
                        />
                        <div className="col-xs-12">
                            <div className="col col-sm-4">
                                <span className="f-color_purple" style={{ fontSize: '20px' }}>${this.state.totalCharged}</span>
                                <br/>
                                Total charged to client
                            </div>
                            <div className="col col-sm-4">
                                <span className="f-color_purple" style={{ fontSize: '20px' }}>${this.state.weeklyPrice}</span>
                                <br/>
                                Weekly Price
                            </div>
                            <div className="col col-sm-4">
                                <span className="f-color_purple" style={{ fontSize: '20px' }}>{this.state.lastPaymentDate}</span>
                                <br/>
                                Approx. Final Payment Date
                            </div>
                        </div>
                    </div>
                </div>
                <div className="login-panel panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Upload Tax Invoice/Itinerary</h3>
                    </div>
                    <div className="panel-body" style={{ position: 'relative' }}>
                        <Dropzone className="dropzone-style" ref={(node) => { dropzoneRef = node; }} onDrop={this.uploadDocs.bind(this)}>
                            <p>Drop files here.</p>
                        </Dropzone>
                        <button className="dropzone-btn" type="button" onClick={() => { dropzoneRef.open(); }}>
                            Select File
                        </button>
                        {this.state.uploadedDocs.map((doc, key) => {
                            return (
                                <div className="dropzone-file" key={key}>{doc.name}
                                    <a href="#" onClick={this.removeDoc.bind(this)} >
                                        <i id={doc.name} className="fa fa-close" style={{ color: 'red' }} />
                                    </a>
                                </div>
                            );
                        })}
                        {this.state.showUploadError ? <p style={{ color: 'red' }}>Please upload booking document.</p> : ''}
                    </div>
                </div>
                <div className="login-panel panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Client email address</h3>
                    </div>
                    <div className="panel-body">
                        <Form
                            inputs={inputsEmail} fields={clone(this.state.emailFields)}
                            noLabel eventHandler={this.handleChange}
                        />
                    </div>
                </div>
                <FormGroup groupClass="col-xs-12">
                    <div className="col-sm-8 col-sm-push-2">
                        <Button className="btn-block btn-dashboard" disabled={this.state.loading}
                                onClick={this.handleSubmit}>
                            <span>CREATE BOOKING</span>
                        </Button>
                    </div>
                </FormGroup>
            </div>
        );
    };
}

const mapStateToProps = state => selector(state, false, ['booking']);

const mapDispatchToProps = dispatch => {
    return {
        attemptCreateBooking: data => dispatch(attemptCreateBooking(data))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingForm));
