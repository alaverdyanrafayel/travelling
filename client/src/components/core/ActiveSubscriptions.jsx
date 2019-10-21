import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { ReactBootstrapSlider } from 'react-bootstrap-slider';
import { cloneDeep } from 'lodash';
import { selector } from '../../app/services';
import { attemptGetSubscriptions } from '../../app/modules/subscription/SubscriptionActions';

const subscriptionsState = {
    sliderMin: 0,
    sliderMax: 77,
    sliderStep: 7,
    subscriptions: []
};

export class ActiveSubscriptions extends React.Component {

    constructor(props) {
        super(props);
        this.state = cloneDeep(subscriptionsState);
    }

    componentDidMount() {
        if(this.context.loggedInUser) {
            let loggedInUser = this.context.loggedInUser.toJS();
            const { attemptGetSubscriptions } = this.props;
            if(loggedInUser.payment_customer_id && loggedInUser.payment_customer_id.length > 0) {
                attemptGetSubscriptions();
            }
        }
    }

    componentDidUpdate() {
        const { subscriptionData } = this.props;
        if (subscriptionData.toJS().subscriptions !== this.state.subscriptions) {
            let newState = cloneDeep(this.state);
            newState.subscriptions = subscriptionData.toJS().subscriptions;
            this.setState(newState);
        }
    }

    static contextTypes = {
        loggedInUser: React.PropTypes.object
    };

    render() {
        return (
            <div>
                {this.state.subscriptions.map((subscription, key) => {
                    return (
                        <div key={key}>
                            <span className="progress-title">{moment.unix(subscription.start).format('Do MMM YYYY')}</span>
                            <ReactBootstrapSlider
                                value={moment.duration(moment.unix(subscription.start).diff(moment.unix(subscription.current_period_start))).days()}
                                step={this.state.sliderStep}
                                max={this.state.sliderMax}
                                min={this.state.sliderMin}
                                orientation="horizontal"
                                reversed={false}
                                ticks={[0, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77]}
                                ticks_labels={[ '',
                                    moment.unix(subscription.start)
                                            .add(1, 'week')
                                            .format('Do MMM'),
                                    moment.unix(subscription.start)
                                            .add(2, 'weeks')
                                            .format('Do, MMM'),
                                    moment.unix(subscription.start)
                                            .add(3, 'weeks')
                                            .format('Do, MMM'),
                                    moment.unix(subscription.start)
                                            .add(4, 'weeks')
                                            .format('Do, MMM'),
                                    moment.unix(subscription.start)
                                            .add(5, 'weeks')
                                            .format('Do, MMM'),
                                    moment.unix(subscription.start)
                                            .add(6, 'weeks')
                                            .format('Do, MMM'),
                                    moment.unix(subscription.start)
                                            .add(7, 'weeks')
                                            .format('Do, MMM'),
                                    moment.unix(subscription.start)
                                            .add(8, 'weeks')
                                            .format('Do, MMM'),
                                    moment.unix(subscription.start)
                                            .add(9, 'weeks')
                                            .format('Do, MMM'),
                                    moment.unix(subscription.start)
                                            .add(10, 'weeks')
                                            .format('Do, MMM'),
                                    '' ]}
                                ticks_snap_bounds={30}/>
                            <span
                                className="progress-title">{moment.unix(subscription.start)
                                        .add(12, 'weeks')
                                        .format('Do MMM YYYY')}</span>
                        </div>
                    );
                })}
            </div>
        );
    }
}

const mapStateToProps = state => selector(state, false, ['subscription']);

const mapDispatchToProps = dispatch => {
    return {
        attemptGetSubscriptions: () => dispatch(attemptGetSubscriptions())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveSubscriptions);
