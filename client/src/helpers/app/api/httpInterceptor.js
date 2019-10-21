/* eslint-disable promise/no-promise-in-callback */

import axios from 'axios';
import {
    ACCESS_TOKEN
} from 'configs/constants';
import queryString from 'query-string';
import * as AuthApi from 'api/AuthApi';

/* Handles access-token expiration, involves attaching access-token as an Authorization header with
the Bearer scheme, intercepts all http traffic and then runs the combined, common logic. */
class HttpInterceptor {
    refreshToken = false;
    errorCallback;

    requestInterceptor() {
        axios.interceptors.request.use(config => {
            const token = localStorage.getItem('token');
            if(token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                config.data = queryString.stringify(config.data);
            }

            return config;
        }, error => {
            // Do something with request error
            return Promise.reject(error);
        });
    }

    // Handles getting of new access-token if it is expired
    responseInterceptor() {
        axios.interceptors.response.use(response => {
            // Do something with response data
            
            return response;
        }, (error) => {
            const errorMessage = error.response.data;
            const originalRequest = error.config;
            if (!originalRequest._retry && !this.refreshToken && errorMessage && errorMessage === 'Unauthorized') {
                originalRequest._retry = true;
                this.refreshToken = true;

                return AuthApi.refreshToken()
                        .then(({ data }) => {
                            this.refreshToken = false;
                            localStorage.setItem(ACCESS_TOKEN, data.access_token);

                            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

                            return axios(originalRequest);
                        })
                        .catch((err) => {
                            this.refreshToken = false;
                            if (this.errorCallback) {
                                this.errorCallback();
                            }

                            return err;
                        });
            }

            return Promise.reject(error);
        });
    }

    init(params) {
        if (params.errorCallback) {
            this.errorCallback = params.errorCallback;
        }
        this.requestInterceptor();
        this.responseInterceptor();
    }
}

export default new HttpInterceptor;
