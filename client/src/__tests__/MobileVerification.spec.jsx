import React from 'react';
import { MobileVerification } from '../app/pages/MobileVerification';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { Map } from 'immutable';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
    REQUIRED,
    INVALID_MOBILE_NUMBER,
    INVALID_VERIFICATION_CODE } from 'configs/constants';

configure({ adapter: new Adapter() });

function Router () {
    this.router = [];

    this.push = function(a) {
        this.router.push(a);
    };
}
const props = {
    userFields: Map({}),
    router: new Router(),
    userErrors: Map({}),
    loggedInUser: Map({}),
    location: { location: { query: '' } },
    loadingData: Map({}),
};

const muiTheme = getMuiTheme();
const context = { context: { muiTheme }, childContextTypes: { muiTheme: React.PropTypes.object } };

describe('Component mobileVerification', () => {
    let wrapper;
    
    beforeEach(() => {
        wrapper = mount(<MobileVerification {...props}/>, { ...context });
    });
    
    test('Should render the mobileVerification component', () => {
        expect(wrapper.length).toBe(1);
    });

    test('Mobile Verification component should have Mobile Number input', () => {
        expect(wrapper.find(MobileVerification).find('input[name="mobileNumber"]').length).toBe(1);
    });

    test('Mobile Verification component should have Verification Code input', () => {
        expect(wrapper.find(MobileVerification).find('input[name="verificationCode"]').length).toBe(1);
    });

    test('Mobile Verification  component should have two buttons', () => {
        expect(wrapper.find(MobileVerification).find('Button').length).toBe(2);
    });

    test('Mobile Number is required', () => {
        const input = wrapper.find(MobileVerification).find('input[name="mobileNumber"]');
        input.simulate('change', { target: { name: 'mobileNumber', value: '' } });
        expect(wrapper.state().errors.mobileNumber).toBe(REQUIRED('Mobile Number'));
    });

    test('Verification Code is required', () => {
        const input = wrapper.find(MobileVerification).find('input[name="verificationCode"]');
        input.simulate('change', { target: { name: 'verificationCode', value: '' } });
        expect(wrapper.state().errors.verificationCode).toBe(REQUIRED('verificationCode'));
    });

    test('Mobile Number is invalid', () => {
        const input = wrapper.find(MobileVerification).find('input[name="mobileNumber"]');
        input.simulate('change', { target: { name: 'mobileNumber', value: '+61 458 585 4  ' } });
        expect(wrapper.state().errors.mobileNumber).toBe(INVALID_MOBILE_NUMBER('Mobile Number'));
    });

    test('Verification Code is invalid', () => {
        const input = wrapper.find(MobileVerification).find('input[name="verificationCode"]');
        input.simulate('change', { target: { name: 'verificationCode', value: '245  ' } });
        expect(wrapper.state().errors.verificationCode).toBe(INVALID_VERIFICATION_CODE('Verification Code'));
    });

});
