import React from 'react';
import { MerchantLogIn } from '../app/pages/MerchantLogin';
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
    merchantFields: Map({}),
    router: new Router(),
    merchantErrors: Map({}),
    loggedInUser: Map({}),
    location: { location: { query: '' } },
    loadingData: Map({}),
};

const muiTheme = getMuiTheme();
const context = { context: { muiTheme }, childContextTypes: { muiTheme: React.PropTypes.object } };

describe('Merchant LogIn', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<MerchantLogIn {...props}/>, { ...context });
    });

    test('Should render the Merchant Login component', () => {
        expect(wrapper.find(MerchantLogIn).length).toBe(1);
    });

    test('Merchant Login component should have email input', () => {
        expect(wrapper.find(MerchantLogIn).find('input[name="email"]').length).toBe(1);
    });

    test('Merchant Login component should have password input', () => {
        expect(wrapper.find(MerchantLogIn).find('input[name="password"]').length).toBe(1);
    });

    test('Merchant Login component should have a button', () => {
        expect(wrapper.find(MerchantLogIn).find('button').length).toBe(1);
    });

    test('Email is required', () => {
        const input = wrapper.find(MerchantLogIn).find('input[name="email"]');
        input.simulate('change', { target: { name: 'email', value: '' } });
        expect(wrapper.state().errors.email).toBe(REQUIRED('Email'));
    });

    test('Password is required', () => {
        const input = wrapper.find(MerchantLogIn).find('input[name="password"]');
        input.simulate('change', { target: { name: 'password', value: '' } });
        expect(wrapper.state().errors.password).toBe(REQUIRED('Password'));
    });

});
