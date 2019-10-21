import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { Map } from 'immutable';
import { FriendReferralForm } from 'components/core/FriendReferralForm';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { REQUIRED } from 'configs/constants';

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
    location: { location: { query: '' } },
    loadingData: Map({}),
};

const muiTheme = getMuiTheme();
const context = { context: { muiTheme }, childContextTypes: { muiTheme: React.PropTypes.object } };

describe('Component FriendReferralForm', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<FriendReferralForm {...props}/>, { ...context });
    });

    test('Should render the FriendReferralForm component', () => {
        expect(wrapper.find(FriendReferralForm).length).toBe(1);
    });

    test('FriendReferralForm component should have email input', () => {
        expect(wrapper.find(FriendReferralForm).find('input[name="email"]').length).toBe(1);
    });

    test('FriendReferralForm component should have a button', () => {
        expect(wrapper.find(FriendReferralForm).find('button').length).toBe(1);
    });

    test('Email is required', () => {
        const input = wrapper.find(FriendReferralForm).find('input[name="email"]');
        input.simulate('change', { target: { name: 'email', value: '' } });
        expect(wrapper.state().errors.email).toBe(REQUIRED('Email'));
    });
});
