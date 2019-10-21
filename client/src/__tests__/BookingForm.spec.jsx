import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { Map } from 'immutable';
import { REQUIRED } from 'configs/constants';
import { BookingForm } from 'components/core/BookingForm';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

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
const context = { context: { muiTheme, loggedInUser: Map({ merchant: { surcharge: '' } }) }, childContextTypes: { muiTheme: React.PropTypes.object } };

describe('Component BookingForm', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<BookingForm {...props}/>, { ...context });
    });

    test('Should render the BookingForm component', () => {
        expect(wrapper.find(BookingForm).length).toBe(1);
    });

    test('Booking Form component should have Merchant Reference input', () => {
        expect(wrapper.find(BookingForm).find('input[name="merchantReference"]').length).toBe(1);
    });

    test('Booking Form component should have Merchant Name input', () => {
        expect(wrapper.find(BookingForm).find('input[name="merchantName"]').length).toBe(1);
    });

    test('Booking Form component should have Base Value input', () => {
        expect(wrapper.find(BookingForm).find('input[name="baseValue"]').length).toBe(1);
    });

    test('Booking Form component should have Surcharge input', () => {
        expect(wrapper.find(BookingForm).find('input[name="surcharge"]').length).toBe(1);
    });

    test('Booking Form component should have email input', () => {
        expect(wrapper.find(BookingForm).find('input[name="email"]').length).toBe(1);
    });

    test('Booking Form component should have buttons', () => {
        expect(wrapper.find(BookingForm).find('button').length).toBe(2);
    });

    test('Name is required', () => {
        const input = wrapper.find(BookingForm).find('input[name="merchantName"]');
        input.simulate('change', { target: { name: 'merchantName', value: '' } });
        expect(wrapper.state().bookingErrors.merchantName).toBe(REQUIRED('Name'));
    });

    test('Base Value is required', () => {
        const input = wrapper.find(BookingForm).find('input[name="baseValue"]');
        input.simulate('change', { target: { name: 'baseValue', value: '' } });
        expect(wrapper.state().pricingErrors.baseValue).toBe(REQUIRED('Base Value'));
    });

    test('Surcharge is required', () => {
        const input = wrapper.find(BookingForm).find('input[name="surcharge"]');
        input.simulate('change', { target: { name: 'surcharge', value: '' } });
        expect(wrapper.state().pricingErrors.surcharge).toBe(REQUIRED('Surcharge'));
    });

    test('Email is required', () => {
        const input = wrapper.find(BookingForm).find('input[name="email"]');
        input.simulate('change', { target: { name: 'email', value: '' } });
        expect(wrapper.state().emailErrors.email).toBe(REQUIRED('Email'));
    });
});
