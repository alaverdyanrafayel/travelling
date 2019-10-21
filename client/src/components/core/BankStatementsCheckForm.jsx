import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { selector } from '../../app/services';
import params from '../../configs/params';

export class BankStatementsCheckForm extends React.Component {
    render = () => {
        return (
            <div className="text-center">
                <iframe src={params.bankStatementsCheckUrl + '-' + this.props.customerId + '-' + this.props.bookingId } id='bankstatements' />
            </div>
        );
    };
}

const mapStateToProps = state => selector(state, false, ['bankstatement']);

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BankStatementsCheckForm));
