import React from 'react';
import { connect } from 'react-redux';
import { withRouter, IndexLink } from 'react-router';
import { cloneDeep } from 'lodash';
import { APP_MERCHANT_ROUTE,
  HOLIPAY_HELP_URL,
  HOLIPAY_MEDIUM_URL
         } from 'configs/constants';
import { NavBar } from '../common';
import { selector } from '../../app/services';
import { attemptGetUser, attemptLogOutUser } from '../../app/modules/auth-user/AuthUserActions';

const dashboardState = {

    user: {
        customer: {}
    }
};

class MerchantDashboardLayout extends React.Component {

    constructor(props) {
        super(props);

        this.state = cloneDeep(dashboardState);
    }

    redirectToHomePage = () => {
        const { loggedInUser } = this.props;

        if ( !loggedInUser ) {
            this.props.router.push(APP_MERCHANT_ROUTE);
        }
    };

    componentDidMount() {
        const { loggedInUser } = this.props;

        if (loggedInUser) {
            this.setState({ user: loggedInUser });
        }
    }

    componentDidUpdate(prevProps) {
        const { loggedInUser } = this.props;
        if (loggedInUser && loggedInUser !== prevProps.loggedInUser) {
            this.setState({ user: this.props.loggedInUser.user });
        }

        this.redirectToHomePage();
    }

    onSignOut = (event) => {
        event.preventDefault();
        const { attemptLogOutUser } = this.props;
        attemptLogOutUser();
        window.location.href = '/merchants';
    };

    static childContextTypes = {
        loggedInUser: React.PropTypes.object
    };

    getChildContext() {
        return { loggedInUser: this.props.loggedInUser };
    }

    render() {
        return (
            <div>
                <div style={{
                    zIndex: '1000',
                    position: 'fixed',
                    top: '0px',
                    width: '100%',
                    height: '80px',
                }}> {NavBar({ backgroundColor: '#fff' }, 0, 'dashboard', this.onSignOut ) }</div>
                <div className="container-fluid main-container">
                             <div className="col-xs-12 col-sm-offset-4 col-sm-4 col-md-offset-0 col-md-2 sidebar dashboard-left">
                                <div className="card hovercard">
                                    <div className="cardheader"/>
                                    <div className="avatar">
                                        <span className="fa fa-user user-icon"/>
                                    </div>
                                    <div className="info">
                                        <div className="title">
                                            {this.props.loggedInUser.toJS().merchant.business_name}
                                        </div>
                                    </div>
                                </div>
                            <div className="dashboard_left_nav">
                              <div className="row layout-row">
                                <IndexLink to="/merchant-dashboard/" activeClassName="f-color_purple" className="layoutDirecting ">
                                  <span className="glyphicon glyphicon-plane"/> Create Booking
                                </IndexLink><br/>
                              </div>
                              <div className="row layout-row">
                                <IndexLink to="/transaction-history/" activeClassName="f-color_purple" className="layoutDirecting">
                                  <span className="glyphicon glyphicon-send"/> All Bookings
                                </IndexLink><br/>
                              </div>
                              <div className="row layout-row">
                                <a href={HOLIPAY_HELP_URL} className="layoutDirecting" target="_blank">
                                  <span className="glyphicon glyphicon-question-sign"/> Merchant Help Centre
                                </a><br/>
                              </div>
                              <div className="row layout-row">
                                <a href={HOLIPAY_MEDIUM_URL} className="layoutDirecting" target="_blank">
                                   <span className="glyphicon glyphicon-cloud"/> Blog
                                </a><br/>
                              </div>
                        </div>
                    </div>
                    <div className="col-md-10 content right-content content-merchant">
                        { this.props.children }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => selector(state);

const mapDispatchToProps = dispatch => {
    return {
        attemptLogOutUser: () => dispatch(attemptLogOutUser()),
        attemptGetUser: () => dispatch(attemptGetUser())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MerchantDashboardLayout));
