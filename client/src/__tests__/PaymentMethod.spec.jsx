import React from 'react';
import { PaymentMethods } from '../app/pages/PaymentMethods';
import { mount } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { fromJS } from 'immutable';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
configure({ adapter: new Adapter() });
const props = {
    params: {
        cardId: null
    },
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
    }]
    }),
    attemptGetPayment: jest.fn(),
    attemptDeletePayment: jest.fn(),
};
const muiTheme = getMuiTheme();
const store = {
    subscribe: jest.fn(),
    dispatch: jest.fn(),
    getState: jest.fn()
        .mockReturnValue(fromJS({ 
            card: {message: {}, cards: []},
            userData: { loggedInUser: { customer: { } } } 
        }))
};
const context = {
    context: {
        muiTheme,
        registerElement: jest.fn(),
        unregisterElement: jest.fn(),
        store: store,
    },
    childContextTypes: {
        muiTheme: React.PropTypes.object,
        registerElement: React.PropTypes.func,
        unregisterElement: React.PropTypes.func,
        store: React.PropTypes.object,
    }
};
describe('Component Payment Form', () => {
    let wrapper;
    beforeEach(()=> {
        wrapper = mount(<PaymentMethods {...props}/>, { ...context } );
    });
    test(`Payment Methods's displayNumber is rendered correctly`, () => {
        expect(wrapper.find(PaymentMethods).find("table")
                .find('tbody')
                .find('tr')
                .find('td')
                .first()
                .text()).toEqual('4242');
    });
    test(`Payment Methods's expiration date is rendered correctly`, () => {

        expect(wrapper.find(PaymentMethods).find("table")
                .find('tbody')
                .find('tr')
                .first()
                .find('td')
                .get(1).props.children[0]).toBe('10');
        expect(wrapper.find(PaymentMethods).find("table")
                    .find('tbody')
                    .find('tr')
                    .first()
                    .find('td')
                    .get(1).props.children[2]).toBe('2020');
    });
    test(`Payment Methods's delete buttons are rendered correctly`, () => {
        expect(wrapper.find(PaymentMethods).find("table")
                .find('tbody')
                .find('tr')
                .find('td')
                .find('.btn-del').length).toBe(2);
    });
    test('attemptDeletePayment is called when clicking on delete icon', () => {
        wrapper.find(PaymentMethods).find("table")
                .find('tbody')
                .find('tr')
                .find('span.fa-trash')
                .first()
                .simulate('click');
        expect(wrapper.props().attemptDeletePayment).toHaveBeenCalled()
    });
});