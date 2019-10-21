import React from 'react';
import { ActiveSubscriptions } from 'components/core/ActiveSubscriptions';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import Adapter from 'enzyme-adapter-react-15';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

configure({ adapter: new Adapter() });

const props = {
    subscriptionData: fromJS({ subscriptions: [{
        id: 'sub_BgdpjT7aUsQaI2',
        created_on: 1509520893,
        current_period_start: 1509520893,
        current_period_end: 1510125693,
        user_id: 1,
        start: 1509520893,
        ended_at: null,
        status: 'active'
    }] }),
    attemptGetSubscriptions: jest.fn()
};

const elementMock = {
    mount: jest.fn(),
    destroy: jest.fn(),
    on: jest.fn(),
    update: jest.fn(),
};

const elementsMock = {
    create: jest.fn().mockReturnValue(elementMock)
};

const muiTheme = getMuiTheme();

const context = {
    context: {
        muiTheme,
        elements: elementsMock,
        registerElement: jest.fn(),
        unregisterElement: jest.fn(),
    },
    childContextTypes: {
        muiTheme: React.PropTypes.object,
        elements: React.PropTypes.object,
        registerElement: React.PropTypes.func,
        unregisterElement: React.PropTypes.func,
    }
};

describe('Container Subscriptions', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<ActiveSubscriptions {...props}/>, { ...context });
    });

    test('Should render the ActiveSubscriptions component', () => {
        expect(wrapper.length).toBe(1);
    });

});
