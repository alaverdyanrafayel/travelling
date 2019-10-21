import React from 'react';
import { MerchantSignup } from '../app/pages/MerchantSignup';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { Map } from 'immutable';
import { REQUIRED } from 'configs/constants';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

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

describe('Merchant SignUp', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<MerchantSignup {...props}/>, { ...context });
    });

    test('Should render the signup component', () => {
        expect(wrapper.find(MerchantSignup).length).toBe(1);
    });

    test('Merchant Signup component should have email input', () => {
        expect(wrapper.find(MerchantSignup).find('input[name="email"]').length).toBe(1);
    });

    test('Merchant Signup component should have inviteCode input', () => {
        expect(wrapper.find(MerchantSignup).find('input[name="inviteCode"]').length).toBe(1);
    });

    test('Merchant Signup component should have a button', () => {
        expect(wrapper.find(MerchantSignup).find('button').length).toBe(1);
    });

    test('Email is required', () => {
        const input = wrapper.find(MerchantSignup).find('input[name="email"]');
        input.simulate('change', { target: { name: 'email', value: '' } });
        expect(wrapper.state().errorsMain.email).toBe(REQUIRED('Email'));
    });

    test('InviteCode is required', () => {
        const input = wrapper.find(MerchantSignup).find('input[name="inviteCode"]');
        input.simulate('change', { target: { name: 'inviteCode', value: '' } });
        expect(wrapper.state().errorsMain.inviteCode).toBe(REQUIRED('inviteCode'));
    });

});
