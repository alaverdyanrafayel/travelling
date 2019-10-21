import React from 'react';
import { connect } from 'react-redux';
import { selector } from '../../services';
import { APP_MAIN_ROUTE } from 'configs/constants';

class CustomerLoggedInLayout extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (!this.props.loggedInUser) {
            this.props.router.push(APP_MAIN_ROUTE);
        }
    }

    componentDidUpdate(prevProps) {
        if (!this.props.loggedInUser) {
            this.props.router.push(APP_MAIN_ROUTE);
        }
    }

    componentDidMount() {
        if (!this.props.loggedInUser) {
            this.props.router.push(APP_MAIN_ROUTE);
        }
    }

    render() {
        const { children, loggedInUser } = this.props;

        if (loggedInUser) {
            return (
                <div>
                    {children}
                </div>
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => selector(state, false, ['auth-user']);

export default connect(mapStateToProps)(CustomerLoggedInLayout);
