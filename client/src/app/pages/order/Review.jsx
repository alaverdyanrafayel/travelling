import React from 'react';
import { connect } from 'react-redux';
import { Col, Button, Row } from 'reactstrap';
import { FormGroup } from 'components/form-elements';
import { Loading } from 'components/common';
import { Notification } from 'components/core';
import { cloneDeep } from 'lodash';
import { attemptGetBooking } from '../../modules/booking/BookingActions';
import { selector } from '../../services';
import {
    INFO_EMAIL,
    BANK_STATEMENTS_CHECK_URL } from 'configs/constants';

const reviewBookingState = {
    amount: '',
    totalAmount: '',
    merchantName: ''
};

export class Review extends React.Component {
    constructor(props) {
        super(props);

        this.state = cloneDeep(reviewBookingState);
    }

    componentDidMount() {
        const { id } = this.props.router.params;
        this.props.attemptGetBooking(id);
    }

    redirectToBankstatementsCheck() {
        this.props.router.push(`${BANK_STATEMENTS_CHECK_URL}${this.props.params.id}/`);
    }

    handleContinue = () => {
        this.redirectToBankstatementsCheck();
    };


    render() {
        const booking = this.props.bookingData.get('singleBooking');
        const message = this.props.bookingData.get('message');
        
        return(
            <div>
                <Col sm={12} className="logoWrapper col-xs-12">
                    <img className="img-responsive box-center" src="/img/logo-big.png" alt="logo"/>
                </Col>
                { booking.size > 0 ? (
                    <div className='mainWrapper'>
                    <div>
                        <Row>
                            <Col>
                                <div className='bordered-box' style={{ width: 400 }}>
                                    <Row>
                                        <Col sm='12' md='12'>
                                            <Row>
                                                <p><b>
                                                    Your booking with {booking.get('merchant_name')} has
                                                    been requested to be paid in 12
                                                    interest-free instalments of ${booking.get('weekly_price')} with Holipay.</b>
                                                </p>
                                            </Row>
                                        </Col>
                                        <Col sm='6' md='12' className='col-xs-8'>
                                            <Row>
                                                <p>
                                                    Total amount: ${booking.get('total_charge')}
                                                </p>
                                            </Row>
                                        </Col>
                                        <Col sm='6' md='12' className='col-xs-8'>
                                            <Row>
                                                <p>
                                                  <b>To proceed with your booking, please press continue.</b>
                                                </p>
                                            </Row>
                                        </Col>

                                    <FormGroup groupClass='col-xs-8 col col-sm-6 col-md-12'>
                                            <Button className='btn-verify' onClick={this.handleContinue}>CONTINUE</Button>
                                    </FormGroup>
                                    <p className="col-xs-12">Didn't request this booking or the amount isn't correct? Contact the merchant
                                      directly or connect with Holipay support directly via the website live chat, or via <a href={`mailto:${INFO_EMAIL}`}>email</a>.</p>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                ) : (message.size > 0) ? (
                    <div className="col-sm-12">
                        <div className="notification_message_container text-center">
                            <div className="notification_message">
                                <div>
                                    <Notification
                                        type={message.get('type')}
                                        message={message.get('message')}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                 :  <Loading/> }
            </div>
        );
    }
}

const mapStateToProps = state => selector(state, false, ['booking']);

const mapDispatchToProps = dispatch => {
    return {
        attemptGetBooking: data => dispatch(attemptGetBooking(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Review);
