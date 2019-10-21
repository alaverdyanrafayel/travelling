import React from 'react';
import { Provider } from 'react-redux';
import { browserHistory, Router } from 'react-router';
import getAppConfigurations from 'helpers/app/getAppConfigurations';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'sass/vendor.scss';

export const App = () => {

    const { store, routes } = getAppConfigurations();

    function hashLinkScroll() {
        const hash = typeof window !== 'undefined' ? window.location.hash : '';
        if (hash !== '') {
            // Push onto callback queue so it runs after the DOM is updated,
            // this is required when navigating from a different page so that
            // the element is rendered on the page before trying to getElementById.
            setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView();
                }
            }, 0);
        }
    }

    return (
        <MuiThemeProvider>
            <Provider store={store}>
                <Router history={browserHistory} routes={routes} onUpdate={hashLinkScroll}/>
            </Provider>
        </MuiThemeProvider>
    );
};

export default App;
