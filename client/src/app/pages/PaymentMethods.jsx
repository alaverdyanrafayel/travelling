import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router';
import { selector } from '../services';
import { each } from 'lodash';
import {
    attemptDeletePayment,
    attemptDefaultPayment,
    attemptGetPayment,
    attemptCardValidationFailed } from '../modules/payment/PaymentActions';
import {
    PAYMENT_METHODS,
    PAYMENT_UPDATED } from 'configs/constants';
import { CustomerDashboardLayout } from 'components/core';
import PaymentForm from 'components/core/PaymentForm';
import { FriendReferralForm } from 'components/core';

export class PaymentMethods extends React.Component {

    componentDidMount() {

        this.props.attemptGetPayment();
    }

    redirectToPaymentMethods() {
        this.props.router.push(PAYMENT_METHODS);
    }

    componentDidUpdate(prevProps) {

        if (!prevProps.card.equals(this.props.card)) {
            this.redirectToPaymentMethods();
        }
    }

    handleDefault = (event) => {
        this.props.attemptDefaultPayment(event.target.id);
    };

    handleDelete = (event) => {
        this.props.attemptDeletePayment(event.target.id);
    };

    render() {
        const { card } = this.props;
        const cards = card && card.get('cards').toJS();

        return (
            <CustomerDashboardLayout>
                <div className='panel panel-default'>
                    <div className='panel-body'>
                        <div className='panel panel-default'>
                            <div className='panel-heading'>
                                Payment Methods
                            </div>
                            <div className='panel-body'>
                                <div>
                                    {
                                        !this.props.params.cardId && (
                                            <div className="payment-table-wrapper">
                                                <table className="payment-table">
                                                    <thead>
                                                    <tr>
                                                        <th className="card-number">Card Number</th>
                                                        <th className="card-exp-month">Expires</th>
                                                        <th className="card-address-line">Billing address</th>   
                                                        <th className="card-address-city">City</th>                                                                                                                                                                     
                                                        <th className="actions">Actions</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {cards && cards.map((card, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td className="card-number">{card.displayNumber}</td>
                                                                <td className="card-exp-month">{card.expMonth}/{card.expYear}</td>
                                                                <td className="card-address-line">{card.addressLine1}</td>
                                                                <td className="card-address-city">{card.addressCity}</td>                                                                
                                                                <td className="actions">
                                                                    <span id={card.cardId}
                                                                          onClick={this.handleDefault} className="fa fa-check"
                                                                          style={ card.primary ? { color: '#018000' } : { color: '#BABABA', cursor: 'pointer' }}/>
                                                                    <Link to={`payment-methods/${card.cardId}/`}>
                                                                        <span className="fa fa-pencil btn-pencil"/>
                                                                    </Link>
                                                                    <span className="fa fa-trash btn-del" id={card.cardId}
                                                                          onClick={this.handleDelete}/>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                    </tbody>
                                                </table>
                                            </div>

                                        )
                                    }
                                            <PaymentForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                < FriendReferralForm />
            </CustomerDashboardLayout>
        );
    }
}
const mapStateToProps = state => selector(state, false, ['payment']);

const mapDispatchToProps = dispatch => {
    return {
        attemptGetPayment: () => dispatch(attemptGetPayment()),
        attemptDeletePayment: data => dispatch(attemptDeletePayment(data)),
        attemptDefaultPayment: data => dispatch(attemptDefaultPayment(data)),
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PaymentMethods));
