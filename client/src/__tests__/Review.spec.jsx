import React from 'react';
import { Review } from '../app/pages/order/Review';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { Map, fromJS } from 'immutable';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

configure({ adapter: new Adapter() });

const props = {
    userFields: Map({}),
    router: { params: { id: '4' } },
    attemptGetBooking: jest.fn(),
    bookingData: fromJS({ singleBooking: { merchant: { email: 'merchant@gmail.com' } }, message: '2' }),
};

const muiTheme = getMuiTheme();
const context = { context: { muiTheme }, childContextTypes: { muiTheme: React.PropTypes.object } };

describe('Container Review', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<Review {...props}/>, { ...context });
    });

    test('Should render the Review component', () => {
        expect(wrapper.find(Review).length).toBe(1);
    });

    test('Review component should have a button', () => {
        expect(wrapper.find(Review).find('button').length).toBe(1);
    });

});
