import React from 'react';
import { ResetPassword } from '../app/pages/ResetPassword';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { Map, List } from 'immutable';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { INVALID_EMAIL, REQUIRED } from 'configs/constants';

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
    userMessages: List(),
    clear: jest.fn()
};

const muiTheme = getMuiTheme();
const context = { context: { muiTheme }, childContextTypes: { muiTheme: React.PropTypes.object } };

describe('ResetPassword Component', () => {

    let wrapper;

    beforeEach(() => {
        wrapper = mount(<ResetPassword {...props}/>, { ...context });
    });

    test('Should render the ResetPassword component', () => {
        expect(wrapper.find(ResetPassword).length).toBe(1);
    });

    test('ResetPassword component should have email input', () => {
        expect(wrapper.find(ResetPassword).find('input[name="email"]').length).toBe(1);
    });

    test('ResetPassword component should have a button', () => {
        expect(wrapper.find(ResetPassword).find('button').length).toBe(1);
    });

    test('Email in ResetPassword is required', () => {
        const input = wrapper.find(ResetPassword).find('input[name="email"]');
        input.simulate('change', { target: { name: 'email', value: '' } });
        expect(wrapper.state().errors.email).toBe(REQUIRED('Email'));
    });

    test('Email in ResetPassword is invalid', () => {
        const input = wrapper.find(ResetPassword).find('input[name="email"]');
        input.simulate('change', { target: { name: 'email', value: 'ex' } });
        expect(wrapper.state().errors.email).toBe(INVALID_EMAIL('Email'));
    });

});
