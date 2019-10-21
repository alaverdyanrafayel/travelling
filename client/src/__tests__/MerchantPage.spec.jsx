import React from 'react';
import { Business } from '../app/pages/Business';
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

describe('Container Merchant Page', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<Business {...props}/>, { ...context });
    });

    test('Should render the Business component', () => {
        expect(wrapper.find(Business).length).toBe(1);
    } );

    test('Business component should have firstName input', () => {
        expect(wrapper.find(Business).find('input[name="FNAME"]').length).toBe(1);
    });

    test('Business component should have lastName input', () => {
        expect(wrapper.find(Business).find('input[name="LNAME"]').length).toBe(1);
    });

    test('Business component should have email input', () => {
        expect(wrapper.find(Business).find('input[name="EMAIL"]').length).toBe(1);
    });

    test('Business component should have phoneNumber input', () => {
        expect(wrapper.find(Business).find('input[name="PHONE"]').length).toBe(1);
    });

    test('Business component should have a button', () => {
        expect(wrapper.find(Business).find('button').length).toBe(2);
    });

    test('FirstName is required', () => {
        const input = wrapper.find(Business).find('input[name="FNAME"]');
        input.simulate('change', { target: { name: 'FNAME', value: '' } });
        expect(wrapper.state().errors.FNAME).toBe(REQUIRED('First Name'));
    });

    test('Last name is required', () => {
        const input = wrapper.find(Business).find('input[name="LNAME"]');
        input.simulate('change', { target: { name: 'LNAME', value: '' } });
        expect(wrapper.state().errors.LNAME).toBe(REQUIRED('Last Name'));
    });

    test('Email is required', () => {
        const input = wrapper.find(Business).find('input[name="EMAIL"]');
        input.simulate('change', { target: { name: 'EMAIL', value: '' } });
        expect(wrapper.state().errors.EMAIL).toBe(REQUIRED('Email'));
    });

    test('Phone is required', () => {
        const input = wrapper.find(Business).find('input[name="PHONE"]');
        input.simulate('change', { target: { name: 'PHONE', value: '' } });
        expect(wrapper.state().errors.PHONE).toBe(REQUIRED('Phone'));
    });

});
