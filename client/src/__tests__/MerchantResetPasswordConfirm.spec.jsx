import React from 'react';
import { MerchantResetPasswordConfirm } from '../app/pages/MerchantResetPasswordConfirm';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { Map, fromJS } from 'immutable';
import {  REQUIRED, NUMBER_LETTER, PASS_MIN_LENGTH } from 'configs/constants';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

configure({ adapter: new Adapter() });

const props = {
    resetPasswordTokenStatus: null,
    userFields: Map({}),
    resetPasswordConfirm: jest.fn(),
    token: Map({}),
    clear: jest.fn(),
    router: { params: { token: 'aaaa' } },
    checkMerchantResetPasswordToken: () => {},
    merchantSignupData: fromJS({ messages: {} }),
};

const muiTheme = getMuiTheme();
const context = { context: { muiTheme }, childContextTypes: { muiTheme: React.PropTypes.object } };

describe('Container MerchantResetPasswordConfirm', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<MerchantResetPasswordConfirm {...props}/>, { ...context });
    });

    test('Should render the MerchantResetPasswordConfirm component', () => {
        expect(wrapper.find(MerchantResetPasswordConfirm).length).toBe(1);
    });

    test('MerchantResetPasswordConfirm component should have password input', () => {
        expect(wrapper.find(MerchantResetPasswordConfirm).find('input[name="password"]').length).toBe(1);
    });

    test('MerchantResetPasswordConfirm component should have confirm password input', () => {
        expect(wrapper.find(MerchantResetPasswordConfirm).find('input[name="confirmPassword"]').length).toBe(1);
    });

    test('MerchantResetPasswordConfirm component should have a button', () => {
        expect(wrapper.find(MerchantResetPasswordConfirm).find('button').length).toBe(1);
    });

    test('Password in MerchantResetPasswordConfirm component is required', () => {
        const input = wrapper.find(MerchantResetPasswordConfirm).find('input[name="password"]');
        input.simulate('change', { target: { name: 'password', value: '' } });
        expect(wrapper.state().errors.password).toBe(REQUIRED('Password'));
    });

    test('Confirm Password in MerchantResetPasswordConfirm component is required', () => {
        const input = wrapper.find(MerchantResetPasswordConfirm).find('input[name="confirmPassword"]');
        input.simulate('change', { target: { name: 'confirmPassword', value: '' } });
        expect(wrapper.state().errors.confirmPassword).toBe(REQUIRED('Confirm Password'));
    });

    test('Password in MerchantResetPasswordConfirm component requires at least one letter', () => {
        const input = wrapper.find(MerchantResetPasswordConfirm).find('input[name="password"]');
        input.simulate('change', { target: { name: 'password', value: '11152' } });
        expect(wrapper.state().errors.password).toBe(NUMBER_LETTER('Password'));
    });

    test('Password in MerchantResetPasswordConfirm component requires at least one number', () => {
        const input = wrapper.find(MerchantResetPasswordConfirm).find('input[name="password"]');
        input.simulate('change', { target: { name: 'password', value: 'kjh' } });
        expect(wrapper.state().errors.password).toBe(NUMBER_LETTER('Password'));
    });

    test('Password in MerchantResetPasswordConfirm component must be at least 8 characters!', () => {
        const input = wrapper.find(MerchantResetPasswordConfirm).find('input[name="password"]');
        input.simulate('change', { target: { name: 'password', value: '1234k67' } });
        expect(wrapper.state().errors.password).toBe(PASS_MIN_LENGTH('Password'));
    });

});
