import React from 'react';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { attemptGetInvoices } from '../../app/modules/invoice/InvoiceActions';
import { selector } from '../../app/services';

const invoicesState = {
    invoices: []
};

export class Invoices extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = cloneDeep(invoicesState);
    }
    
    componentDidMount() {
        const { attemptGetInvoices } = this.props;
        attemptGetInvoices();
    }
    
    componentDidUpdate() {
        const { invoiceData } = this.props;
        if (invoiceData.toJS().invoices !== this.state.invoices) {
            let newState = cloneDeep(this.state);
            newState.invoices = invoiceData.toJS().invoices;
            this.setState(newState);
        }
    }
    
    render() {
        return (
            <table className="table table-condensed">
                <thead>
                <tr>
                    <th>Invoice Id</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Closed</th>
                </tr>
                </thead>
                <tbody>
                {this.state.invoices.map((invoice, key) => {
                    
                    return (
                        <tr key={key}>
                            <td>{invoice.invoice_id}</td>
                            <td>{invoice.amount_due}</td>
                            <td>{moment.unix(invoice.date).format('Do MMM YYYY')}</td>
                            <td>{invoice.is_closed}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        );
    }
}

const mapStateToProps = state => selector(state, false, ['invoice']);

const mapDispatchToProps = dispatch => {
    return {
        attemptGetInvoices: () => dispatch(attemptGetInvoices())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Invoices);
