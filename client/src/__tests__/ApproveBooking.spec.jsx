import React from 'react';
import ApproveBooking from '../components/core/ApproveBooking';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { Map, fromJS } from 'immutable';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

configure({ adapter: new Adapter() });

const props = {
    booking: fromJS({}),
    notificationMessage: fromJS({}),
    card: fromJS({ cards: [{
        brand: 'master',
        expMonth: '10',
        expYear: '2020',
        displayNumber: '4242',
        cardId: '45454d5sds',
        address_line1: 'address_line1'
    },
    {
        brand: 'Express',
        expMonth: '11',
        expYear: '2040',
        displayNumber: '1010',
        cardId: '45454d5sds',
        address_line1: 'address_line1_2'
    }],
        message: {}
    }),
    router: { params: { bookingId: '1' } },
    attemptGetPayment: jest.fn(),
    attemptCardValidationSucceed: jest.fn(),
    attemptCharges: jest.fn(),
    attemptAddPayment: jest.fn(),
    attemptCardValidationFailed: jest.fn()
};

const store = {
    subscribe: jest.fn(),
    dispatch: jest.fn(),
    getState: jest.fn()
        .mockReturnValue(fromJS({ 
            card: {message: {message: ''}, cards: []},
            userData: { loggedInUser: { customer: { } } } 
        }))
};

const muiTheme = getMuiTheme();

const context = {
    context: {
        muiTheme,
        store: store,
    },
    childContextTypes: {
        muiTheme: React.PropTypes.object,
        store: React.PropTypes.object,
    }
};

describe('Container ApproveBooking', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<ApproveBooking {...props}/>, { ...context });
    });

    test('Should render the ApproveBooking component', () => {
        expect(wrapper.find(ApproveBooking).length).toBe(1);
    });

    test('ApproveBooking component should have 2 buttons', () => {
        expect(wrapper.find(ApproveBooking).find('button').length).toBe(2);
    });
});
