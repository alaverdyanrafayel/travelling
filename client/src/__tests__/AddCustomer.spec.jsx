import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { Map } from 'immutable';
import { REQUIRED } from 'configs/constants';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { AddCustomer } from '../app/pages/AddCustomer';
import { ComboDatePicker } from 'components/form-elements';

configure({ adapter: new Adapter() });

function Router () {
    this.router = [];

    this.push = (a) => {
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

describe('Container AddCustomer', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<AddCustomer {...props}/>, { ...context });
    });

    test('Should render the addCustomer component', () => {
        expect(wrapper.find(AddCustomer).length).toBe(1);
    });

    test('AddCustomer component should have firstName input', () => {
        expect(wrapper.find(AddCustomer).find('input[name="firstName"]').length).toBe(1);
    });

    test('AddCustomer component should have middleName input', () => {
        expect(wrapper.find(AddCustomer).find('input[name="middleName"]').length).toBe(1);
    });

    test('AddCustomer component should have lastName input', () => {
        expect(wrapper.find(AddCustomer).find('input[name="lastName"]').length).toBe(1);
    });

    test('AddCustomer component should have email input', () => {
        expect(wrapper.find(AddCustomer).find('input[name="email"]').length).toBe(1);
    });

    test('AddCustomer component should have dob input', () => {
        expect(wrapper.find(ComboDatePicker).length).toBe(1);
    });

    test('AddCustomer component should have a button', () => {
        expect(wrapper.find(AddCustomer).find('button.btn-signup').length).toBe(1);
    });

    test('FirstName is required', () => {
        const input = wrapper.find(AddCustomer).find('input[name="firstName"]');
        input.simulate('change', { target: { name: 'firstName', value: '' } });
        expect(wrapper.state().errors.firstName).toBe(REQUIRED('First Name'));
    });

    test('LastName is required', () => {
        const input = wrapper.find(AddCustomer).find('input[name="lastName"]');
        input.simulate('change', { target: { name: 'lastName', value: '' } });
        expect(wrapper.state().errors.lastName).toBe(REQUIRED('Last Name'));
    });
});
