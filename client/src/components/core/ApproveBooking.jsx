import React from 'react';
import { connect } from 'react-redux';
import { Col, Button, Row } from 'reactstrap';
import { cloneDeep } from 'lodash';
import { selector } from '../../app/services/index';
import {
    attemptGetPayment,
    attemptAddPayment,
    attemptCardValidationFailed,
    attemptCardValidationSucceed,
    attemptCharges,
    attemptGetBooking } from '../../app/modules/payment/PaymentActions';
import { FormGroup } from 'components/form-elements/index';
import { PaymentForm } from 'components/core/index';
import { withRouter } from 'react-router'
import { Notification } from 'components/core/index';

const checkCardState = {
    cardId: '',
};

export default class ApproveBooking extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = cloneDeep(checkCardState);
    }

    handleChange = (e) => {
        this.setState({ cardId: e.target.value });
    };

    handleConfirm = (ev) => {
        ev.preventDefault();
        this.props.handleConfirm(this.state.cardId);
    }

    render() {
        const { card, notificationMessage, booking } = this.props;
        const cards = card && card.get('cards').toJS();
        
        return(
            <div>
                <div className="mainWrapper">
                    <Row className="createAccountContent">
                        <Col sm={12} className="createAccount text-center pull-left col-xs-12 col-lg-10 col-lg-push-1">
                                <h3>Select payment method</h3>
                            <Col xs='12'>
                                <h4 style={ { float: 'left', paddingTop: 25 } }>Existing payment methods</h4>
                                <Row>
                                    {
                                        <select className="holy-select" onChange={this.handleChange}  value={this.state.cardId} >
                                            {cards && cards.map((card, index) => {
                                                return (
                                                    <option key={index} value={card.cardId}>{card.displayNumber},
                                                        &nbsp; {card.expMonth}/{card.expYear}, &nbsp; {card.addressLine1}, &nbsp; {card.addressCity}</option>
                                                );
                                            })}
                                        </select>
                                    }
                                </Row>
                                <div className='panel mt-30'>
                                    <h5>Need to add a payment method? Add one here:</h5><br/>
                                    <PaymentForm/>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                    <div className='mainWrapper'>
                    <div>
                            <Row>
                                <Col sm="12" md="4" className="col-md-offset-4">
                                    <div className="bordered-box height-400">
                                        <Row>
                                            <Col sm="12" md="12">
                                                <Row>
                                                    <p className = 'approved'>Approved!</p><hr />
                                                </Row>
                                            </Col>
                                            <Col sm="12" md="12">
                                                <Row>
                                                    <p className="packing">Start packing!</p>
                                                </Row>
                                            </Col>
                                            <Col sm='12' md='12'>
                                                <Row>
                                                    <p className="interest-free-payment-finalise">
                                                        12 Interest-Free payments of ${booking.get("weekly_price")} every 7 days.   
                                                     </p>
                                                </Row>
                                            </Col>
                                            <Col sm='6' md='12' className='col-xs-8'>
                                                <Row>
                                                    <p>
                                                        Total amount: ${booking.get("total_charge")}.00
                                                    </p>
                                                </Row>
                                            </Col>
                                            <Col sm='6' md='12' className='col-xs-8'>
                                                <Row>
                                                    <p className="finalise-confirm">
                                                        nce you press Confirm you'll be charged ${booking.get("weekly_price")} today.
                                                    </p>
                                                </Row>
                                            </Col>
                                            <Col sm="12" md="12">
                                                <form>
                                                    <div className="notification_message">
                                                        <div>
                                                                <Notification
                                                                type={ notificationMessage.get("type") }
                                                                message={ notificationMessage.get("message") }/>
                                                        </div>
                                                    </div>
                                                    <FormGroup groupClass="row mt-15">
                                                        <div className="col-xs-12">
                                                            <div className="col-sm-12">
                                                                <Button className="btn-block btnViolet"
                                                                        type="submit"
                                                                        onClick={this.handleConfirm} >
                                                                    <span>CONFIRM</span>
                                                                </Button>
                                                            </div>
                                                        </div>                                                    
                                                    </FormGroup>
                                                    <Col sm="12" md="12">
                                                        <Row className="text-center">
                                                             <a href="">Cancel</a>
                                                        </Row>
                                                    </Col>
                                                </form>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
