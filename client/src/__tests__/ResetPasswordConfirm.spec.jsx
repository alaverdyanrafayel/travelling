import React from 'react';
import { ResetPasswordConfirm } from '../app/pages/ResetPasswordConfirm';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { Map, List } from 'immutable';
import {  REQUIRED, NUMBER_LETTER, PASS_MIN_LENGTH } from 'configs/constants';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

configure({ adapter: new Adapter() });

const props = {
    resetPasswordTokenStatus: true,
    userFields: Map({}),
    resetPasswordConfirm: jest.fn(),
    token: Map({}),
    userMessages: List(),
    clear: jest.fn(),
    router: { params: { token: 'aaaa' } },
    checkResetPasswordToken: () => {}
};

const muiTheme = getMuiTheme();
const context = { context: { muiTheme }, childContextTypes: { muiTheme: React.PropTypes.object } };

describe('Container ResetPasswordConfirm', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<ResetPasswordConfirm {...props}/>, { ...context });
    });

    test('Should render the ResetPasswordConfirm component', () => {
        expect(wrapper.find(ResetPasswordConfirm).length).toBe(1);
    });

    test('ResetPasswordConfirm component should have password input', () => {
        expect(wrapper.find(ResetPasswordConfirm).find('input[name="password"]').length).toBe(1);
    });

    test('ResetPasswordConfirm component should have confirm password input', () => {
        expect(wrapper.find(ResetPasswordConfirm).find('input[name="confirmPassword"]').length).toBe(1);
    });

    test('ResetPasswordConfirm component should have a button', () => {
        expect(wrapper.find(ResetPasswordConfirm).find('button').length).toBe(1);
    });

    test('Password in ResetPasswordConfirm component is required', () => {
        const input = wrapper.find(ResetPasswordConfirm).find('input[name="password"]');
        input.simulate('change', { target: { name: 'password', value: '' } });
        expect(wrapper.state().errors.password).toBe(REQUIRED('Password'));
    });

    test('Confirm Password in ConfirmPssword component is required', () => {
        const input = wrapper.find(ResetPasswordConfirm).find('input[name="confirmPassword"]');
        input.simulate('change', { target: { name: 'confirmPassword', value: '' } });
        expect(wrapper.state().errors.confirmPassword).toBe(REQUIRED('Confirm Password'));
    });

    test('Password in ResetPasswordConfirm component requires at least one letter', () => {
        const input = wrapper.find(ResetPasswordConfirm).find('input[name="password"]');
        input.simulate('change', { target: { name: 'password', value: '11152' } });
        expect(wrapper.state().errors.password).toBe(NUMBER_LETTER('Password'));
    });

    test('Password in ResetPasswordConfirm component requires at least one number', () => {
        const input = wrapper.find(ResetPasswordConfirm).find('input[name="password"]');
        input.simulate('change', { target: { name: 'password', value: 'kjh' } });
        expect(wrapper.state().errors.password).toBe(NUMBER_LETTER('Password'));
    });

    test('Password in ResetPasswordConfirm component must be at least 8 characters!', () => {
        const input = wrapper.find(ResetPasswordConfirm).find('input[name="password"]');
        input.simulate('change', { target: { name: 'password', value: '1234k67' } });
        expect(wrapper.state().errors.password).toBe(PASS_MIN_LENGTH('Password'));
    });

});
