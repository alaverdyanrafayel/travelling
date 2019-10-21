import React from 'react';
import { connect } from 'react-redux';
import { withRouter, IndexLink } from 'react-router';
import { isEmpty } from 'lodash';
import { cloneDeep } from 'lodash';
import { LOGIN_ROUTE } from 'configs/constants';
import { selector } from '../../app/services';
import { NavBar } from '../common';
import { attemptGetUser, attemptLogOutUser } from '../../app/modules/auth-user/AuthUserActions';

const dashboardState = {

    user: {
        customer: {}
    }
};

class CustomerDashboardLayout extends React.Component {

    constructor(props) {
        super(props);

        this.state = cloneDeep(dashboardState);
    }

    componentDidMount() {

        if(isEmpty(this.state.user.customer)) {
            this.setState({ user: this.props.loggedInUser.toJS() });
        }
    }

    redirectToLogin = () => {
        const { loggedInUser } = this.props;

        if ( !loggedInUser ) {
            this.props.router.push(LOGIN_ROUTE);
        }
    };

    componentDidUpdate(prevProps) {
        const { loggedInUser } = this.props;
        if (loggedInUser && loggedInUser !== prevProps.loggedInUser) {
            this.setState({ user: this.props.loggedInUser.user });
        }
        this.redirectToLogin();
    }

    onSignOut = () => {
        const { attemptLogOutUser } = this.props;
        attemptLogOutUser();
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
                {NavBar({ backgroundColoe: '#fff' }, 0, 'dashboard', this.onSignOut)}
                <div className="container-fluid main-container">
                    <div className="col-xs-12 col-sm-offset-4 col-sm-4 col-md-offset-0 col-md-2 sidebar">
                        <div className="card hovercard">
                            <div className="cardheader"/>
                            <div className="avatar">
                                <span className="fa fa-user user-icon"/>
                            </div>
                            <div className="info">
                                <div className="title">
                                    {this.state.user.customer.first_name}
                                </div>
                            </div>
                          </div>
                          <div className="dashboard_left_nav">
                            <div className="row layout-row">
                                <IndexLink to="/customer-dashboard/" activeClassName="f-color_purple" className="layoutDirecting ">Home</IndexLink><br/>
                            </div>
                            <div className="row layout-row">
                                <IndexLink to="/payment-methods/" activeClassName="f-color_purple" className="layoutDirecting">Payment methods</IndexLink><br/>
                            </div>
                            <div className="row layout-row">
                                <IndexLink to="/customer-dashboard/" className="layoutDirecting">Exclusive deals</IndexLink><br/>
                            </div>
                          </div>
                    </div>
                    <div className="col-sm-12 col-md-10 content">
                        { this.props.children }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => selector(state, false, ['auth-user', 'loading']);

const mapDispatchToProps = dispatch => {
    return {
        attemptLogOutUser: () => dispatch(attemptLogOutUser()),
        attemptGetUser: () => dispatch(attemptGetUser())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomerDashboardLayout));
