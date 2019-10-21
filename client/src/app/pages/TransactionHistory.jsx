import React from 'react';
import { connect } from 'react-redux';
import { selector } from '../services';
import { cloneDeep, isEqual } from 'lodash';
import { attemptGetBookings, attemptDownloadDocs } from '../modules/booking/BookingActions';
import { MerchantDashboardLayout } from 'components/core';
import moment from 'moment';
import { each } from 'lodash';

const bookingsState = {
    bookings: [],
    last30Days: 0,
    lastYear: 0,
    loading: false
};

export class TransactionHistory extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = cloneDeep(bookingsState);
    }

    componentDidMount(){
      this.props.attemptGetBookings();
    }

  componentDidUpdate(prevProps) {
    if(this.props !== prevProps){
      this.setState({ bookings: this.props.bookingData.toJS().bookings.bookings,
        last30Days: this.props.bookingData.toJS().bookings.last30Days,
        lastYear: this.props.bookingData.toJS().bookings.lastYear});
      if(this.props.bookingData.toJS().docs.length > 0){
        each(this.props.bookingData.toJS().docs, doc => {
          window.location.href = doc.link;
        });
      }
      }
    }

    downloadDocs(evt){
      evt.preventDefault();
      this.props.attemptDownloadDocs(evt.target.id);
    }

    render() {

        return (
            <MerchantDashboardLayout>
                <div className='panel panel-default'>
                    <div className='panel-body'>
                        <div className='panel panel-default'>
                            <div className='panel-heading'>
                              ALL BOOKINGS
                            </div>
                            <div className='panel-body'>
                              { this.state.bookings.length > 0 ? <div>
                            <div className="row">
                              <div className="col-sm-3 col-sm-push-9">
                                <div style={{float: 'left', padding: '10px', borderRight: '1px solid #BABABA'}}>
                                  <div style={{color: '#0AFFFF', fontSize: '20px'}}>${this.state.last30Days}</div>
                                  <div>LAST 30 DAYS</div>
                                </div>
                                <div style={{float: 'left', padding: '10px'}}>
                                  <div style={{color: '#0AFFFF', fontSize: '20px'}}>${this.state.lastYear}</div>
                                  <div>YEAR TO DATE</div>
                                </div>
                              </div>
                            </div>
                            <table className="table col-sm-12">
                                <thead style={{borderBottom: '1px solid #BABABA'}}>
                                  <tr>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Consultant</th>
                                    <th>Reference</th>
                                    <th>Price</th>
                                    <th>Itinerary</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.bookings.map((booking, key) => {
                                    return (
                                      <tr>
                                        <td style={{textAlign: 'center'}}>{booking.status}</td>
                                        <td style={{textAlign: 'center'}}>{moment(booking.created_at).format('YYYY-MM-DD')}</td>
                                        <td style={{textAlign: 'center'}}>{booking.customer.name}</td>
                                        <td style={{textAlign: 'center'}}>{booking.customer_email}</td>
                                        <td style={{textAlign: 'center'}}>{booking.merchant_name}</td>
                                        <td style={{textAlign: 'center'}}>{booking.merchant_ref}</td>
                                        <td style={{textAlign: 'center'}}>${booking.total_charge}</td>
                                        <td style={{textAlign: 'center'}}><a href="#" id={booking.id} onClick={this.downloadDocs.bind(this)}>VIEW</a></td>
                                      </tr>
                                      );
                                  })}
                                </tbody>
                              </table>
                            </div>
                                  : <div className="align-center">
                                    <p>No bookings found.</p>
                                  </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </MerchantDashboardLayout>
        );
    }
}

const mapStateToProps = state => selector(state, false, ['booking']);

const mapDispatchToProps = dispatch => {
    return {
        attemptGetBookings: () => dispatch(attemptGetBookings()),
        attemptDownloadDocs: (data) => dispatch(attemptDownloadDocs(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory);
