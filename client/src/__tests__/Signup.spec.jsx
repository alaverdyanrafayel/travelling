import React from 'react';
import { Signup } from '../app/pages/Signup';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { Map } from 'immutable';
import {
    INVALID_EMAIL,
    REQUIRED,
    NUMBER_LETTER,
    PASS_MIN_LENGTH } from 'configs/constants';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

configure({ adapter: new Adapter() });

function Router () {
    this.router = [];

    this.location = { query: { mode: '' } },

    this.push = function(a) {
        this.router.push(a);
    };
}

const props = {
    userFields: Map({}),
    router: new Router(),
    userErrors: Map({}),
    loggedInUser: Map({}),
    loadingData: Map({}),
};

const muiTheme = getMuiTheme();
const context = { context: { muiTheme }, childContextTypes: { muiTheme: React.PropTypes.object } };

describe('Container SignUp', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<Signup {...props}/>, { ...context });
    });

    test('Should render the signup component', () => {
        expect(wrapper.find(Signup).length).toBe(1);
    });

    test('Signup component should have email input', () => {
        expect(wrapper.find(Signup).find('input[name="email"]').length).toBe(1);
    });

    test('Checkbox is empty!', () => {
        expect(wrapper.find(Signup).find('input[name="hasReadTerms"]').length).toBe(1);
    });

    test('Signup component should have password input', () => {
        expect(wrapper.find(Signup).find('input[name="password"]').length).toBe(1);
    });

    test('Signup component should have a button', () => {
        expect(wrapper.find(Signup).find('button').length).toBe(1);
    });

    test('Email is required', () => {
        const input = wrapper.find(Signup).find('input[name="email"]');
        input.simulate('change', { target: { name: 'email', value: '' } });
        expect(wrapper.state().errors.email).toBe(REQUIRED('Email'));
    });

    test('Password is required', () => {
        const input = wrapper.find(Signup).find('input[name="password"]');
        input.simulate('change', { target: { name: 'password', value: '' } });
        expect(wrapper.state().errors.password).toBe(REQUIRED('Password'));
    });

    test('Email is invalid', () => {
        const input = wrapper.find(Signup).find('input[name="email"]');
        input.simulate('change', { target: { name: 'email', value: 'ex' } });
        expect(wrapper.state().errors.email).toBe(INVALID_EMAIL('Email'));
    });

    test('Signup password requires at least one letter', () => {
        const input = wrapper.find(Signup).find('input[name="password"]');
        input.simulate('change', { target: { name: 'password', value: '11152' } });
        expect(wrapper.state().errors.password).toBe(NUMBER_LETTER('Password'));
    });

    test('Signup password requires at least one number', () => {
        const input = wrapper.find(Signup).find('input[name="password"]');
        input.simulate('change', { target: { name: 'password', value: 'kjh' } });
        expect(wrapper.state().errors.password).toBe(NUMBER_LETTER('Password'));
    });

    test('Signup password must be at least 8 characters!', () => {
        const input = wrapper.find(Signup).find('input[name="password"]');
        input.simulate('change', { target: { name: 'password', value: '1234k67' } });
        expect(wrapper.state().errors.password).toBe(PASS_MIN_LENGTH('Password'));
    });

});
