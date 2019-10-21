import React from 'react';
import { Col } from 'reactstrap';
import { CUSTOMER_DASHBOARD_ROUTE, SUCCESS } from '../../../configs/constants';
import { cloneDeep } from 'lodash';
import { selector } from '../../services';
import { connect } from 'react-redux';
import { attemptGetBooking, attemptConfirmOrder } from '../../modules/booking/BookingActions';
import ApproveBooking from '../../../components/core/ApproveBooking';
import DeclineBooking from '../../../components/core/DeclineBooking';

const FinalisePaymentsState = {
    weeklyPrice: '',
    amount: '',
    charge: '',
    cardId: ''
};

export class ConfirmOrder extends React.Component{
    booking;

    constructor(props) {
        super(props);

        this.state = cloneDeep(FinalisePaymentsState);

        this.booking = this.props.bookingData.get('singleBooking');
    }

    redirectToCustomerDashboard() {
        this.props.router.push(CUSTOMER_DASHBOARD_ROUTE);
    }

    componentDidMount() {
        const isEquifaxPassed = this.booking.get('is_equifax_passed');
        const isBankstatementsPassed = this.booking.get('is_bankstatements_passed');
        if ( isEquifaxPassed !== 1 && isBankstatementsPassed !== 1) {
            this.props.attemptConfirmOrder(this.props.router.params.bookingId);
        }
    }

    componentDidUpdate(){
        const messageType = this.props.bookingData.get('message').toJS().type;
        if(messageType === SUCCESS){
            setTimeout(() => {
                this.redirectToCustomerDashboard();                
            }, 1000);
        }
    }

    handleConfirm = (cardId) => {
        const firstCard = this.props.card.get('cards').get(0);
        const bookingId = this.props.router.params.bookingId;
        cardId = cardId || (firstCard && firstCard.get('cardId'));
        this.props.attemptConfirmOrder({ bookingId, cardId });
    };

    handleDecline = (ev) => {
        ev.preventDefault();
        this.redirectToCustomerDashboard();        
    };

    render() {
        const booking = this.props.bookingData.get('singleBooking');
        const message = this.props.bookingData.get('message');
        const type = this.props.bookingData.get('type');
    
        return(
            <div>
                <Col sm={12} className="logoWrapper">
                    <img className="img-responsive box-center" src="/img/logo-big.png" alt="logo"/>
                </Col>
                {
                    booking.get('is_equifax_passed') || booking.get('is_bankstatements_passed') ? (
                    <div className="mainWrapper">
                        <ApproveBooking {...this.props } 
                            notificationMessage = {message}
                            notificationType = {type}
                            handleConfirm={this.handleConfirm} 
                            booking = {booking}
                        />

                    </div>
                    ) : (
                        <div className="mainWrapper">
                            <DeclineBooking handleDecline={this.handleDecline} />
                        </div>
                    )
                } 
            </div>
        );
    }
}

const mapStateToProps = state => selector(state, false, ['booking', 'payment']);

const mapDispatchToProps = dispatch => {
    return {
        attemptGetBooking: data => dispatch(attemptGetBooking(data)),
        attemptConfirmOrder: data => dispatch(attemptConfirmOrder(data)), 
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmOrder);
