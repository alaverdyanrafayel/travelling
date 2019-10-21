import React from 'react';
import { connect } from 'react-redux';
import { selector } from '../../services';
import { cloneDeep } from 'lodash';
import { BankStatementsCheckForm } from 'components/core';
import { attemptGetStatus } from '../../modules/bankstatements/BankstatementsActions';
import { attemptEquifaxCheck } from '../../modules/auth-user/AuthUserActions';
import { FormGroup } from 'components/form-elements';
import { Button } from 'reactstrap';
import { BANK_STATEMENTS_PASSED,
         BANK_STATEMENTS_FAILED,
         EQUIFAX_CHECK_URL,
         PENDING,
         PASSED,
         FAILED,
         CONFIRM_ORDER } from 'configs/constants';

const checkState = {
  timer: null,
  isEquifaxRun: false
};

export class BankStatementsCheck extends React.Component {

  constructor(props) {
      super(props);
      this.state = cloneDeep(checkState);
  }
  componentDidMount() {
    let timer = setInterval(() => this.props.attemptGetStatus(this.props.router.params.bookingId), 5000);
    this.setState({timer});
  }

  redirectToConfirmOrder() {
    this.props.router.push(`${CONFIRM_ORDER}/${this.props.router.params.bookingId}/`);
  }

  componentDidUpdate(prevProps){
    const { userErrors, userFields } = this.props;
    if(prevProps.bankstatementsData.toJS().status !== this.props.bankstatementsData.toJS().status && this.props.bankstatementsData.toJS().status.data !== PENDING){
      clearInterval(this.state.timer);
      if (this.props.bankstatementsData.toJS().status.data === FAILED){
        this.props.attemptEquifaxCheck(this.props.params.bookingId);
        this.setState({ isEquifaxRun: true });
      } else if (this.props.bankstatementsData.toJS().status.data === PASSED) {
          this.redirectToConfirmOrder();
      }
    }
    if(this.state.isEquifaxRun){
      if(userErrors && userErrors.length > 0){
        this.redirectToConfirmOrder();
      }
      else if (userFields &&  !userFields.equals(this.props.userFields)) {
        this.redirectToConfirmOrder();
      }
    }
  }

    render() {
        return (
            <div className='panel panel-default'>
                <div className='panel-body'>
                    <div className='panel panel-default'>
                        <div className='panel-heading'>
                            Bankstatements Check
                        </div>
                        <div className='panel-body'>
                          <BankStatementsCheckForm bookingId={this.props.router.params.bookingId} customerId={this.props.loggedInUser.toJS().id}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => selector(state, false, ['bankstatements', 'auth-user']);

const mapDispatchToProps = dispatch => {
    return {
      attemptGetStatus: data => dispatch(attemptGetStatus(data)),
      attemptEquifaxCheck: (data) => dispatch(attemptEquifaxCheck(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BankStatementsCheck);
