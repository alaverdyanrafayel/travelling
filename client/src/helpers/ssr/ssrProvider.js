/* eslint-disable no-unused-vars */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, match, createRoutes } from 'react-router';
import appRouter from '../../app/services/router.jsx';
import { Provider } from 'react-redux';
import { SSR_URLS } from './../../configs/constants';
import { mainReducer } from '../../app/services';
import { createStore } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const routes = createRoutes(appRouter());
const helpers = require('../../../../build/helpers');

export const handleSSR = (req, res) => {
    // urls included in the SSR_URLS array are rendered by server side.
    if (SSR_URLS.includes(req.url)) {
        match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
            if (error) {
                res.status(500).send(error.message);
            } else if (redirectLocation) {
                res.redirect(302, redirectLocation.pathname + redirectLocation.search);
            } else if (renderProps) {
                // Create a new Redux store instance
                const store = createStore(mainReducer);
                // Render the component to a string
                const ssrContent = renderToString(
                    <MuiThemeProvider>
                        <Provider store={store}>
                            <RouterContext {...renderProps} />
                        </Provider>
                    </MuiThemeProvider>
                );
                // Send the rendered page back to the client
                res.render('index', { ssrContent });
            } else {
                res.status(404).send('Not Found');
            }
        });
    } else {
        res.sendFile(helpers.root('client/production/index.html'));
    }
    
};
