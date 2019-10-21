import React, { Component } from 'react';
export default function asyncComponent(getComponent) {
    class AsyncComponent extends Component {
        static Component = null;
        state = { Component: AsyncComponent.Component };
        
        componentWillMount() {
            if (!this.state.Component) {

                return getComponent().then(Component => {
                    AsyncComponent.Component = Component;
                    this.setState({ Component });

                    return true;
                });
            }
        }

        render() {
            const { Component } = this.state;
            if (Component) {

                return (<Component {...this.props} />);
            }

            return null;
        }
    }

    return AsyncComponent;
}
